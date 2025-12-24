import { Collection, Article } from './types';

export const ANIMATION_CONFIG = {
  ease: [0.23, 1, 0.32, 1] as [number, number, number, number], // "Viscous" ease
  duration: 0.8,
};

export const MOCK_COLLECTION: Collection = {
  id: 'c1',
  title: 'Obsidian & Chrome',
  description: 'A study in contrast. Darkness defined by light.',
  products: [
    {
      id: 'p1',
      name: 'Eames Lounge 670',
      designer: 'Charles & Ray Eames',
      year: '1956',
      price: 6495,
      description: 'The standard for mid-century comfort. Molded plywood and leather, assembled by hand.',
      image: 'https://picsum.photos/id/1060/800/1000', // Placeholder
      details: ['Rosewood Veneer', 'Black MCL Leather', 'Die-cast Aluminum'],
      provenance: {
        origin: 'Zeeland, Michigan',
        materials: ['7-ply Veneer', 'Aluminum', 'Leather'],
        carbonFootprint: '45kg CO2e',
        artisan: 'Herman Miller Atelier',
      }
    },
    {
      id: 'p2',
      name: 'Tizio 35 Table Lamp',
      designer: 'Richard Sapper',
      year: '1972',
      price: 680,
      description: 'A masterpiece of balance. No wires, only counterweights conducting current.',
      image: 'https://picsum.photos/id/1059/800/1000',
      details: ['Polycarbonate', 'Painted Metal', 'Halogen Source'],
      provenance: {
        origin: 'Milan, Italy',
        materials: ['Aluminum', 'Zinc Alloy'],
        carbonFootprint: '12kg CO2e',
        artisan: 'Artemide Factory',
      }
    },
    {
      id: 'p3',
      name: 'Beosound A9',
      designer: 'Øivind Alexander Slaatto',
      year: '2012',
      price: 3499,
      description: 'Sound as furniture. A circle of pure acoustic fidelity.',
      image: 'https://picsum.photos/id/1083/800/1000',
      details: ['Kvadrat Wool', 'Oak Legs', 'Active Room Compensation'],
      provenance: {
        origin: 'Struer, Denmark',
        materials: ['Anodized Aluminum', 'Polymer', 'Wood'],
        carbonFootprint: '32kg CO2e',
        artisan: 'Bang & Olufsen',
      }
    }
  ]
};

export const MOCK_JOURNAL: Article[] = [
    {
        id: 'a1',
        issueNumber: '01',
        title: 'The Silence of Carbon',
        subtitle: 'Why the absence of color creates the strongest emotional resonance in industrial design.',
        date: 'OCT 2026',
        coverImage: 'https://picsum.photos/id/109/1920/1080',
        blocks: [
            {
                type: 'header',
                content: 'Absence as Presence'
            },
            {
                type: 'paragraph',
                content: 'In a world screaming for attention, silence is a luxury commodity. The use of matte black finishes—specifically obsidian carbon textures—does not merely hide the object; it gives it a gravitational pull. It absorbs light, and in doing so, absorbs the noise of the room.'
            },
            {
                type: 'quote',
                content: '“To design in black is to design with shadow itself.” — Yohji Yamamoto'
            },
            {
                type: 'paragraph',
                content: 'The interplay between organic leather and cold aluminum creates a tension that has defined modernism for seventy years. It is not about comfort alone, but about the ceremony of sitting.'
            },
            {
                type: 'product',
                content: 'Explore the anatomy of comfort.',
                productId: 'p1'
            },
            {
                type: 'image',
                content: 'https://picsum.photos/id/237/1200/800',
                alt: 'Detail of black leather grain'
            },
            {
                type: 'header',
                content: 'The Material Archive'
            },
            {
                type: 'paragraph',
                content: 'We trace every fiber. From the sustainable forests of Michigan to the aluminum foundries of Milan. True luxury is knowing that your object did not destroy the world it inhabits.'
            }
        ]
    },
    {
        id: 'a2',
        issueNumber: '02',
        title: 'Balance & Current',
        subtitle: 'Richard Sapper and the architecture of light.',
        date: 'NOV 2026',
        coverImage: 'https://picsum.photos/id/203/1920/1080',
        blocks: [
            {
                type: 'paragraph',
                content: 'Gravity is usually an enemy of structure. For Sapper, it was a battery. The Tizio lamp famously conducts its electricity through its arms, eliminating the need for wires. It is a skeleton of pure function.'
            },
            {
                type: 'product',
                content: 'View the Tizio 35 Spec Sheet.',
                productId: 'p2'
            }
        ]
    }
];