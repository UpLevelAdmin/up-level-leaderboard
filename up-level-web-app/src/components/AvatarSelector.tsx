'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AVATAR_TIERS } from '@/lib/gameConfig';
import { Check, Lock } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

interface AvatarSelectorProps {
    currentAvatarId?: string;
    onSelect: (avatarUrl: string, avatarId: string) => void;
    userRank: string;
}

export default function AvatarSelector({ currentAvatarId, onSelect, userRank }: AvatarSelectorProps) {
    const { user } = useAuth();
    const [selectedId, setSelectedId] = useState(currentAvatarId);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Determine unlocked tiers
    const getVisibleTiers = () => {
        let tiers = { Starter: AVATAR_TIERS.STARTER };
        const r = userRank?.toLowerCase() || 'rookie';

        // Always show all tiers, but lock them visually
        return {
            Starter: AVATAR_TIERS.STARTER,
            Silver: AVATAR_TIERS.SILVER,
            Gold: AVATAR_TIERS.GOLD,
            Legend: AVATAR_TIERS.LEGEND
        };
    };

    const isUnlocked = (tierName: string) => {
        const r = userRank?.toLowerCase() || 'rookie';
        if (tierName === 'Starter') return true;
        if (tierName === 'Silver' && ['silver', 'gold', 'platinum', 'diamond', 'master', 'grandmaster', 'legend'].some(t => r.includes(t))) return true;
        if (tierName === 'Gold' && ['gold', 'platinum', 'diamond', 'master', 'grandmaster', 'legend'].some(t => r.includes(t))) return true;
        if (tierName === 'Legend' && ['legend'].some(t => r.includes(t))) return true;
        return false;
    };

    const handleConfirm = async () => {
        if (!selectedId || !user) return;
        setIsSubmitting(true);
        try {
            // Find url
            let allAvatars = [...AVATAR_TIERS.STARTER, ...AVATAR_TIERS.SILVER, ...AVATAR_TIERS.GOLD, ...AVATAR_TIERS.LEGEND];
            const target = allAvatars.find(a => a.id === selectedId);
            if (target) {
                await updateDoc(doc(db, 'users', user.uid), {
                    avatarId: target.id,
                    photoURL: target.img // Update main photoURL for easy access
                });
                onSelect(target.img, target.id);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const tiers = getVisibleTiers();

    return (
        <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-2xl font-black text-center text-[#1F2E4A] mb-2">Choose Your Avatar</h2>
            <p className="text-center text-gray-400 text-xs mb-6">Unlock more as you rank up!</p>

            <div className="space-y-6">
                {Object.entries(tiers).map(([tierName, avatars]) => {
                    const unlocked = isUnlocked(tierName);
                    return (
                        <div key={tierName} className={`relative ${!unlocked ? 'opacity-60 grayscale' : ''}`}>
                            <h3 className="font-bold text-sm text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                                {tierName} {!unlocked && <Lock className="w-3 h-3" />}
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                {avatars.map(av => (
                                    <button
                                        key={av.id}
                                        disabled={!unlocked}
                                        onClick={() => setSelectedId(av.id)}
                                        className={`relative group p-2 rounded-2xl border-2 transition-all ${selectedId === av.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-gray-50 hover:border-blue-200'}`}
                                    >
                                        <img src={av.img} className="w-full h-auto drop-shadow-md group-hover:scale-110 transition-transform" />
                                        {selectedId === av.id && (
                                            <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-0.5">
                                                <Check className="w-3 h-3" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="sticky bottom-0 bg-white pt-4 mt-6 border-t border-gray-100">
                <button
                    disabled={!selectedId || isSubmitting}
                    onClick={handleConfirm}
                    className="w-full bg-[#4A90E2] hover:bg-[#357ABD] text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
                >
                    {isSubmitting ? 'Saving...' : 'Confirm Selection'}
                </button>
            </div>
        </div>
    );
}
