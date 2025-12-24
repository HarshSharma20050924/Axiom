import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MOCK_COLLECTION } from './constants';
import { ViewState } from './types';
import { useStore } from './store';
import { Curator } from './components/Curator';
import { AppShell } from './components/AppShell';
import { OrbitalNav } from './components/OrbitalNav';
import { LoadingSuspense } from './components/LoadingSuspense';
import { CollectionOrbiter } from './components/CollectionOrbiter';
import { Wayfinder } from './components/Wayfinder';
import { TeleportTransition } from './components/TeleportTransition';
import { ProductStage } from './components/ProductStage';
import { AcquisitionPanel } from './components/AcquisitionPanel';
import { TheVault } from './components/TheVault';
import { BiometricGate } from './components/BiometricGate';
import { AmbientSpotlight } from './components/AmbientSpotlight';
import { TheAtelier } from './components/TheAtelier';
import { TheJournal } from './components/TheJournal';
import { MagneticCheckout } from './components/MagneticCheckout';
import { NotificationOrb } from './components/NotificationOrb';
import { motion } from 'framer-motion';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isAcquiring, setIsAcquiring] = useState(false);
  
  // Connect to Global Store
  const { viewState, activeProduct } = useStore();

  // Simulate asset preloading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Reset acquisition animation when entering product view
  useEffect(() => {
    if (viewState === ViewState.PRODUCT) {
        setIsAcquiring(false);
    }
  }, [viewState]);

  if (loading) {
    return <LoadingSuspense />;
  }

  return (
    <AppShell>
      <AmbientSpotlight />
      <OrbitalNav />
      <TheVault />
      <BiometricGate />
      <MagneticCheckout />
      <NotificationOrb />

      <main className="relative min-h-screen">
        <AnimatePresence mode="wait">
          
          {/* COLLECTION VIEW */}
          {viewState === ViewState.COLLECTION && (
            <TeleportTransition key="collection" className="pt-24 h-screen flex flex-col">
              <div className="px-4 md:px-24 mb-4 select-none">
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-6xl md:text-[8rem] font-serif font-light tracking-tighter text-white/90 leading-[0.9]"
                >
                  {MOCK_COLLECTION.title}
                </motion.h1>
              </div>

              <div className="flex-1 min-h-0">
                <CollectionOrbiter 
                  products={MOCK_COLLECTION.products} 
                />
              </div>

              <Wayfinder 
                section="Archive" 
                subSection={MOCK_COLLECTION.title} 
                total={MOCK_COLLECTION.products.length} 
              />
            </TeleportTransition>
          )}

          {/* PRODUCT EXPERIENCE VIEW */}
          {viewState === ViewState.PRODUCT && activeProduct && (
            <TeleportTransition key="product" className="fixed inset-0 z-30 bg-[#050505] flex flex-col lg:flex-row">
              
              {/* Left: Product Stage (Visuals) */}
              <div className="lg:w-2/3 h-[50vh] lg:h-full relative">
                <ProductStage 
                  product={activeProduct} 
                  isAcquiring={isAcquiring} 
                />
              </div>

              {/* Right: Acquisition Panel (Details & Logic) */}
              <div className="lg:w-1/3 h-[50vh] lg:h-full relative bg-[#050505] lg:border-l border-white/5">
                <AcquisitionPanel 
                  product={activeProduct} 
                  onAcquireStart={() => setIsAcquiring(true)}
                />
              </div>

              <Wayfinder 
                section="Acquire" 
                subSection={activeProduct.name} 
              />
            </TeleportTransition>
          )}

          {/* ATELIER VIEW */}
          {viewState === ViewState.ATELIER && (
             <TeleportTransition key="atelier" className="fixed inset-0 z-30">
                <TheAtelier />
                <Wayfinder section="Atelier" subSection="Material Lab" />
             </TeleportTransition>
          )}

          {/* JOURNAL VIEW */}
          {viewState === ViewState.JOURNAL && (
             <TeleportTransition key="journal" className="min-h-screen">
                 <TheJournal />
                 <Wayfinder section="Journal" />
             </TeleportTransition>
          )}

        </AnimatePresence>
      </main>

      <Curator />
    </AppShell>
  );
};

export default App;