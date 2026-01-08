'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Map, ScrollText, Users, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileNav() {
    const pathname = usePathname();

    // Hide nav on login page and admin routes
    if (pathname === '/' || pathname?.startsWith('/admin')) return null;

    const navItems = [
        { name: 'Home', href: '/dashboard', icon: Home, color: 'text-sky-400' },
        { name: 'Map', href: '/map', icon: Map, color: 'text-green-400' },
        { name: 'Quests', href: '/quests', icon: ScrollText, color: 'text-yellow-400' },
        { name: 'Party', href: '/party', icon: Users, color: 'text-pink-400' },
        { name: 'Shop', href: '/shop', icon: ShoppingBag, color: 'text-purple-400' },
    ];

    return (
        <div className="fixed bottom-0 left-0 w-full z-50 px-4 pb-4 pt-2">
            <div className="glass-card flex justify-around items-center py-3 px-2 max-w-md mx-auto border-none bg-white/10 backdrop-blur-xl shadow-lg ring-1 ring-white/20 rounded-3xl">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="relative flex flex-col items-center gap-1 min-w-[60px]"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute -top-3 w-10 h-10 bg-white/10 rounded-full blur-md"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            )}

                            <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-white/15 scale-110 shadow-inner' : 'hover:bg-white/5'}`}>
                                <item.icon
                                    className={`w-6 h-6 transition-all duration-300 ${isActive ? item.color : 'text-gray-400'}`}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    fill={isActive ? "currentColor" : "none"}
                                    fillOpacity={0.2}
                                />
                            </div>

                            <span className={`text-[10px] font-bold tracking-wide transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
