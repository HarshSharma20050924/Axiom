import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { X, CreditCard, Apple, CheckCircle2, Package } from 'lucide-react';

export const MagneticCheckout: React.FC = () => {
  const { cart, checkoutState, setCheckoutState, addNotification, toggleVault } = useStore();
  const [holdProgress, setHoldProgress] = useState(0);
  
  const total = cart.reduce((acc, item) => acc + item.price, 0);

  // Auto-close after success
  useEffect(() => {
    if (checkoutState === 'success') {
      const timer = setTimeout(() => {
        setCheckoutState('idle');
        toggleVault(false);
        // In a real app, clear cart here
        addNotification("Shipment Manifest Generated", "success");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [checkoutState, setCheckoutState, toggleVault, addNotification]);

  const handleHoldStart = () => {
    if (checkoutState === 'active') {
      setCheckoutState('processing');
    }
  };

  const handleHoldEnd = () => {
    if (checkoutState === 'processing' && holdProgress < 100) {
      setCheckoutState('active');
      setHoldProgress(0);
    }
  };

  // Simulate Hold Progress
  useEffect(() => {
    let interval: number;
    if (checkoutState === 'processing') {
      interval = window.setInterval(() => {
        setHoldProgress((prev) => {
          if (prev >= 100) {
            setCheckoutState('success');
            return 100;
          }
          return prev + 1.5; // Progress speed
        });
      }, 16);
    } else {
        setHoldProgress(0);
    }
    return () => clearInterval(interval);
  }, [checkoutState, setCheckoutState]);

  return (
    <AnimatePresence>
      {checkoutState !== 'idle' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-[#050505] flex flex-col md:flex-row"
        >
            {/* Visuals / Receipt Side */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden bg-neutral-900">
                {cart.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 1.2 }}
                        animate={{ opacity: 1 - (index * 0.2), scale: 1, x: index * 20, y: index * 20 }}
                        className="absolute inset-0"
                    >
                         <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-overlay opacity-50" />
                    </motion.div>
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
                
                <div className="absolute bottom-12 left-12">
                    <h2 className="text-4xl font-serif text-white mb-2">Acquisition Manifest</h2>
                    <p className="text-xs font-mono text-neutral-400">{cart.length} ITEMS • GLOBAL PRIORITY SHIPPING</p>
                </div>
            </div>

            {/* Interaction Side */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center items-center p-12 relative">
                <button 
                    onClick={() => setCheckoutState('idle')}
                    className="absolute top-8 right-8 text-neutral-500 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                {checkoutState !== 'success' ? (
                    <div className="w-full max-w-md space-y-12">
                        {/* Summary */}
                        <div className="text-center">
                            <span className="text-xs uppercase tracking-widest text-neutral-500 mb-2 block">Total due</span>
                            <span className="text-6xl font-serif text-white font-light">${total.toLocaleString()}</span>
                        </div>

                        {/* Payment Method Selector (Visual Only) */}
                        <div className="flex justify-center gap-6 opacity-50">
                            <div className="flex items-center gap-2 border border-white/20 px-4 py-2 rounded-full">
                                <Apple size={16} />
                                <span className="text-[10px] uppercase tracking-wider">Pay</span>
                            </div>
                            <div className="flex items-center gap-2 border border-white/20 px-4 py-2 rounded-full bg-white text-black">
                                <CreditCard size={16} />
                                <span className="text-[10px] uppercase tracking-wider">Card ending 8842</span>
                            </div>
                        </div>

                        {/* The Magnetic Button */}
                        <div className="flex flex-col items-center gap-4">
                             <div 
                                className="relative w-24 h-24 rounded-full border border-white/20 flex items-center justify-center cursor-pointer select-none group"
                                onMouseDown={handleHoldStart}
                                onMouseUp={handleHoldEnd}
                                onTouchStart={handleHoldStart}
                                onTouchEnd={handleHoldEnd}
                             >
                                {/* Progress Ring */}
                                <svg className="absolute inset-0 w-full h-full rotate-[-90deg] pointer-events-none">
                                    <circle cx="48" cy="48" r="46" stroke="transparent" strokeWidth="2" fill="none" />
                                    <motion.circle 
                                        cx="48" cy="48" r="46" 
                                        stroke="white" 
                                        strokeWidth="4" 
                                        fill="none"
                                        strokeDasharray="289"
                                        strokeDashoffset={289 - (289 * holdProgress) / 100}
                                    />
                                </svg>
                                
                                <motion.div 
                                    animate={{ scale: checkoutState === 'processing' ? 0.9 : 1 }}
                                    className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center relative z-10"
                                >
                                     {checkoutState === 'processing' ? (
                                         <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                                     ) : (
                                         <div className="w-2 h-2 bg-black rounded-full" />
                                     )}
                                </motion.div>

                                {/* Ripple Effect Container */}
                                <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-white scale-150 pointer-events-none" style={{ display: checkoutState === 'processing' ? 'block' : 'none' }} />
                             </div>
                             <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">Hold to Confirm</span>
                        </div>
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <div className="w-24 h-24 rounded-full border border-green-500/30 bg-green-900/10 flex items-center justify-center mx-auto mb-8 text-green-500">
                             <CheckCircle2 size={48} strokeWidth={1} />
                        </div>
                        <h3 className="text-3xl font-serif text-white mb-4">Ownership Secured</h3>
                        <p className="text-sm text-neutral-400 max-w-xs mx-auto leading-relaxed">
                            Your acquisition has been recorded on the ledger. <br/>
                            A private courier will contact you shortly.
                        </p>
                        <div className="mt-8 flex justify-center gap-2 opacity-50">
                             <Package size={14} />
                             <span className="text-[10px] uppercase tracking-widest">Preparing Shipment</span>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};