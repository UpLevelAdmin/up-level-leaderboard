'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
    collection, doc, writeBatch, onSnapshot, getDoc, setDoc,
    deleteDoc, updateDoc, addDoc, query, orderBy, limit, serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { addExpToUser } from '@/lib/actions/game-logic';
import { calculateRank, RANK_ORDER, getRequiredExp } from '@/lib/gameConfig';
import {
    Shield, Users, ScrollText, Lock, LogOut, Loader2,
    Check, X, Wand2, ChevronDown, ChevronUp, Star, Zap, Trophy,
    Plus, Trash2, Activity, Send
} from 'lucide-react';

// ─── Admin Access List ────────────────────────────────────────────────────────
const ADMIN_EMAILS = [
    "chawanut.cha@gmail.com",
    "champ.championest@gmail.com",
    "boomboom08755@gmail.com",
    "nuslove2560@gmail.com",
    "phooreephat.k@gmail.com",
    "twinstiwly@gmail.com",
    "earth9784@gmail.com",
    "uplevel.ad@gmail.com",
];

const OWNER_EMAIL = "champ.championest@gmail.com";

const RANKS = [
    'Rookie', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Grandmaster', 'Legend', 'God'
];

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

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = 'OVERVIEW' | 'MEMBERS' | 'ACTIVITIES' | 'REQUESTS' | 'LOGS';

