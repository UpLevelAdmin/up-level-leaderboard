'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export default function AdventureMap() {
    const locations = [
        { id: 1, name: 'Rookie Village', x: 20, y: 80, status: 'unlocked', type: 'village' },
        { id: 2, name: 'Training Gym', x: 45, y: 60, status: 'unlocked', type: 'gym' },
        { id: 3, name: 'Crystal Cave', x: 75, y: 45, status: 'locked', type: 'dungeon' },
        { id: 4, name: 'Grand Arena', x: 50, y: 15, status: 'locked', type: 'arena' },
    ];

    return (
        <div className="min-h-screen bg-[#7AC0E7] relative overflow-hidden pb-24">
            {/* Background World Map (Placeholder Pattern) */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')]"></div>

            {/* Floating Clouds Animation */}
            <motion.div
                animate={{ x: [-100, 500] }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="absolute top-10 left-0 text-white opacity-40 text-6xl"
            >
                ☁️
            </motion.div>
            <motion.div
                animate={{ x: [-100, 500] }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear", delay: 10 }}
                className="absolute top-40 left-0 text-white opacity-30 text-8xl"
            >
                ☁️
            </motion.div>

            <div className="relative z-10 p-6 pt-12 text-center text-white">
                <h1 className="text-3xl font-bold font-poppins drop-shadow-md">Adventure Map</h1>
                <p className="opacity-90 font-nunito">Explore the world of Up Level!</p>
            </div>

            {/* Map Area */}
            <div className="relative w-full h-[60vh] mt-4">
                {locations.map((loc) => (
                    <motion.div
                        key={loc.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 * loc.id, type: 'spring' }}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 cursor-pointer"
                        style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className={`
                w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 border-white
                ${loc.status === 'locked' ? 'bg-gray-400 grayscale' : 'bg-[#FFD700] text-[#1F2E4A]'}
              `}
                        >
                            <MapPin className="w-6 h-6 fill-current" />
                        </motion.div>

                        <div className={`
              bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#1F2E4A] shadow-sm whitespace-nowrap
              ${loc.status === 'locked' ? 'opacity-60' : ''}
            `}>
                            {loc.name}
                        </div>
                    </motion.div>
                ))}

                {/* Path Lines (Simple SVG connector) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10 opacity-50">
                    <path
                        d="M 20% 80% Q 30% 70% 45% 60% T 75% 45% T 50% 15%"
                        fill="none"
                        stroke="white"
                        strokeWidth="4"
                        strokeDasharray="8 8"
                    />
                </svg>
            </div>
        </div>
    );
}
