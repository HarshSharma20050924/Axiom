import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { Info, Check, X } from 'lucide-react';

export const NotificationOrb: React.FC = () => {
  const { notifications, removeNotification } = useStore();

  return (
    <div className="fixed bottom-8 left-0 right-0 z-[80] flex flex-col items-center gap-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            onAnimationComplete={() => {
                 // Auto remove after animation completes + delay
                 setTimeout(() => removeNotification(notification.id), 3000);
            }}
            className="pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-full py-3 px-6 shadow-2xl flex items-center gap-3 min-w-[300px]"
          >
             <div className={`p-1 rounded-full ${notification.type === 'success' ? 'bg-green-900/30 text-green-400' : 'bg-white/10 text-white'}`}>
                 {notification.type === 'success' ? <Check size={12} /> : <Info size={12} />}
             </div>
             <span className="text-xs text-white font-medium flex-1">{notification.message}</span>
             <button 
                onClick={() => removeNotification(notification.id)}
                className="text-neutral-500 hover:text-white transition-colors"
             >
                <X size={12} />
             </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};