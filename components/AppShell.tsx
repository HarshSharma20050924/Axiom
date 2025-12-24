import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
}

export const AppShell: React.FC<Props> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-[#050505] text-[#e5e5e5] overflow-x-hidden selection:bg-white/20 selection:text-white">
      {/* Ambient Noise Texture */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
      
      {/* Global Gradient Spotlights */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-neutral-800/[0.05] blur-[150px] rounded-full pointer-events-none" />

      {/* Main Content Stage */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};