import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, ScanLine, Lock, Unlock } from 'lucide-react';
import { useStore } from '../store';

export const BiometricGate: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authenticate } = useStore();
  const [scanProgress, setScanProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success'>('idle');

  useEffect(() => {
    if (!isAuthModalOpen) {
      setScanProgress(0);
      setStatus('idle');
    }
  }, [isAuthModalOpen]);

  const handleStartScan = () => {
    setStatus('scanning');
  };

  const handleEndScan = () => {
    if (status !== 'success') {
      setStatus('idle');
      setScanProgress(0);
    }
  };

  // Simulate scan progress while holding
  useEffect(() => {
    let interval: number;
    if (status === 'scanning') {
      interval = window.setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            setStatus('success');
            setTimeout(() => {
                authenticate();
            }, 1000);
            return 100;
          }
          return prev + 2; // Speed of scan
        });
      }, 16);
    }
    return () => clearInterval(interval);
  }, [status, authenticate]);

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center cursor-crosshair"
        >
          {/* Close trigger */}
          <button 
            onClick={closeAuthModal} 
            className="absolute top-8 right-8 text-neutral-500 hover:text-white uppercase text-[10px] tracking-widest z-20"
          >
            Abort Protocol
          </button>

          <div className="relative flex flex-col items-center justify-center">
             
             {/* The Scanner */}
             <div 
                className="relative w-64 h-64 flex items-center justify-center mb-12 select-none touch-none"
                onMouseDown={handleStartScan}
                onMouseUp={handleEndScan}
                onTouchStart={handleStartScan}
                onTouchEnd={handleEndScan}
             >
                {/* Outer Ring */}
                <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                  <circle cx="128" cy="128" r="120" stroke="#1a1a1a" strokeWidth="2" fill="none" />
                  <motion.circle 
                    cx="128" cy="128" r="120" 
                    stroke="#e5e5e5" 
                    strokeWidth="2" 
                    fill="none"
                    strokeDasharray="754"
                    strokeDashoffset={754 - (754 * scanProgress) / 100}
                  />
                </svg>

                {/* Inner Icon */}
                <div className="relative z-10 text-white opacity-80">
                    <AnimatePresence mode="wait">
                        {status === 'success' ? (
                            <motion.div
                                key="unlock"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                            >
                                <Unlock size={64} strokeWidth={1} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="fingerprint"
                                animate={{ opacity: status === 'scanning' ? [0.5, 1, 0.5] : 1 }}
                                transition={{ repeat: Infinity, duration: 1 }}
                            >
                                <Fingerprint size={80} strokeWidth={0.5} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                
                {/* Scanning Beam */}
                {status === 'scanning' && (
                    <motion.div 
                        initial={{ top: '0%' }}
                        animate={{ top: '100%' }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="absolute w-full h-[2px] bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)] z-0 opacity-50"
                    />
                )}
             </div>

             {/* Text Status */}
             <div className="h-12 flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-2">
                    {status === 'idle' && 'Hold to Identify'}
                    {status === 'scanning' && 'Analyzing Biometrics...'}
                    {status === 'success' && 'Identity Verified'}
                </span>
                <AnimatePresence>
                    {status === 'success' && (
                        <motion.span 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-lg font-serif italic text-white"
                        >
                            Welcome back, Member.
                        </motion.span>
                    )}
                </AnimatePresence>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};