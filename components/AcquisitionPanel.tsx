import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { DigitalPassport } from './DigitalPassport';
import { Fingerprint, Check, ShieldCheck } from 'lucide-react';
import { useStore } from '../store';

interface Props {
  product: Product;
  onAcquireStart: () => void;
}

export const AcquisitionPanel: React.FC<Props> = ({ product, onAcquireStart }) => {
  const [isHoveringPrice, setIsHoveringPrice] = useState(false);
  const [acquisitionState, setAcquisitionState] = useState<'idle' | 'processing' | 'confirmed'>('idle');
  const { addToVault, isAuthenticated } = useStore();

  const handleAcquire = () => {
    if (acquisitionState !== 'idle') return;
    
    setAcquisitionState('processing');
    onAcquireStart();

    // If already authenticated, the process is faster and doesn't show "Biometric" text as explicitly
    const delay = isAuthenticated ? 1500 : 2500;

    setTimeout(() => {
      setAcquisitionState('confirmed');
      setTimeout(() => {
        addToVault(product); // Add to global store, triggers notification
      }, 800);
    }, delay);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center px-8 lg:px-16 py-12 relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 pointer-events-none lg:hidden" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="relative z-10"
      >
        {/* Header */}
        <div className="mb-8">
           <span className="text-xs uppercase tracking-[0.2em] text-neutral-500 block mb-2">{product.designer}</span>
           <h2 className="text-5xl font-serif font-light text-white mb-2">{product.name}</h2>
           <span className="text-[10px] font-mono text-neutral-600 tracking-widest">EDITION {product.year}</span>
        </div>

        {/* Details List */}
        <div className="space-y-6 mb-12 border-l border-white/10 pl-6">
          {product.details.map((detail, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + (i * 0.1) }}
              className="flex items-center gap-3"
            >
              <span className="text-sm text-neutral-300 font-light tracking-wide">{detail}</span>
            </motion.div>
          ))}
        </div>

        {/* Price & DPP Trigger */}
        <div className="relative mb-12">
          <div 
            className="inline-block cursor-help group"
            onMouseEnter={() => setIsHoveringPrice(true)}
            onMouseLeave={() => setIsHoveringPrice(false)}
          >
            <span className="text-3xl font-light font-mono text-white border-b border-neutral-800 pb-1 group-hover:border-neutral-500 transition-colors">
              ${product.price.toLocaleString()}
            </span>
            <span className="ml-2 text-[10px] uppercase text-neutral-600 tracking-widest align-top">
              (Transparent Pricing)
            </span>
          </div>

          <AnimatePresence>
            {isHoveringPrice && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="absolute top-16 left-0 w-80 bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/10 p-6 rounded-none shadow-2xl z-50 overflow-hidden"
              >
                <DigitalPassport product={product} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* The Acquisition Interface */}
        <div className="relative">
            <AnimatePresence mode="wait">
                {acquisitionState === 'idle' && (
                    <motion.button
                        key="acquire-btn"
                        onClick={handleAcquire}
                        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,1)", color: "black" }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-6 border border-white/20 text-white uppercase tracking-[0.2em] text-xs font-medium transition-all duration-300 flex items-center justify-center gap-4 group"
                    >
                        <span>Acquire</span>
                        <span className="w-1 h-1 bg-white rounded-full group-hover:bg-black transition-colors" />
                        <span className="text-[10px] opacity-50 group-hover:opacity-100">Reserve</span>
                    </motion.button>
                )}

                {acquisitionState === 'processing' && (
                    <motion.div
                        key="processing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full py-6 border border-white/10 bg-white/5 flex items-center justify-center gap-3 text-neutral-400"
                    >
                        {isAuthenticated ? <ShieldCheck className="animate-pulse" size={20} /> : <Fingerprint className="animate-pulse text-neutral-500" size={20} />}
                        <span className="text-[10px] uppercase tracking-widest animate-pulse">
                            {isAuthenticated ? 'Verifying Member Ledger...' : 'Authenticating Biometrics...'}
                        </span>
                    </motion.div>
                )}

                {acquisitionState === 'confirmed' && (
                    <motion.div
                        key="confirmed"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full py-6 bg-white text-black flex items-center justify-center gap-3"
                    >
                        <ShieldCheck size={20} />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Ownership Secured</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
        
        {/* Trust Seal */}
        <div className="mt-8 flex items-center gap-2 opacity-30 justify-center">
            <ShieldCheck size={12} />
            <span className="text-[10px] uppercase tracking-widest">Authenticated by AXIOM Ledger</span>
        </div>

      </motion.div>
    </div>
  );
};