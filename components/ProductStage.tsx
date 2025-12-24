import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Product } from '../types';
import { Maximize2, Scan, Rotate3D } from 'lucide-react';
import { ANIMATION_CONFIG } from '../constants';

interface Props {
  product: Product;
  isAcquiring: boolean;
}

export const ProductStage: React.FC<Props> = ({ product, isAcquiring }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Physics for "Tactile Inspector" (Viscous Tilt)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseX = useSpring(x, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 50, damping: 20 });
  
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);
  const brightness = useTransform(mouseY, [-0.5, 0.5], [1.1, 0.9]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || isAcquiring) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseXPct = (e.clientX - rect.left) / width - 0.5;
    const mouseYPct = (e.clientY - rect.top) / height - 0.5;
    
    x.set(mouseXPct);
    y.set(mouseYPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Zoom effect during Acquisition
  const scale = isAcquiring ? 1.5 : 1;
  const originX = 0.5;
  const originY = 0.5;

  return (
    <div 
      ref={containerRef}
      className="w-full h-[50vh] lg:h-full bg-[#080808] relative overflow-hidden perspective-1000 cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient Light Source */}
      <motion.div 
        className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent mix-blend-overlay"
        style={{ opacity: brightness }}
      />

      {/* The Product Monolith */}
      <motion.div
        className="w-full h-full relative"
        style={{ 
          rotateX: isAcquiring ? 0 : rotateX, 
          rotateY: isAcquiring ? 0 : rotateY,
          scale: isAcquiring ? 1.4 : 1,
          transition: "scale 1.5s cubic-bezier(0.23, 1, 0.32, 1)"
        }}
      >
        <motion.img
          layoutId={`product-image-${product.id}`}
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        
        {/* Detail Texture Overlay (Visible only on Zoom/Acquire) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isAcquiring ? 0.4 : 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] mix-blend-overlay pointer-events-none"
        />
      </motion.div>

      {/* Overlay UI: Depth Indicators */}
      <div className="absolute top-8 left-8 z-20 flex gap-4 pointer-events-none opacity-50">
        <Scan size={16} className="text-white" />
        <span className="text-[10px] uppercase tracking-widest text-white font-mono">
            {isAcquiring ? 'LOCKING TARGET' : 'TACTILE INSPECTOR ACTIVE'}
        </span>
      </div>

      {/* Floating 3D Badge */}
      <div className="absolute bottom-8 right-8 z-20">
         <button className="w-12 h-12 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
            <Rotate3D size={20} />
         </button>
      </div>

      {/* Decorative Grids */}
      <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent transition-all duration-700" 
           style={{ borderColor: isAcquiring ? 'rgba(255,255,255,0.05)' : 'transparent' }} />
    </div>
  );
};