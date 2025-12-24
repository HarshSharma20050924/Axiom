import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface Props {
  product: Product;
}

export const DigitalPassport: React.FC<Props> = ({ product }) => {
  // Mock data for the chart based on product complexity
  const data = [
    { subject: 'Sustainability', A: 90, fullMark: 100 },
    { subject: 'Durability', A: 98, fullMark: 100 },
    { subject: 'Craft', A: 95, fullMark: 100 },
    { subject: 'Recyclability', A: 85, fullMark: 100 },
    { subject: 'Material', A: 92, fullMark: 100 },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between">
        <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-4">Digital Product Passport</h3>
            
            <div className="space-y-6">
                <div>
                    <span className="block text-xs text-neutral-400 mb-1">Origin</span>
                    <span className="block text-sm text-white font-light tracking-wide">{product.provenance.origin}</span>
                </div>
                <div>
                    <span className="block text-xs text-neutral-400 mb-1">Artisan</span>
                    <span className="block text-sm text-white font-light tracking-wide">{product.provenance.artisan}</span>
                </div>
                <div>
                    <span className="block text-xs text-neutral-400 mb-1">Impact</span>
                    <span className="block text-sm text-white font-light tracking-wide">{product.provenance.carbonFootprint}</span>
                </div>
                <div>
                    <span className="block text-xs text-neutral-400 mb-1">Composition</span>
                    <ul className="flex flex-wrap gap-2 mt-1">
                        {product.provenance.materials.map((m, i) => (
                            <li key={i} className="text-[10px] border border-neutral-800 px-2 py-1 rounded-full text-neutral-300">
                                {m}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

        <div className="h-48 w-full -ml-4 mt-4 opacity-50 hover:opacity-100 transition-opacity duration-700">
             <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 10 }} />
                <Radar
                    name="Score"
                    dataKey="A"
                    stroke="#e5e5e5"
                    strokeWidth={1}
                    fill="#e5e5e5"
                    fillOpacity={0.1}
                />
                </RadarChart>
            </ResponsiveContainer>
        </div>
        
        <div className="mt-4 pt-4 border-t border-neutral-800">
            <div className="flex justify-between items-center">
                <span className="text-[10px] text-neutral-600 font-mono">ID: {product.id.toUpperCase()}-AXIOM-AUTH</span>
                <div className="h-2 w-2 bg-green-900 rounded-full animate-pulse shadow-[0_0_10px_#14532d]"></div>
            </div>
        </div>
    </div>
  );
};
