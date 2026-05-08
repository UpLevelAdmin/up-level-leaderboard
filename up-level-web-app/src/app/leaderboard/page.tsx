'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Trophy, Crown, Loader2, Shield } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, doc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

const getRankEmoji = (rank: string) => {
    const r = (rank || '').toLowerCase();
    if (r.includes('god')) return '🔱';
    if (r.includes('legend')) return '👑';
    if (r.includes('grandmaster')) return '🛡️';
    if (r.includes('diamond')) return '💎';
    if (r.includes('platinum')) return '💠';
    if (r.includes('gold')) return '🥇';
    if (r.includes('silver')) return '🥈';
    if (r.includes('bronze')) return '🥉';
    return '🌱';
};

const getRankScore = (rankStr: string) => {
    const r = String(rankStr).split(' ')[0].toLowerCase();
    if (r.includes('god')) return 800;
    if (r.includes('legend')) return 700;
    if (r.includes('grandmaster')) return 600;
    if (r.includes('diamond')) return 500;
    if (r.includes('platinum')) return 400;
    if (r.includes('gold')) return 300;
    if (r.includes('silver')) return 200;
    if (r.includes('bronze')) return 100;
    return 0;
};

export default function Leaderboard() {
    const { user } = useAuth();
    const [leaders, setLeaders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentUserData, setCurrentUserData] = useState<any>(null);

    // Listen to current user's doc
    useEffect(() => {
        if (!user) return;
        const unsub = onSnapshot(doc(db, 'users', user.uid), (s) => {
            if (s.exists()) setCurrentUserData({ id: s.id, ...s.data() });
        });
        return () => unsub();
    }, [user]);

    // Listen to top 100 users by EXP
    useEffect(() => {
        const q = query(
            collection(db, 'users'),
            orderBy('exp', 'desc'),
            limit(100)
        );
        const unsub = onSnapshot(q, (snap) => {
            const raw = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

            // Sort: rank tier > exp > rebirthCount
            raw.sort((a, b) => {
                const scoreA = getRankScore(a.rank || '');
                const scoreB = getRankScore(b.rank || '');
                if (scoreA !== scoreB) return scoreB - scoreA;
                const expA = Number(a.exp || 0);
                const expB = Number(b.exp || 0);
                if (expA !== expB) return expB - expA;
                return Number(b.rebirthCount || 0) - Number(a.rebirthCount || 0);
            });

            // Assign display positions (1-indexed)
            raw.forEach((item, i) => { item.position = i + 1; });
            setLeaders(raw);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    // Find current user in leaderboard
    const userEntry = currentUserData
        ? leaders.find(l => l.id === currentUserData.id)
        : null;

    const filtered = leaders.filter(l => {
        const name = (l.codename || l.displayName || '').toLowerCase();
        return name.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="min-h-screen bg-[#1F2E4A] pb-24 relative font-poppins text-white">
            {/* Header */}
            <div className="bg-[#152033] p-6 pb-12 sticky top-0 z-10 shadow-xl border-b border-indigo-900/50">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-black bg-gradient-to-r from-yellow-300 to-yellow-600 bg-clip-text text-transparent flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-yellow-500 fill-current" />
                        LEADERBOARD
                    </h1>
                    <span className="text-xs text-slate-500 font-mono">Top {leaders.length}</span>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search player..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1F2E4A] rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-700"
                    />
                </div>
            </div>

            {/* List */}
            <div className="px-4 -mt-6 z-20 relative space-y-3">
                {loading ? (
                    <div className="flex justify-center pt-10">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <Trophy className="w-16 h-16 mb-4 text-slate-600" />
                        <p className="text-slate-400 font-bold">No Rankings Yet</p>
                        <p className="text-[10px] text-slate-600">Members appear here once they have EXP.</p>
                    </div>
                ) : (
                    filtered.map((player) => {
                        const isMe = userEntry?.id === player.id;
                        const displayName = player.codename || player.displayName || 'Unknown';

                        return (
                            <motion.div
                                key={player.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`relative rounded-2xl p-4 flex items-center gap-4 ${
                                    isMe
                                        ? 'bg-gradient-to-r from-blue-900/80 to-indigo-900/80 border border-blue-500/50 shadow-lg shadow-blue-500/20'
                                        : 'bg-[#2b2d42] border border-slate-700/50'
                                }`}
                            >
                                {/* Crown for top 3 */}
                                {player.position <= 3 && (
                                    <div className="absolute -top-3 left-14">
                                        <Crown className={`w-5 h-5 ${
                                            player.position === 1 ? 'text-yellow-400 fill-current' :
                                            player.position === 2 ? 'text-slate-300 fill-current' :
                                            'text-amber-700 fill-current'
                                        }`} />
                                    </div>
                                )}

                                {/* Rank number */}
                                <div className="shrink-0 w-8 text-center">
                                    <span className={`text-lg font-black ${player.position <= 3 ? 'text-yellow-500' : 'text-slate-500'}`}>
                                        {player.position}
                                    </span>
                                </div>

                                {/* Avatar */}
                                <div className="shrink-0 w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-2xl border-2 border-slate-700 overflow-hidden">
                                    {player.photoURL ? (
                                        <img src={player.photoURL} alt={displayName} className="w-full h-full object-cover" />
                                    ) : (
                                        getRankEmoji(player.rank)
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold truncate text-sm text-white">
                                            {displayName}
                                            {isMe && <span className="ml-1 text-blue-300">(You)</span>}
                                        </h3>
                                        {player.party && player.party !== 'No Party' && (
                                            <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[9px] font-bold uppercase tracking-wider shrink-0">
                                                {player.party}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                                        <Shield className="w-3 h-3 shrink-0" />
                                        {player.rank || 'Rookie'}
                                        {player.rebirthCount > 0 && (
                                            <span className="text-purple-400 font-bold ml-1">✦ {player.rebirthCount}x</span>
                                        )}
                                    </p>
                                </div>

                                {/* EXP */}
                                <div className="shrink-0 text-right">
                                    <p className="font-black text-yellow-400 text-sm">{Number(player.exp || 0).toLocaleString()}</p>
                                    <p className="text-[10px] text-slate-500 font-bold">EXP</p>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Sticky "You" bar (only when user is in top 100) */}
            {userEntry && (
                <div className="fixed bottom-[88px] left-0 w-full px-4 z-40 animate-in slide-in-from-bottom-5">
                    <div className="bg-blue-600 rounded-2xl p-4 shadow-2xl flex items-center gap-4 text-white border border-blue-400">
                        <div className="font-black text-xl w-8 text-center">{userEntry.position}</div>
                        <div className="shrink-0 w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center text-xl border border-white/20 overflow-hidden">
                            {userEntry.photoURL ? (
                                <img src={userEntry.photoURL} alt="You" className="w-full h-full object-cover" />
                            ) : (
                                getRankEmoji(userEntry.rank)
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm truncate">
                                {userEntry.codename || userEntry.displayName || 'You'}
                            </div>
                            <div className="text-xs text-blue-200">{userEntry.rank || 'Rookie'}</div>
                        </div>
                        <div className="text-right shrink-0">
                            <div className="font-black text-white text-sm">{Number(userEntry.exp || 0).toLocaleString()}</div>
                            <div className="text-[10px] text-blue-200">EXP</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
