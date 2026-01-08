'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Trophy, Crown, Loader2, Shield } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
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
    return '🌱'; // Rookie
};

export default function Leaderboard() {
    const { user } = useAuth();
    const [leaders, setLeaders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [userRankData, setUserRankData] = useState<any>(null);
    const [userData, setUserData] = useState<any>(null);

    // 1. Get current user's data
    useEffect(() => {
        if (!user) return;
        const unsub = onSnapshot(doc(db, 'users', user.uid), (s) => {
            if (s.exists()) setUserData(s.data());
        });
        return () => unsub();
    }, [user]);

    // 2. Get Leaderboard Data
    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'system_data', 'member_dashboard'), (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                let items = data.items || [];

                items = items.map((i: any) => {
                    // PRIORITIZE CODENAME as requested
                    const codename = i['Code name'] || i['Codename'] || i['CodeName'] || i['codename'] || '';
                    const realName = i['Name'] || i['Display Name'] || i['Nickname'] || 'Unknown Agent';

                    // Parse Rebirth Count (Critical for Sorting)
                    let rebirth = Number(i['Rebirth Count'] || i['RebirthCount'] || i['rebirth'] || 0);

                    // Fallback: Infer from Rank string if Rebirth Count is missing in JSON
                    if (!rebirth && i['Rank']) {
                        const r = String(i['Rank']);
                        if (r.endsWith(' V')) rebirth = 4;
                        else if (r.endsWith(' IV')) rebirth = 3;
                        else if (r.endsWith(' III')) rebirth = 2;
                        else if (r.endsWith(' II')) rebirth = 1;
                    }

                    return {
                        ...i,
                        exp: Number(String(i.EXP || i.Exp || i.exp || '0').replace(/[^0-9]/g, '')),
                        rank: i['Rank'] || i['Current Rank'] || 'Rookie',
                        name: codename || realName,
                        codename: codename,
                        phone: String(i['Phone'] || i['Tel'] || '').replace(/[^0-9]/g, ''),
                        party: i['Party'] || 'No Party',
                        rebirth: rebirth
                    };
                });

                items.sort((a: any, b: any) => {
                    // 1. Base Rank Priority (Grandmaster > Diamond)
                    const getBaseRankScore = (rankStr: string) => {
                        const r = String(rankStr).trim().split(' ')[0].toLowerCase();
                        if (r.includes('god')) return 800;
                        if (r.includes('legend')) return 700;
                        if (r.includes('grandmaster')) return 600;
                        if (r.includes('diamond')) return 500;
                        if (r.includes('platinum')) return 400;
                        if (r.includes('gold')) return 300;
                        if (r.includes('silver')) return 200;
                        if (r.includes('bronze')) return 100;
                        return 0; // Rookie
                    };

                    const scoreA = getBaseRankScore(a.rank);
                    const scoreB = getBaseRankScore(b.rank);

                    if (scoreA !== scoreB) {
                        return scoreB - scoreA; // Higher Base Rank wins
                    }

                    // 2. EXP (High EXP wins) - AS REQUESTED
                    if (a.exp !== b.exp) {
                        return b.exp - a.exp;
                    }

                    // 3. Rebirth Count (Tie-breaker)
                    return b.rebirth - a.rebirth;
                });

                items.forEach((item: any, index: number) => item.position = index + 1);
                setLeaders(items);
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    // 3. Find User
    useEffect(() => {
        if (userData && leaders.length > 0) {
            const userPhone = String(userData.phone || userData.requestedPhone || '').replace(/-/g, '');
            const found = leaders.find(l =>
                (userPhone && l.phone === userPhone) ||
                (userData.displayName && l.name === userData.displayName)
            );
            setUserRankData(found);
        }
    }, [userData, leaders]);

    const filtered = leaders.filter(l =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.codename.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#1F2E4A] pb-24 relative font-poppins text-white">
            {/* Header */}
            <div className="bg-[#152033] p-6 pb-12 sticky top-0 z-10 shadow-xl border-b border-indigo-900/50">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-black bg-gradient-to-r from-yellow-300 to-yellow-600 bg-clip-text text-transparent flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-yellow-500 fill-current" />
                        LEADERBOARD
                    </h1>
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
                        <p className="text-slate-400 font-bold">No Rankings Available</p>
                        <p className="text-[10px] text-slate-600">Admin needs to sync data first.</p>
                    </div>
                ) : (
                    filtered.map((player) => (
                        <motion.div
                            key={`${player.position}-${player.name}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`relative rounded-2xl p-4 flex items-center gap-4 ${userRankData?.position === player.position ? 'bg-gradient-to-r from-blue-900/80 to-indigo-900/80 border border-blue-500/50 shadow-lg shadow-blue-500/20' : 'bg-[#2b2d42] border border-slate-700/50'}`}
                        >
                            {/* Rank Badge */}
                            <div className="relative shrink-0 w-10 text-center">
                                {player.position <= 3 ? (
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                                        <Crown className={`w-6 h-6 ${player.position === 1 ? 'text-yellow-400 fill-current' : player.position === 2 ? 'text-slate-300 fill-current' : 'text-amber-700 fill-current'}`} />
                                    </div>
                                ) : null}
                                <span className={`text-xl font-black ${player.position <= 3 ? 'text-yellow-500' : 'text-slate-500'}`}>
                                    {player.position}
                                </span>
                            </div>

                            {/* Avatar */}
                            <div className="shrink-0 w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-2xl border-2 border-slate-700">
                                {getRankEmoji(player.rank)}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold truncate text-sm text-white">{player.name}</h3>
                                    {player.party && player.party !== 'No Party' && (
                                        <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[9px] font-bold uppercase tracking-wider">
                                            {player.party}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                                    <Shield className="w-3 h-3" /> {player.rank}
                                </p>
                            </div>

                            {/* EXP */}
                            <div className="shrink-0 text-right">
                                <p className="font-black text-yellow-400 text-sm">{player.exp.toLocaleString()}</p>
                                <p className="text-[10px] text-slate-500 font-bold">EXP</p>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Sticky User Stat */}
            {userRankData && (
                <div className="fixed bottom-[88px] left-0 w-full px-4 z-40 animate-in slide-in-from-bottom-5">
                    <div className="bg-blue-600 rounded-2xl p-4 shadow-2xl flex items-center gap-4 text-white border border-blue-400">
                        <div className="font-black text-xl w-8 text-center">{userRankData.position}</div>
                        <div className="shrink-0 w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center text-xl border border-white/20">
                            {getRankEmoji(userRankData.rank)}
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-sm truncate">You ({userRankData.name})</div>
                            <div className="text-xs text-blue-200">{userRankData.rank}</div>
                        </div>
                        <div className="text-right">
                            <div className="font-black text-white text-sm">{userRankData.exp.toLocaleString()}</div>
                            <div className="text-[10px] text-blue-200">EXP</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
