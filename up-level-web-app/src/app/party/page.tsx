'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Crown, Shield, Info, Loader2, Sparkles, Trophy } from 'lucide-react';
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

export default function Party() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [myPartyName, setMyPartyName] = useState<string | null>(null);
    const [partyMembers, setPartyMembers] = useState<any[]>([]);
    const [partyStats, setPartyStats] = useState({ totalExp: 0, totalMembers: 0, averageRank: 'Rookie' });
    const [userData, setUserData] = useState<any>(null);

    // 1. Get User Config (to know which party usually)
    useEffect(() => {
        if (!user) return;
        const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                setUserData(data);
                // We will rely on System Data for reliable Party grouping, but use this as backup/reference
            }
        });
        return () => unsub();
    }, [user]);

    // 2. Fetch All Members & Filter by My Party
    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'system_data', 'member_dashboard'), (snap) => {
            if (snap.exists() && userData) {
                const data = snap.data();
                let allItems = data.items || [];

                // Find "MY" entry in the system data to confirm Party (more reliable than user doc if admin changed it in sheet)
                let myEntry = null;
                const normalizePhone = (p: string) => String(p || '').replace(/-/g, '');
                const myPhone = normalizePhone(userData.phone || '');

                if (myPhone) {
                    myEntry = allItems.find((i: any) => normalizePhone(i['Phone'] || i['Tel']) === myPhone);
                }

                // If not found by phone, try name
                if (!myEntry && userData.displayName) {
                    myEntry = allItems.find((i: any) => i['Name'] === userData.displayName);
                }

                const targetParty = myEntry ? myEntry['Party'] : (userData.party || null);
                setMyPartyName(targetParty);

                if (targetParty && targetParty !== 'No Party' && targetParty !== '-') {
                    // Filter Members
                    let members = allItems.filter((i: any) => i['Party'] === targetParty);

                    // Normalize Member Data
                    members = members.map((i: any) => ({
                        name: i['Name'] || i['Display Name'] || 'Unknown Member',
                        rank: i['Rank'] || i['Current Rank'] || 'Rookie',
                        role: i['Role'] || 'Member', // If we have roles column later
                        avatar: getRankEmoji(i['Rank']),
                        exp: Number(String(i['EXP'] || '0').replace(/,/g, '')),
                        phone: i['Phone']
                    }));

                    // Sort: High EXP first
                    members.sort((a: any, b: any) => b.exp - a.exp);

                    setPartyMembers(members);

                    // Stats
                    const totalExp = members.reduce((sum: number, m: any) => sum + m.exp, 0);
                    setPartyStats({
                        totalExp,
                        totalMembers: members.length,
                        averageRank: 'N/A' // Could calculate weighted avg later
                    });
                } else {
                    setPartyMembers([]);
                }
            }
            setLoading(false);
        });

        return () => unsub();
    }, [userData]); // Re-run when userData loads

    if (loading) return (
        <div className="min-h-screen bg-[#1F2E4A] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
    );

    if (!myPartyName || myPartyName === 'No Party' || myPartyName === '-') return (
        <div className="min-h-screen bg-[#1F2E4A] pb-24 font-poppins text-white flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Shield className="w-12 h-12 text-slate-400" />
            </div>
            <h1 className="text-2xl font-black mb-2">No Party Assigned</h1>
            <p className="text-slate-400 text-sm max-w-xs mb-8">
                You are currently a Ronin (Solo Player). Join a party to access the Guild Hall!
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-bold hover:scale-105 transition-transform">
                Find a Guild
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#1F2E4A] pb-24 font-poppins text-white">
            {/* Guild Header */}
            <div className="bg-[#152033] rounded-b-[3rem] p-6 pb-20 relative overflow-hidden shadow-2xl border-b border-indigo-900/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-5xl shadow-lg shadow-indigo-500/30 mb-4 ring-4 ring-white/10 rotate-3 animate-in zoom-in duration-300">
                        🛡️
                    </div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-1">
                        {myPartyName}
                    </h1>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs font-bold text-slate-300">
                        <Users className="w-3 h-3" />
                        {partyStats.totalMembers} Members
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full mt-8 max-w-sm">
                        <div className="bg-[#23232a] border border-slate-700/50 rounded-2xl p-3 flex flex-col items-center">
                            <span className="text-[10px] text-slate-500 font-bold uppercase">Total Power</span>
                            <span className="text-lg font-black text-yellow-500 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                {partyStats.totalExp.toLocaleString()}
                            </span>
                        </div>
                        <div className="bg-[#23232a] border border-slate-700/50 rounded-2xl p-3 flex flex-col items-center">
                            <span className="text-[10px] text-slate-500 font-bold uppercase">Rank Score</span>
                            <span className="text-lg font-black text-blue-400">
                                S
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Member List */}
            <div className="px-6 -mt-12 relative z-20">
                <div className="bg-[#2b2d42] rounded-3xl p-6 shadow-xl border border-slate-700/50">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-400" />
                            Guild Roster
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {partyMembers.map((member, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center gap-4 group"
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 bg-[#1F2E4A] rounded-full flex items-center justify-center text-xl border-2 border-slate-700 group-hover:border-blue-500 transition-colors">
                                        {member.avatar}
                                    </div>
                                    {/* Online indicator (Mock for now) */}
                                    {/* <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2b2d42]"></div> */}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className={`font-bold text-sm truncate ${member.name === userData.displayName ? 'text-yellow-400' : 'text-white'}`}>
                                            {member.name} {member.name === userData.displayName && '(You)'}
                                        </h4>
                                        <div className="text-[10px] font-mono text-slate-500 bg-black/20 px-1.5 rounded">
                                            {member.exp.toLocaleString()}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                        {member.rank}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* <button className="w-full mt-6 py-3 border border-slate-700 rounded-xl text-slate-400 font-bold hover:bg-white/5 transition-colors flex items-center justify-center gap-2 text-xs">
                        <Info className="w-4 h-4" />
                        Guild Features Coming Soon
                    </button> */}
                </div>
            </div>
        </div>
    );
}
