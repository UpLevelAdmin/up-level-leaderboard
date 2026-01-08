'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Zap, Trophy, Users, User, Store } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();

    if (pathname === '/' || pathname === '/login' || pathname.startsWith('/admin')) return null;

    const tabs = [
        { id: 'dashboard', label: 'Home', icon: Home, path: '/dashboard' },
        { id: 'quests', label: 'Quests', icon: Zap, path: '/quests' },
        { id: 'leaderboard', label: 'Rank', icon: Trophy, path: '/leaderboard' },
        { id: 'party', label: 'Party', icon: Users, path: '/party' },
        { id: 'shop', label: 'Shop', icon: Store, path: '/shop' },
    ];

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-lg border-t border-slate-200 pb-safe pt-2 px-6 shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.1)] z-50">
            <div className="flex justify-between items-center max-w-md mx-auto relative">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.path;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => router.push(tab.path)}
                            className={`relative flex flex-col items-center gap-1 p-2 transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute -top-2 w-12 h-1 bg-blue-500 rounded-full shadow-[0_4px_12px_rgba(59,130,246,0.5)]"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <tab.icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[9px] font-bold tracking-wide">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
