import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useVelocity } from 'framer-motion';
import { Product } from '../types';
import { ANIMATION_CONFIG } from '../constants';
import { useStore } from '../store';

interface Props {
  products: Product[];
}

const ProductCard: React.FC<{ 
  product: Product; 
  index: number; 
  onSelect: () => void;
  skew: any; // MotionValue
}> = ({ product, index, onSelect, skew }) => {
  return (
    <motion.div
      layoutId={`product-card-${product.id}`}
      style={{ skewX: skew }}
      className="relative flex-shrink-0 w-[85vw] md:w-[35vw] h-[60vh] md:h-[70vh] mr-8 md:mr-16 cursor-pointer group origin-bottom"
      onClick={onSelect}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        delay: index * 0.1, 
        duration: 1, 
        ease: ANIMATION_CONFIG.ease 
      }}
    >
      {/* Image Container with Parallax Effect */}
      <div className="w-full h-full overflow-hidden bg-[#0A0A0A] relative">
        <motion.img
          layoutId={`product-image-${product.id}`}
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.2s] ease-[0.23,1,0.32,1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
      </div>

      {/* Floating Info Deck */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end items-start">
        <div className="overflow-hidden mb-2">
          <motion.h3 
            className="text-2xl md:text-4xl font-serif text-white transform translate-y-0 transition-transform duration-500"
          >
            {product.name}
          </motion.h3>
        </div>
        
        <div className="w-full flex justify-between items-end border-t border-white/20 pt-4 mt-2">
          <div className="flex flex-col">
             <span className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Designer</span>
             <span className="text-xs text-neutral-200">{product.designer}</span>
          </div>
          <span className="text-xl font-light font-mono text-white">${product.price.toLocaleString()}</span>
        </div>
        
        {/* Hover interaction hint */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
            <span className="px-4 py-2 border border-white/30 rounded-full text-[10px] uppercase tracking-[0.2em] backdrop-blur-md bg-black/20">
                Explore
            </span>
        </div>
      </div>
    </motion.div>
  );
};

export const CollectionOrbiter: React.FC<Props> = ({ products }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const { setActiveProduct } = useStore();

  // Physics for Viscous Drag
  const x = useMotionValue(0);
  const xVelocity = useVelocity(x);
  
  // Transform velocity into a skew value for "jelly" effect
  // Range: Velocity -1000 to 1000 -> Skew -5deg to 5deg
  const skew = useTransform(xVelocity, [-1000, 0, 1000], [5, 0, -5]);
  const springSkew = useSpring(skew, { stiffness: 100, damping: 30 });

  useEffect(() => {
    if (containerRef.current) {
      // Calculate total scrollable width: scrollWidth - clientWidth
      setWidth(containerRef.current.scrollWidth - containerRef.current.offsetWidth);
    }
  }, [products]);

  return (
    <div className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing pb-12 relative">
      <motion.div 
        ref={containerRef}
        className="flex items-center px-4 md:px-24 h-full pt-12"
        drag="x"
        dragConstraints={{ right: 0, left: -width }}
        dragElastic={0.1} // Heavy resistance at edges
        dragTransition={{ power: 0.1, timeConstant: 400 }} // Heavy inertia ("Viscous")
        style={{ x }}
      >
        {/* Intro Spacer text - Parallaxed slightly against drag */}
        <div className="flex-shrink-0 w-[85vw] md:w-[25vw] mr-16 flex flex-col justify-center select-none">
             <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-6">The Collection</h2>
             <p className="text-xl md:text-2xl font-serif text-neutral-300 leading-relaxed">
                 Objects of permanence. <br/> 
                 Selected for their ability to <br/>
                 withstand the erosion of time.
             </p>
             <div className="w-12 h-[1px] bg-white/20 mt-8" />
             <div className="mt-8 flex items-center gap-2 opacity-40">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest">Drag to explore</span>
             </div>
        </div>

        {products.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            index={index} 
            onSelect={() => setActiveProduct(product)}
            skew={springSkew}
          />
        ))}
        
        {/* Outro Spacer */}
        <div className="flex-shrink-0 w-[20vw]" />
      </motion.div>
    </div>
  );
};