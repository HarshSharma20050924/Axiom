import React, { useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const AmbientSpotlight: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for liquid movement of the light
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 z-30 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-white opacity-[0.07] mix-blend-overlay blur-[100px]"
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      {/* Secondary sharper highlight for core focus */}
      <motion.div
        className="absolute w-[200px] h-[200px] rounded-full bg-blue-100 opacity-[0.03] mix-blend-color-dodge blur-[50px]"
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </div>
  );
};