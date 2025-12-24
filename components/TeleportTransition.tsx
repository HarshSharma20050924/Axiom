import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ANIMATION_CONFIG } from '../constants';

interface Props {
  children: ReactNode;
  className?: string;
  layoutId?: string;
}

export const TeleportTransition: React.FC<Props> = ({ children, className = "", layoutId }) => {
  return (
    <motion.div
      layoutId={layoutId}
      initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.98 }}
      animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.02 }}
      transition={{ 
        duration: 0.8, 
        ease: ANIMATION_CONFIG.ease 
      }}
      className={`w-full h-full ${className}`}
    >
      {children}
    </motion.div>
  );
};