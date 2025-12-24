import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSuspense: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]">
      <div className="relative overflow-hidden">
        <motion.h1
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          className="text-9xl md:text-[12rem] font-serif font-bold tracking-tighter text-[#1a1a1a]"
        >
          AXIOM
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
          className="absolute bottom-4 left-0 w-full h-[2px] bg-white/20 origin-left"
        />
      </div>
    </div>
  );
};