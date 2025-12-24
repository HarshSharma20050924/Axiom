import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  section: string;
  subSection?: string;
  index?: number;
  total?: number;
}

export const Wayfinder: React.FC<Props> = ({ section, subSection, index, total }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed bottom-8 left-8 md:left-12 z-40 hidden md:flex flex-col gap-1 pointer-events-none mix-blend-difference"
    >
      <div className="flex items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-neutral-400">
          {section}
        </span>
        {subSection && (
          <>
            <span className="w-8 h-[1px] bg-neutral-600" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-white">
              {subSection}
            </span>
          </>
        )}
      </div>
      
      {index !== undefined && total !== undefined && (
        <div className="mt-2 text-[10px] font-mono text-neutral-500 tracking-widest">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>
      )}
    </motion.div>
  );
};