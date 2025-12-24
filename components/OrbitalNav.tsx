import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Menu, User, UserCheck } from 'lucide-react';
import { ViewState } from '../types';
import { useStore } from '../store';

export const OrbitalNav: React.FC = () => {
  const { viewState, setActiveProduct, setViewState, cart, toggleVault, isAuthenticated, openAuthModal } = useStore();
  const cartCount = cart.length;

  const handleBack = () => {
    // Reset to collection view
    setActiveProduct(null);
  };

  const navItems = [
    { label: 'Archive', state: ViewState.COLLECTION },
    { label: 'Journal', state: ViewState.JOURNAL },
    { label: 'Atelier', state: ViewState.ATELIER }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ delay: 1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      className="fixed top-0 left-0 right-0 z-40 p-6 md:p-8 flex justify-between items-start pointer-events-none"
    >
      {/* Left Orbital: Brand & Navigation */}
      <div className="pointer-events-auto flex items-center gap-6">
        <AnimatePresence mode="wait">
          {viewState === ViewState.PRODUCT ? (
            <motion.button
              key="back"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={handleBack}
              className="w-12 h-12 rounded-full border border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/30 transition-colors"
            >
              <ArrowLeft size={20} />
            </motion.button>
          ) : (
            <motion.div
              key="brand"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col cursor-pointer"
              onClick={() => {
                setActiveProduct(null);
                setViewState(ViewState.COLLECTION);
              }}
            >
              <span className="text-xl font-bold tracking-[0.2em] font-serif text-white">AXIOM</span>
              <span className="text-[10px] uppercase tracking-widest text-neutral-600 mt-1">Est. 2026</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Orbital: Tools */}
      <div className="pointer-events-auto flex items-center gap-4">
        {/* Auth Trigger */}
        <div className="hidden md:flex items-center">
            {isAuthenticated ? (
                 <div className="flex items-center gap-2 px-4 py-3 border border-white/10 rounded-full bg-black/50 backdrop-blur-md mr-2">
                    <UserCheck size={12} className="text-white" />
                    <span className="text-[10px] uppercase tracking-widest text-white">Obsidian Member</span>
                 </div>
            ) : (
                <button 
                    onClick={openAuthModal}
                    className="flex items-center gap-2 px-4 py-3 border border-transparent hover:border-white/10 rounded-full transition-all mr-2 group"
                >
                    <User size={12} className="text-neutral-500 group-hover:text-white" />
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 group-hover:text-white">Identify</span>
                </button>
            )}
        </div>

        <div className="hidden md:flex items-center gap-1 bg-black/50 backdrop-blur-md border border-white/5 rounded-full px-6 py-3">
          {navItems.map((item) => (
            <button 
                key={item.label} 
                onClick={() => {
                    setActiveProduct(null);
                    setViewState(item.state);
                }}
                className={`px-3 text-[10px] uppercase tracking-widest transition-colors relative group ${viewState === item.state ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
            >
              {item.label}
              <span className={`absolute -bottom-1 left-1/2 h-[1px] bg-white transition-all duration-300 ${viewState === item.state ? 'w-full left-0' : 'w-0 group-hover:w-full group-hover:left-0'}`} />
            </button>
          ))}
        </div>

        <button 
          onClick={() => toggleVault()}
          className="w-12 h-12 rounded-full border border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/30 transition-colors relative"
        >
          <ShoppingBag size={18} />
          {cartCount > 0 && (
            <span className="absolute top-3 right-3 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
          )}
        </button>
        
        <button className="md:hidden w-12 h-12 rounded-full border border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/30 transition-colors">
            <Menu size={18} />
        </button>
      </div>
    </motion.nav>
  );
};