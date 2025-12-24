import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronLeft, Quote } from 'lucide-react';
import { Article, ArticleBlock } from '../types';
import { MOCK_JOURNAL, MOCK_COLLECTION } from '../constants';
import { useStore } from '../store';

const ArticleReader: React.FC<{ article: Article; onClose: () => void }> = ({ article, onClose }) => {
    const scrollRef = useRef(null);
    const { scrollYProgress } = useScroll({ container: scrollRef });
    const { setActiveProduct } = useStore();
    
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
    const contentY = useTransform(scrollYProgress, [0, 0.1], [100, 0]);

    const handleProductClick = (productId?: string) => {
        if (!productId) return;
        const product = MOCK_COLLECTION.products.find(p => p.id === productId);
        if (product) setActiveProduct(product);
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 bg-[#050505] overflow-y-auto"
            ref={scrollRef}
        >
            {/* Nav Control */}
            <div className="fixed top-8 left-8 z-50">
                <button 
                    onClick={onClose}
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group"
                >
                    <div className="p-2 border border-white/10 rounded-full group-hover:border-white/50 bg-black/50 backdrop-blur-md">
                        <ChevronLeft size={16} />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest hidden md:inline-block">Back to Journal</span>
                </button>
            </div>

            {/* Hero Section */}
            <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
                <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="absolute inset-0">
                    <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
                </motion.div>
                
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-24 flex flex-col items-start">
                    <motion.span 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[10px] uppercase tracking-[0.3em] text-white/60 mb-4 border border-white/20 px-3 py-1 rounded-full"
                    >
                        Issue {article.issueNumber} • {article.date}
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-5xl md:text-8xl font-serif text-white max-w-4xl leading-[0.9]"
                    >
                        {article.title}
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-6 text-lg md:text-xl text-neutral-400 max-w-xl font-light leading-relaxed"
                    >
                        {article.subtitle}
                    </motion.p>
                </div>
            </div>

            {/* Content Body */}
            <motion.div 
                style={{ y: contentY }}
                className="relative max-w-3xl mx-auto px-6 py-24 md:py-32 space-y-16"
            >
                {article.blocks.map((block, idx) => {
                    switch (block.type) {
                        case 'header':
                            return (
                                <h2 key={idx} className="text-3xl font-serif text-white pt-8">
                                    {block.content}
                                </h2>
                            );
                        case 'paragraph':
                            return (
                                <p key={idx} className="text-neutral-400 text-lg leading-loose font-light">
                                    {block.content}
                                </p>
                            );
                        case 'quote':
                            return (
                                <blockquote key={idx} className="border-l-2 border-white/20 pl-8 py-2 my-8">
                                    <Quote size={24} className="text-white/20 mb-4" />
                                    <p className="text-2xl font-serif italic text-white/90 leading-normal">
                                        {block.content}
                                    </p>
                                </blockquote>
                            );
                        case 'image':
                            return (
                                <div key={idx} className="w-full my-12">
                                    <img src={block.content} alt={block.alt} className="w-full h-auto rounded-sm opacity-90" />
                                    {block.alt && <span className="block mt-2 text-[10px] uppercase tracking-widest text-neutral-600 text-center">{block.alt}</span>}
                                </div>
                            );
                        case 'product':
                            return (
                                <div key={idx} 
                                    onClick={() => handleProductClick(block.productId)}
                                    className="group my-16 border-y border-white/10 py-12 cursor-pointer relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-500" />
                                    <div className="flex justify-between items-center relative z-10">
                                        <div>
                                            <span className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 block">Object Reference</span>
                                            <span className="text-2xl font-serif text-white group-hover:underline underline-offset-8 decoration-1 decoration-white/30">
                                                {block.content}
                                            </span>
                                        </div>
                                        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                                            <ArrowRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            );
                        default:
                            return null;
                    }
                })}

                <div className="pt-32 pb-24 text-center border-t border-white/10">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-600">End of Issue {article.issueNumber}</span>
                </div>
            </motion.div>
        </motion.div>
    );
};

export const TheJournal: React.FC = () => {
    const [activeArticle, setActiveArticle] = useState<Article | null>(null);

    return (
        <>
            <div className="w-full min-h-screen pt-32 px-4 md:px-24 bg-[#050505] flex flex-col relative z-0">
                <div className="mb-24">
                     <h2 className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-6">The Journal</h2>
                     <h1 className="text-6xl md:text-9xl font-serif text-white/90">Editorial</h1>
                </div>

                <div className="grid grid-cols-1 gap-px bg-white/10 border-t border-white/10">
                    {MOCK_JOURNAL.map((article) => (
                        <div 
                            key={article.id}
                            onClick={() => setActiveArticle(article)} 
                            className="group relative bg-[#050505] py-24 cursor-pointer overflow-hidden border-b border-white/10"
                        >
                             <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-8 relative z-10">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-mono text-neutral-500 mb-4">ISSUE {article.issueNumber}</span>
                                    <h3 className="text-4xl md:text-6xl font-serif text-neutral-400 group-hover:text-white transition-colors duration-500">
                                        {article.title}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-4">
                                     <span className="text-sm text-neutral-600 group-hover:text-white transition-colors">{article.date}</span>
                                     <ArrowRight className="text-neutral-600 group-hover:text-white opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500" />
                                </div>
                             </div>
                             
                             {/* Hover Reveal Image */}
                             <motion.div 
                                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                                style={{ backgroundImage: `url(${article.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                             />
                        </div>
                    ))}
                </div>
                
                <div className="py-32 flex flex-col items-center justify-center text-neutral-600">
                    <span className="text-xs uppercase tracking-widest mb-4">Subscribe to the Archive</span>
                    <div className="flex gap-4 border-b border-neutral-800 pb-2 w-64">
                        <input type="email" placeholder="Email Address" className="bg-transparent text-white focus:outline-none w-full text-sm placeholder-neutral-700" />
                        <button className="text-xs uppercase hover:text-white">Join</button>
                    </div>
                </div>
            </div>

            {/* Article Detail View Overlay */}
            {activeArticle && (
                <ArticleReader article={activeArticle} onClose={() => setActiveArticle(null)} />
            )}
        </>
    );
};