export default function AdminPortal() {
    const { user, loading, signInWithGoogle, signOut } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('OVERVIEW');

    // Data
    const [members, setMembers] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);

    // UI state
    const [editingMember, setEditingMember] = useState<any>(null);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [expandedReq, setExpandedReq] = useState<string | null>(null);

    // Activities UI
    const [newActivity, setNewActivity] = useState({ name: '', exp: '', partyPoints: '' });
    const [grantModal, setGrantModal] = useState<{ activity: any } | null>(null);
    const [grantTargets, setGrantTargets] = useState<string[]>([]); // userIds
    const [granting, setGranting] = useState(false);

    // ── Data listeners ──────────────────────────────────────────────────────
    useEffect(() => {
        if (!user || !ADMIN_EMAILS.includes(user.email || '')) return;

        const unsubMembers = onSnapshot(
            query(collection(db, 'users'), orderBy('exp', 'desc')),
            snap => setMembers(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        );
        const unsubRequests = onSnapshot(
            collection(db, 'claim_requests'),
            snap => setRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        );
        const unsubActivities = onSnapshot(
            query(collection(db, 'activities'), orderBy('createdAt', 'desc')),
            snap => setActivities(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        );
        return () => { unsubMembers(); unsubRequests(); unsubActivities(); };
    }, [user]);

    useEffect(() => {
        if (activeTab !== 'LOGS' || user?.email !== OWNER_EMAIL) return;
        const q = query(collection(db, 'admin_logs'), orderBy('timestamp', 'desc'), limit(100));
        const unsub = onSnapshot(q, snap => setLogs(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
        return () => unsub();
    }, [activeTab, user]);

    // ── Helpers ─────────────────────────────────────────────────────────────
    const logAction = async (action: string, details: any) => {
        if (!user?.email) return;
        try {
            await addDoc(collection(db, 'admin_logs'), {
                admin: user.email,
                action,
                details: typeof details === 'string' ? details : JSON.stringify(details),
                timestamp: serverTimestamp()
            });
        } catch (e) { console.error('Log error', e); }
    };

    // ── Save member edits ────────────────────────────────────────────────────
    const handleSaveMember = async () => {
        if (!editingMember) return;
        setSaving(true);
        try {
            const { id, ...data } = editingMember;
            await updateDoc(doc(db, 'users', id), {
                displayName: data.displayName,
                codename: data.codename || '',
                rank: data.rank,
                exp: Number(data.exp) || 0,
                party: data.party || '',
                rebirthCount: Number(data.rebirthCount) || 0,
                expMultiplier: Number(data.expMultiplier) || 1,
                lastUpdatedBy: user?.email,
                lastUpdated: serverTimestamp()
            });
            await logAction('edit_member', { memberId: id, rank: data.rank, exp: data.exp });
            setEditingMember(null);
        } catch (e: any) {
            alert('Error: ' + e.message);
        } finally {
            setSaving(false);
        }
    };

    // ── Approve claim ────────────────────────────────────────────────────────
    const handleApproveClaim = async (req: any) => {
        if (!confirm(`Approve ${req.currentDisplayName || req.email}?`)) return;
        setProcessingId(req.id);
        try {
            const batch = writeBatch(db);
            const legacyRef = doc(db, 'legacy_users', req.requestedPhone);
            const legacySnap = await getDoc(legacyRef);
            const legacyData = legacySnap.exists() ? legacySnap.data() : req.legacyData || {};

            batch.update(doc(db, 'users', req.uid), {
                rank: legacyData.rank || 'Rookie',
                exp: legacyData.exp || 0,
                party: legacyData.party || '',
                phone: req.requestedPhone,
                codename: legacyData.codename || '',
                rebirthCount: legacyData.rebirthCount || 0,
                expMultiplier: legacyData.expMultiplier || 1,
                isLegacyLinked: true,
                approvedAt: serverTimestamp(),
                approvedBy: user?.email
            });
            batch.delete(doc(db, 'claim_requests', req.id));
            if (legacySnap.exists()) batch.delete(legacyRef);

            await batch.commit();
            await logAction('approve_claim', { uid: req.uid, phone: req.requestedPhone });
            await addDoc(collection(db, 'activity_logs'), {
                userId: req.uid,
                type: 'legacy_linked',
                description: `Legacy account linked by ${user?.email}`,
                expDelta: legacyData.exp || 0,
                timestamp: serverTimestamp()
            });
        } catch (e: any) {
            alert(e.message);
        } finally {
            setProcessingId(null);
        }
    };

    // ── Reject claim ─────────────────────────────────────────────────────────
    const handleRejectClaim = async (reqId: string) => {
        if (!confirm('Reject this request?')) return;
        setProcessingId(reqId);
        try {
            await deleteDoc(doc(db, 'claim_requests', reqId));
            await logAction('reject_claim', { reqId });
        } catch (e: any) {
            alert(e.message);
        } finally {
            setProcessingId(null);
        }
    };

    // ── Create Activity ───────────────────────────────────────────────────────
    const handleCreateActivity = async () => {
        if (!newActivity.name.trim() || !newActivity.exp) return;
        await addDoc(collection(db, 'activities'), {
            name: newActivity.name.trim(),
            exp: Number(newActivity.exp),
            partyPoints: Number(newActivity.partyPoints) || 0,
            createdBy: user?.email,
            createdAt: serverTimestamp(),
        });
        setNewActivity({ name: '', exp: '', partyPoints: '' });
        await logAction('create_activity', newActivity);
    };

    // ── Delete Activity ───────────────────────────────────────────────────────
    const handleDeleteActivity = async (activityId: string) => {
        if (!confirm('ลบกิจกรรมนี้?')) return;
        await deleteDoc(doc(db, 'activities', activityId));
    };

    // ── Grant EXP to selected members ────────────────────────────────────────
    const handleGrantExp = async () => {
        if (!grantModal || grantTargets.length === 0) return;
        setGranting(true);
        try {
            for (const userId of grantTargets) {
                await addExpToUser(
                    userId,
                    grantModal.activity.exp,
                    user?.email || 'admin',
                    grantModal.activity.name
                );
            }
            await logAction('grant_exp_activity', {
                activity: grantModal.activity.name,
                exp: grantModal.activity.exp,
                targets: grantTargets.length
            });
            setGrantModal(null);
            setGrantTargets([]);
            alert(`✅ เพิ่ม ${grantModal.activity.exp} EXP ให้ ${grantTargets.length} คนสำเร็จ`);
        } catch (e: any) {
            alert('Error: ' + e.message);
        } finally {
            setGranting(false);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // RENDER STATES
    // ─────────────────────────────────────────────────────────────────────────
    if (loading) return (
        <div className="h-screen bg-[#1e1e24] flex items-center justify-center text-white gap-2">
            <Loader2 className="animate-spin text-blue-500" /> Verifying...
        </div>
    );

    if (!user) return (
        <div className="min-h-screen bg-[#1e1e24] flex items-center justify-center p-4">
            <div className="max-w-sm w-full bg-[#2b2d42] border border-slate-700 rounded-2xl p-8 text-center shadow-2xl">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
                <p className="text-slate-400 text-sm mb-8">Up Level Guild — Member Management</p>
                <button
                    onClick={signInWithGoogle}
                    className="w-full bg-white text-slate-900 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-100 transition-colors"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign in with Google
                </button>
            </div>
        </div>
    );

    if (!ADMIN_EMAILS.includes(user.email || '')) return (
        <div className="min-h-screen bg-[#1e1e24] flex items-center justify-center p-4">
            <div className="max-w-sm w-full bg-[#1e1e24] border border-red-900/50 rounded-2xl p-8 text-center">
                <Lock className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h1 className="text-xl font-bold text-white mb-2">Access Denied</h1>
                <p className="text-slate-400 text-sm mb-6">
                    <span className="text-white font-mono bg-slate-800 px-1 rounded">{user.email}</span> is not an admin.
                </p>
                <div className="flex gap-3 justify-center">
                    <button onClick={signOut} className="text-sm text-slate-400 hover:text-white underline">Sign Out</button>
                    <button onClick={() => router.push('/dashboard')} className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg">Dashboard</button>
                </div>
            </div>
        </div>
    );

    // ─────────────────────────────────────────────────────────────────────────
    // MAIN UI
    // ─────────────────────────────────────────────────────────────────────────
    const tabs: { key: Tab; label: string; badge?: number }[] = [
        { key: 'OVERVIEW', label: 'Overview' },
        { key: 'MEMBERS', label: 'Members', badge: members.length },
        { key: 'ACTIVITIES', label: 'Activities', badge: activities.length },
        { key: 'REQUESTS', label: 'Requests', badge: requests.length },
        ...(user.email === OWNER_EMAIL ? [{ key: 'LOGS' as Tab, label: 'Logs' }] : []),
    ];

    return (
        <div className="min-h-screen bg-[#1e1e24] text-slate-200 pb-16">

            {/* Header */}
            <div className="bg-[#2b2d42] px-6 py-4 sticky top-0 z-20 flex justify-between items-center border-b border-slate-700/50 shadow-xl">
                <div className="flex items-center gap-3 font-bold text-white">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        Admin Portal
                        <div className="text-[10px] text-slate-400 font-normal">{user.displayName}</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => router.push('/dashboard')} className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg border border-slate-600 transition-colors">
                        Member View
                    </button>
                    <button onClick={signOut} className="text-xs text-red-400 hover:text-red-300 px-3 py-2 flex items-center gap-1">
                        <LogOut className="w-3 h-3" /> Out
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-6 pt-5 pb-2">
                <div className="flex bg-[#23232a] p-1 rounded-xl w-fit gap-1 border border-slate-700/50">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`relative px-5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab.key ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {tab.label}
                            {tab.badge !== undefined && tab.badge > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center border-2 border-[#1e1e24]">
                                    {tab.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-6 py-4 space-y-4">

                {/* ── OVERVIEW ── */}
                {activeTab === 'OVERVIEW' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/10 p-5 rounded-2xl border border-blue-500/30">
                                <div className="text-[10px] font-bold text-blue-300 mb-1 tracking-wider">MEMBERS</div>
                                <div className="text-4xl font-black text-white">{members.length}</div>
                            </div>
                            <div className="bg-gradient-to-br from-amber-600/20 to-amber-900/10 p-5 rounded-2xl border border-amber-500/30">
                                <div className="text-[10px] font-bold text-amber-300 mb-1 tracking-wider">PENDING REQUESTS</div>
                                <div className="text-4xl font-black text-white">{requests.length}</div>
                            </div>
                        </div>

                        {/* Rank Distribution */}
                        <div className="bg-[#2b2d42] rounded-2xl p-5 border border-slate-700/50">
                            <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-yellow-400" /> Rank Distribution
                            </h3>
                            <div className="space-y-2">
                                {RANKS.slice().reverse().map(rank => {
                                    const count = members.filter(m => (m.rank || 'Rookie') === rank).length;
                                    if (count === 0) return null;
                                    const pct = members.length > 0 ? (count / members.length) * 100 : 0;
                                    return (
                                        <div key={rank} className="flex items-center gap-3">
                                            <span className="text-sm w-5">{getRankEmoji(rank)}</span>
                                            <span className="text-xs text-slate-400 w-24 font-medium">{rank}</span>
                                            <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                                            </div>
                                            <span className="text-xs text-slate-400 w-6 text-right">{count}</span>
                                        </div>
                                    );
                                })}
                                {members.length === 0 && (
                                    <p className="text-slate-500 text-xs text-center py-4">No members yet</p>
                                )}
                            </div>
                        </div>

                        {/* Recent Members */}
                        <div className="bg-[#2b2d42] rounded-2xl overflow-hidden border border-slate-700/50">
                            <div className="px-5 py-4 border-b border-slate-700/50 bg-[#23232a]">
                                <h3 className="font-bold text-white text-sm">Top Members by EXP</h3>
                            </div>
                            <div className="divide-y divide-slate-700/30">
                                {members.slice(0, 10).map((m, i) => (
                                    <div key={m.id} className="flex items-center gap-3 px-5 py-3">
                                        <span className="text-slate-600 text-xs w-5 font-mono">{i + 1}</span>
                                        <span className="text-xl">{getRankEmoji(m.rank)}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-bold text-white truncate">{m.codename || m.displayName}</div>
                                            <div className="text-[10px] text-slate-500">{m.rank || 'Rookie'} • {m.party || 'No Party'}</div>
                                        </div>
                                        <span className="text-yellow-400 font-black text-sm">{Number(m.exp || 0).toLocaleString()}</span>
                                    </div>
                                ))}
                                {members.length === 0 && (
                                    <p className="text-slate-500 text-xs text-center py-8">No members yet</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── MEMBERS ── */}
                {activeTab === 'MEMBERS' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="text-xs text-slate-500 mb-2">{members.length} members · sorted by EXP</div>
                        {members.length === 0 && (
                            <div className="text-center py-16 text-slate-500">
                                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p>No members yet</p>
                            </div>
                        )}
                        {members.map(m => (
                            <div key={m.id} className="bg-[#2b2d42] rounded-2xl border border-slate-700/50 overflow-hidden">
                                <div className="flex items-center gap-3 p-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden flex items-center justify-center text-xl border border-slate-700 shrink-0">
                                        {m.photoURL ? <img src={m.photoURL} className="w-full h-full object-cover" /> : getRankEmoji(m.rank)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-white text-sm truncate">{m.codename || m.displayName}</div>
                                        <div className="text-[10px] text-slate-500 truncate">{m.email} · {m.phone || 'no phone'}</div>
                                        <div className="text-[10px] text-slate-400 mt-0.5">{m.rank || 'Rookie'} · {m.party || 'No Party'}</div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="text-yellow-400 font-black text-sm">{Number(m.exp || 0).toLocaleString()}</div>
                                        <div className="text-[10px] text-slate-600">EXP</div>
                                        <button
                                            onClick={() => setEditingMember({ ...m })}
                                            className="mt-1 text-[10px] text-blue-400 hover:text-blue-300 font-bold"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── ACTIVITIES ── */}
                {activeTab === 'ACTIVITIES' && (
                    <div className="space-y-4 animate-in fade-in duration-200">

                        {/* Create new activity */}
                        <div className="bg-[#2b2d42] rounded-2xl border border-slate-700/50 p-5">
                            <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                                <Plus className="w-4 h-4 text-green-400" /> เพิ่มกิจกรรมใหม่
                            </h3>
                            <div className="space-y-3">
                                <input
                                    value={newActivity.name}
                                    onChange={e => setNewActivity(p => ({ ...p, name: e.target.value }))}
                                    placeholder="ชื่อกิจกรรม เช่น เข้าร่วม Local Tournament"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">EXP ที่ได้รับ</label>
                                        <input
                                            type="number"
                                            value={newActivity.exp}
                                            onChange={e => setNewActivity(p => ({ ...p, exp: e.target.value }))}
                                            placeholder="10"
                                            className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Party Point (ถ้ามี)</label>
                                        <input
                                            type="number"
                                            value={newActivity.partyPoints}
                                            onChange={e => setNewActivity(p => ({ ...p, partyPoints: e.target.value }))}
                                            placeholder="0"
                                            className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleCreateActivity}
                                    disabled={!newActivity.name.trim() || !newActivity.exp}
                                    className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Plus className="w-4 h-4" /> สร้างกิจกรรม
                                </button>
                            </div>
                        </div>

                        {/* Activity list */}
                        {activities.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p>ยังไม่มีกิจกรรม</p>
                            </div>
                        )}
                        {activities.map(act => (
                            <div key={act.id} className="bg-[#2b2d42] rounded-2xl border border-slate-700/50 p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center shrink-0">
                                    <Zap className="w-5 h-5 text-yellow-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-white text-sm">{act.name}</div>
                                    <div className="text-[10px] text-slate-400 mt-0.5">
                                        <span className="text-yellow-400 font-bold">+{act.exp} EXP</span>
                                        {act.partyPoints > 0 && <span className="ml-2 text-blue-400">+{act.partyPoints} Party Pt</span>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => { setGrantModal({ activity: act }); setGrantTargets([]); }}
                                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                                    >
                                        <Send className="w-3 h-3" /> Grant
                                    </button>
                                    <button
                                        onClick={() => handleDeleteActivity(act.id)}
                                        className="text-slate-600 hover:text-red-400 p-2 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── REQUESTS ── */}
                {activeTab === 'REQUESTS' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                        {requests.length === 0 && (
                            <div className="text-center py-16 text-slate-500">
                                <Check className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p>No pending requests</p>
                            </div>
                        )}
                        {requests.map(req => (
                            <div key={req.id} className="bg-[#2b2d42] rounded-2xl border border-slate-700/50 overflow-hidden">
                                <button
                                    onClick={() => setExpandedReq(expandedReq === req.id ? null : req.id)}
                                    className="w-full flex items-center gap-3 p-4 text-left"
                                >
                                    <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden flex items-center justify-center shrink-0 border border-slate-700">
                                        {req.profileImage
                                            ? <img src={req.profileImage} className="w-full h-full object-cover" />
                                            : <span className="text-xl">🌱</span>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-white text-sm">{req.currentDisplayName || req.email}</div>
                                        <div className="text-[10px] text-slate-400">Phone: {req.requestedPhone}</div>
                                        <div className="text-[10px] text-slate-500">{req.email}</div>
                                    </div>
                                    <div className="shrink-0 flex items-center gap-2">
                                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">PENDING</span>
                                        {expandedReq === req.id ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                                    </div>
                                </button>

                                {expandedReq === req.id && (
                                    <div className="px-4 pb-4 border-t border-slate-700/50 pt-3 space-y-3">
                                        {/* Legacy data preview */}
                                        {req.legacyData && (
                                            <div className="bg-slate-800/50 rounded-xl p-3 text-xs space-y-1">
                                                <div className="text-slate-400 font-bold mb-2">Legacy Data</div>
                                                <div className="grid grid-cols-2 gap-1">
                                                    <span className="text-slate-500">Name:</span><span className="text-white">{req.legacyData.displayName || '—'}</span>
                                                    <span className="text-slate-500">Codename:</span><span className="text-white">{req.legacyData.codename || '—'}</span>
                                                    <span className="text-slate-500">Rank:</span><span className="text-white">{req.legacyData.rank || '—'}</span>
                                                    <span className="text-slate-500">EXP:</span><span className="text-yellow-400 font-bold">{Number(req.legacyData.exp || 0).toLocaleString()}</span>
                                                    <span className="text-slate-500">Party:</span><span className="text-white">{req.legacyData.party || '—'}</span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            <button
                                                disabled={processingId === req.id}
                                                onClick={() => handleApproveClaim(req)}
                                                className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                                            >
                                                {processingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                Approve
                                            </button>
                                            <button
                                                disabled={processingId === req.id}
                                                onClick={() => handleRejectClaim(req.id)}
                                                className="flex-1 bg-red-900/40 hover:bg-red-900/60 disabled:opacity-50 text-red-400 font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors border border-red-900/50"
                                            >
                                                <X className="w-4 h-4" /> Reject
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* ── LOGS (Owner Only) ── */}
                {activeTab === 'LOGS' && user.email === OWNER_EMAIL && (
                    <div className="space-y-2 animate-in fade-in duration-200">
                        <div className="text-xs text-slate-500 mb-2">Last 100 admin actions</div>
                        {logs.length === 0 && (
                            <div className="text-center py-16 text-slate-500">
                                <ScrollText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p>No logs yet</p>
                            </div>
                        )}
                        {logs.map(log => (
                            <div key={log.id} className="bg-[#2b2d42] rounded-xl border border-slate-700/30 px-4 py-3 flex items-start gap-3">
                                <div className="w-7 h-7 rounded-lg bg-blue-900/40 flex items-center justify-center shrink-0 mt-0.5">
                                    <Zap className="w-3 h-3 text-blue-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-white">{log.action}</div>
                                    <div className="text-[10px] text-slate-400 truncate">{log.details}</div>
                                    <div className="text-[10px] text-slate-600 mt-0.5">{log.admin} · {log.timestamp?.toDate?.()?.toLocaleString('th-TH') || '—'}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Grant EXP Modal ── */}
            {grantModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 p-4">
                    <div className="bg-[#1e1e24] w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
                        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-[#2b2d42]">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <Send className="w-4 h-4 text-blue-400" /> Grant EXP
                            </h3>
                            <button onClick={() => setGrantModal(null)}><X className="w-5 h-5 text-slate-400" /></button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="bg-slate-800/60 rounded-xl p-3 flex items-center gap-3">
                                <Zap className="w-5 h-5 text-yellow-400 shrink-0" />
                                <div>
                                    <div className="font-bold text-white text-sm">{grantModal.activity.name}</div>
                                    <div className="text-xs text-yellow-400">+{grantModal.activity.exp} EXP {grantModal.activity.partyPoints > 0 ? `· +${grantModal.activity.partyPoints} Party Pt` : ''}</div>
                                </div>
                            </div>

                            <div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                                    เลือกสมาชิกที่ได้รับ ({grantTargets.length} คน)
                                </div>
                                <div className="max-h-64 overflow-y-auto space-y-1.5">
                                    {members.map(m => {
                                        const checked = grantTargets.includes(m.id);
                                        return (
                                            <button
                                                key={m.id}
                                                onClick={() => setGrantTargets(prev =>
                                                    checked ? prev.filter(id => id !== m.id) : [...prev, m.id]
                                                )}
                                                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${checked ? 'bg-blue-600/20 border border-blue-500/50' : 'bg-slate-800/40 border border-transparent hover:bg-slate-800'}`}
                                            >
                                                <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${checked ? 'bg-blue-600' : 'bg-slate-700'}`}>
                                                    {checked && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center text-lg">
                                                    {m.photoURL ? <img src={m.photoURL} className="w-full h-full object-cover" /> : getRankEmoji(m.rank)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-bold text-white truncate">{m.codename || m.displayName}</div>
                                                    <div className="text-[10px] text-slate-400">{m.rank || 'Rookie'} · {Number(m.exp || 0)} EXP</div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                    {members.length === 0 && <p className="text-slate-500 text-xs text-center py-4">ยังไม่มีสมาชิก</p>}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setGrantTargets(members.map(m => m.id))}
                                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
                                >
                                    เลือกทั้งหมด
                                </button>
                                <button
                                    disabled={grantTargets.length === 0 || granting}
                                    onClick={handleGrantExp}
                                    className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                                >
                                    {granting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    Grant ให้ {grantTargets.length} คน
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Edit Member Modal ── */}
            {editingMember && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 p-4">
                    <div className="bg-[#1e1e24] w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
                        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-[#2b2d42]">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <Wand2 className="w-4 h-4 text-purple-400" />
                                Edit Member
                            </h3>
                            <button onClick={() => setEditingMember(null)}><X className="w-5 h-5 text-slate-400 hover:text-white" /></button>
                        </div>
                        <div className="p-5 space-y-3">
                            {/* Display Name */}
                            <div>
                                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Display Name</label>
                                <input
                                    value={editingMember.displayName || ''}
                                    onChange={e => setEditingMember({ ...editingMember, displayName: e.target.value })}
                                    className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            {/* Codename */}
                            <div>
                                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Codename</label>
                                <input
                                    value={editingMember.codename || ''}
                                    onChange={e => setEditingMember({ ...editingMember, codename: e.target.value })}
                                    className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                                    placeholder="Optional"
                                />
                            </div>
                            {/* Rank */}
                            <div>
                                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rank</label>
                                <select
                                    value={editingMember.rank || 'Rookie'}
                                    onChange={e => setEditingMember({ ...editingMember, rank: e.target.value })}
                                    className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                                >
                                    {RANKS.map(r => <option key={r} value={r}>{getRankEmoji(r)} {r}</option>)}
                                </select>
                            </div>
                            {/* EXP */}
                            <div>
                                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">EXP</label>
                                <input
                                    type="number"
                                    value={editingMember.exp || 0}
                                    onChange={e => setEditingMember({ ...editingMember, exp: e.target.value })}
                                    className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            {/* Party */}
                            <div>
                                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Party</label>
                                <input
                                    value={editingMember.party || ''}
                                    onChange={e => setEditingMember({ ...editingMember, party: e.target.value })}
                                    className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                                    placeholder="Party name"
                                />
                            </div>
                            {/* Rebirth */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rebirth Count</label>
                                    <input
                                        type="number"
                                        value={editingMember.rebirthCount || 0}
                                        onChange={e => setEditingMember({ ...editingMember, rebirthCount: e.target.value })}
                                        className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">EXP Multiplier</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={editingMember.expMultiplier || 1}
                                        onChange={e => setEditingMember({ ...editingMember, expMultiplier: e.target.value })}
                                        className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <button
                                disabled={saving}
                                onClick={handleSaveMember}
                                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 mt-2 transition-colors"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
