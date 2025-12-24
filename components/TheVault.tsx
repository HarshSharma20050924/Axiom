import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '../store';
import { ANIMATION_CONFIG } from '../constants';

export const TheVault: React.FC = () => {
  const { cart, isVaultOpen, toggleVault, removeFromVault, setCheckoutState } = useStore();

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  const handleCheckout = () => {
    setCheckoutState('active');
    // We do NOT close the vault here, as MagneticCheckout overlays it
  };

  return (
    <AnimatePresence>
      {isVaultOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleVault(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Vault Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 w-full md:w-[600px] h-full bg-[#080808] border-l border-white/10 z-[60] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#0A0A0A]">
              <div>
                <h2 className="text-xl font-serif text-white tracking-wide">The Vault</h2>
                <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">
                  Secure Manifest ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                </p>
              </div>
              <button 
                onClick={() => toggleVault(false)}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-600">
                  <span className="text-sm font-light">The archives are empty.</span>
                  <button 
                    onClick={() => toggleVault(false)}
                    className="mt-4 text-[10px] uppercase tracking-widest border-b border-neutral-700 pb-1 hover:border-white hover:text-white transition-colors"
                  >
                    Return to Collection
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {cart.map((item) => (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group relative border-b border-white/5 pb-8"
                    >
                      <div className="flex gap-6">
                        <div className="w-24 h-24 bg-neutral-900 overflow-hidden relative">
                           <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80" />
                        </div>
                        <div className="flex-1">
                           <div className="flex justify-between items-start mb-2">
                             <h3 className="text-lg font-serif text-white">{item.name}</h3>
                             <span className="text-sm font-mono text-neutral-400">${item.price.toLocaleString()}</span>
                           </div>
                           <p className="text-xs text-neutral-500 uppercase tracking-widest mb-4">{item.designer}</p>
                           
                           <div className="flex items-center gap-4">
                             <div className="flex items-center gap-1 text-[10px] text-green-800 bg-green-900/10 px-2 py-1 border border-green-900/30">
                                <ShieldCheck size={10} />
                                <span>Verified Provenance</span>
                             </div>
                             <button 
                                onClick={() => removeFromVault(item.id)}
                                className="text-[10px] text-neutral-600 hover:text-white transition-colors uppercase tracking-wider"
                             >
                               Release
                             </button>
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer / Checkout */}
            {cart.length > 0 && (
              <div className="p-8 border-t border-white/5 bg-[#0A0A0A]">
                 <div className="flex justify-between items-end mb-8">
                    <span className="text-xs uppercase tracking-widest text-neutral-500">Total Acquisition</span>
                    <span className="text-3xl font-serif text-white">${total.toLocaleString()}</span>
                 </div>
                 <button 
                    onClick={handleCheckout}
                    className="w-full py-5 bg-white text-black text-xs uppercase tracking-[0.2em] font-medium hover:bg-neutral-200 transition-colors flex items-center justify-center gap-4"
                 >
                    <span>Initialize Transfer</span>
                    <ArrowRight size={16} />
                 </button>
                 <p className="text-center mt-4 text-[10px] text-neutral-600">
                    Secured by AXIOM Ledger. 
                 </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};