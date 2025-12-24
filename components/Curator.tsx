import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Sparkles } from 'lucide-react';
import { createCuratorChat, sendMessageToCurator } from '../services/geminiService';
import { Message } from '../types';
import { Chat } from "@google/genai";
import { useStore } from '../store';

export const Curator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useStore();

  // Reset chat when auth state changes to re-contextualize
  useEffect(() => {
    chatRef.current = null;
    const initialMsg = isAuthenticated 
        ? "Greetings, Elite Member. The archives are open to you. What details do you require?"
        : "Welcome to AXIOM. I am the Curator. How may I assist your discovery?";
    
    setMessages([{ role: 'model', text: initialMsg }]);
  }, [isAuthenticated]);

  useEffect(() => {
    if (isOpen && !chatRef.current) {
      chatRef.current = createCuratorChat(isAuthenticated ? "Authenticated Elite Member" : undefined);
    }
  }, [isOpen, isAuthenticated]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatRef.current) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const responseText = await sendMessageToCurator(chatRef.current, userMsg);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Trigger */}
      <motion.button
        className={`fixed bottom-8 right-8 z-50 p-4 border rounded-full shadow-2xl transition-all duration-500 ${isAuthenticated ? 'bg-white border-white text-black hover:scale-105' : 'bg-neutral-900 border-neutral-800 text-[#e5e5e5] hover:border-neutral-600'}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isAuthenticated ? <Sparkles size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className={`fixed bottom-24 right-8 w-80 md:w-96 h-[500px] backdrop-blur-xl border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden ${isAuthenticated ? 'bg-white/90 border-white text-black' : 'bg-[#0A0A0A]/90 border-neutral-800 text-white'}`}
          >
            {/* Header */}
            <div className={`p-4 border-b flex justify-between items-center ${isAuthenticated ? 'border-neutral-200 bg-white/50' : 'border-neutral-800 bg-neutral-900/50'}`}>
              <div className="flex flex-col">
                <span className={`text-xs uppercase tracking-widest font-medium ${isAuthenticated ? 'text-neutral-800' : 'text-neutral-400'}`}>
                    {isAuthenticated ? 'Private Concierge' : 'The Curator'}
                </span>
                {isAuthenticated && <span className="text-[8px] text-neutral-500 uppercase tracking-widest">Priority Channel Active</span>}
              </div>
              <button onClick={() => setIsOpen(false)} className={`hover:opacity-70 ${isAuthenticated ? 'text-black' : 'text-neutral-500'}`}>
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? (isAuthenticated ? 'bg-black text-white rounded-t-lg rounded-bl-lg' : 'bg-neutral-800 text-white rounded-t-lg rounded-bl-lg') 
                      : (isAuthenticated ? 'bg-transparent text-neutral-800 border-l border-neutral-300 pl-3' : 'bg-transparent text-neutral-300 border-l border-neutral-700 pl-3')
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <span className={`text-xs animate-pulse ${isAuthenticated ? 'text-neutral-400' : 'text-neutral-600'}`}>Thinking...</span>
                </div>
              )}
            </div>

            {/* Input */}
            <div className={`p-4 border-t ${isAuthenticated ? 'border-neutral-200 bg-white/50' : 'border-neutral-800 bg-neutral-900/50'}`}>
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isAuthenticated ? "Request details..." : "Ask about provenance..."}
                  className={`w-full border rounded-lg py-3 pl-4 pr-10 text-sm focus:outline-none transition-colors ${
                      isAuthenticated 
                      ? 'bg-neutral-50 border-neutral-200 text-black placeholder-neutral-400 focus:border-neutral-400' 
                      : 'bg-neutral-950 border-neutral-800 text-white placeholder-neutral-600 focus:border-neutral-600'
                  }`}
                />
                <button 
                  onClick={handleSend}
                  className={`absolute right-2 top-2 p-1 transition-colors ${isAuthenticated ? 'text-neutral-400 hover:text-black' : 'text-neutral-500 hover:text-white'}`}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};