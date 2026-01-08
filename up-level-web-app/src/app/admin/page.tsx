'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { collection, doc, writeBatch, onSnapshot, getDoc, setDoc, deleteDoc, getDocs, updateDoc, addDoc, query, orderBy, limit, where, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
    Shield, LayoutGrid, Database, AlertCircle,
    FileText, Settings, Users, Trophy, ScrollText,
    ChevronRight, Zap, Play, X, Check, Loader2, RefreshCw, Wand2, ArrowUpRight, Lock, LogOut, CheckSquare,
    Wrench, RotateCcw, Star, PlusCircle, UserMinus, Trash2, Highlighter
} from 'lucide-react';
import { addExpToUser, addPartyPoints } from '@/lib/actions/game-logic';

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxtjsDwHI6nJU4OIHExUxMaZwUn3qwakvdkzwbQO7C8Trzz5Gh84SX6F1gqb4BOFQcn/exec";
const API_SECRET = "up-level-secret-key-1234";

// 🔒 ADMIN EMAILS CONFIGURATION
// Add your admin google emails here
const ADMIN_EMAILS = [
    "chawanut.cha@gmail.com",
    "admin@uplevel.com",
    "champ.championest@gmail.com",
    "uplevel.ad@gmail.com",
    "boomboom08755@gmail.com",
    "earth9784@gmail.com",
    "nuslove2560@gmail.com",
    "phooreephat.k@gmail.com",
    "twinstiwly@gmail.com"
];

const getRankEmoji = (rank: string) => {
    const r = (rank || '').toLowerCase();
    if (r.includes('legend')) return '🐉';
    if (r.includes('grand')) return '👑';
    if (r.includes('diamond')) return '💎';
    if (r.includes('platinum')) return '✨';
    if (r.includes('gold')) return '🥇';
    if (r.includes('silver')) return '⚔️';
    if (r.includes('bronze')) return '🛡️';
    return '🐣';
};

export default function AdminControlPanel() {
    const { user, loading, signInWithGoogle, signOut } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'EXPLORER' | 'ACTIONS' | 'APPLICATIONS' | 'REQUESTS' | 'LOGS' | 'PAYMENTS'>('OVERVIEW');

    // Data
    const [legacyUsers, setLegacyUsers] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [publicPayments, setPublicPayments] = useState<any[]>([]);

    // Explorer
    const [explorerData, setExplorerData] = useState<any[]>([]);
    const [explorerTitle, setExplorerTitle] = useState('');
    const [explorerDocId, setExplorerDocId] = useState<string | null>(null);
    const [explorerMenu, setExplorerMenu] = useState<any[]>([]);
    const [loadingExplorer, setLoadingExplorer] = useState(false);
    const [dbMember, setDbMember] = useState<any | null>(null);

    // Actions
    const [actionModal, setActionModal] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionForm, setActionForm] = useState<any>({});
    const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
    const [actionResult, setActionResult] = useState<any>(null);
    const [editingMember, setEditingMember] = useState<any>(null); // For Legacy/Member Edit
    const [editingExplorerItem, setEditingExplorerItem] = useState<any>(null); // For Explorer Edit
    const [viewSlip, setViewSlip] = useState<string | null>(null); // New state for slip modal

    // Requests
    const [processingReqId, setProcessingReqId] = useState<string | null>(null);

    // Logs (Owner Only)
    const [adminLogs, setAdminLogs] = useState<any[]>([]);

    const logAdminAction = async (action: string, details: any) => {
        if (!user?.email) return;
        try {
            await addDoc(collection(db, 'admin_logs'), {
                admin: user.email,
                action,
                details: typeof details === 'string' ? details : JSON.stringify(details),
                timestamp: new Date()
            });
        } catch (e) { console.error("Log Error", e); }
    };

    // Init with Auth Check
    useEffect(() => {
        // If not loading and user is an admin, fetch data
        if (!loading && user && ADMIN_EMAILS.includes(user.email || '')) {
            const unsub1 = onSnapshot(collection(db, 'legacy_users'), (snap) => setLegacyUsers(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
            const unsub2 = onSnapshot(collection(db, 'users'), (snap) => setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
            const unsub3 = onSnapshot(collection(db, 'claim_requests'), (snap) => setRequests(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
            const unsub4 = onSnapshot(query(collection(db, 'public_payments'), orderBy('verifiedAt', 'desc'), limit(50)), (snap) => {
                setPublicPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            });

            getDocs(collection(db, 'system_data')).then(snap => {
                const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                const groups: any = {};
                items.forEach((item: any) => {
                    const cat = item.category || 'Uncategorized';
                    if (!groups[cat]) groups[cat] = [];
                    groups[cat].push(item);
                });
                setExplorerMenu(Object.entries(groups));
            });

            return () => { unsub1(); unsub2(); unsub3(); unsub4(); };
        }
    }, [user, loading]);

    // Fetch Logs for Owner
    useEffect(() => {
        if (activeTab === 'LOGS' && user?.email === 'champ.championest@gmail.com') {
            const q = query(collection(db, 'admin_logs'), orderBy('timestamp', 'desc'), limit(100));
            const unsub = onSnapshot(q, (snap) => setAdminLogs(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
            return () => unsub();
        }
    }, [activeTab, user]);

    const loadUnifiedMembers = async () => {
        setLoadingExplorer(true);
        setExplorerTitle('Members');
        setExplorerDocId('unified_members_view');
        try {
            // 1. Get Claimed Users
            const usersRef = collection(db, 'users');
            const usersSnap = await getDocs(usersRef);
            const claimedUsers = usersSnap.docs.map(d => ({
                id: d.id,
                ...d.data(),
                isClaimed: true,
                source: 'app_user',
                _status: 'Claimed'
            }));

            // 2. Get Legacy Users
            const legacyRef = collection(db, 'legacy_users');
            const legacySnap = await getDocs(legacyRef);
            const legacyUsers = legacySnap.docs.map(d => ({
                id: d.id,
                ...d.data(),
                isClaimed: false,
                source: 'sheet_sync',
                _status: 'Unclaimed'
            }));

            // 3. Merge & Sort (Claimed first, then by Exp)
            const allMembers = [...claimedUsers, ...legacyUsers];
            allMembers.sort((a: any, b: any) => {
                // Primary Sort: Status (Claimed top)
                if (a.isClaimed !== b.isClaimed) return a.isClaimed ? -1 : 1;
                // Secondary Sort: EXP (Desc)
                return (b.exp || 0) - (a.exp || 0);
            });

            setExplorerData(allMembers);
            console.log(`Loaded ${allMembers.length} unified members.`);
        } catch (e) {
            console.error(e);
            alert("Failed to load members");
        } finally {
            setLoadingExplorer(false);
        }
    };

    const syncAllData = async () => {
        if (!confirm("Start Full System Sync? This will update Quests, Shop, and Leaderboard data from Google Sheets.")) return;
        setLoadingExplorer(true);
        try {
            // Sequential Sync to avoid rate limits or race conditions
            console.log("Syncing Quests...");
            // Arg 1: Firestore Doc ID, Arg 2: Sheet Name
            await loadExplorerData('quests', 'Quest List');

            console.log("Syncing Shop...");
            await loadExplorerData('shop', 'Reward Catalog');

            console.log("Syncing Dashboard...");
            await loadExplorerData('member_dashboard', 'Member Dashboard');
            alert("✅ All System Data Synced!");
        } catch (e: any) {
            console.error(e);
            alert("❌ Sync Failed: " + e.message);
        } finally {
            setLoadingExplorer(false);
        }
    };

    const loadSystemData = async (docId: string, title: string) => {
        setLoadingExplorer(true);
        setExplorerTitle(title);
        setExplorerDocId(docId);
        setExplorerData([]);
        try {
            // 🚀 FORCE LIVE FETCH for Leaderboard & Dashboard to ensure data is fresh (Reflecting Sheet values)
            if (title === 'Leaderboard' || title === 'Member Dashboard' || title === 'Quests' || title === 'Shop') {
                await loadExplorerData(title, docId);
                return;
            }

            const docRef = doc(db, 'system_data', docId);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                const rawItems = snap.data().items || [];
                // Safety filter: ensure items are non-null objects
                let filteredItems = rawItems.filter((i: any) => i && typeof i === 'object');

                // AUTO-RESORT LOGIC: If a timestamp/date column exists, sort by DESC
                if (filteredItems.length > 0) {
                    const keys = Object.keys(filteredItems[0]).map(k => k.toLowerCase());
                    const dateKey = Object.keys(filteredItems[0]).find(k => {
                        const lower = k.toLowerCase();
                        return lower.includes('date') || lower.includes('time') || lower.includes('timestamp');
                    });

                    if (dateKey) {
                        filteredItems.sort((a: any, b: any) => {
                            const dateA = new Date(a[dateKey]).getTime();
                            const dateB = new Date(b[dateKey]).getTime();
                            if (!isNaN(dateA) && !isNaN(dateB)) {
                                return dateB - dateA; // Newest first
                            }
                            return 0;
                        });
                    }
                }

                setExplorerData(filteredItems);
            }
        } catch (e) { console.error(e); }
        finally { setLoadingExplorer(false); }
    };

    const loadExplorerData = async (filter?: string, forceDocId?: string): Promise<number> => {
        setLoadingExplorer(true);
        try {
            let sheetName = filter || explorerTitle;
            const targetDocId = forceDocId || explorerDocId;

            if (sheetName) {
                // Add timestamp to prevent caching
                const response = await fetch(`${APPS_SCRIPT_URL}?action=get_sheet_data&sheet=${encodeURIComponent(sheetName)}&secret=${API_SECRET}&t=${new Date().getTime()}`);
                const data = await response.json();

                let filteredItems: any[] = [];

                // Unified Parsing Logic
                if (data.status === 'success' && data.data) {
                    if (Array.isArray(data.data)) {
                        filteredItems = data.data;
                    } else if (data.data.items) {
                        filteredItems = data.data.items;
                    } else if (typeof data.data === 'object') {
                        filteredItems = Object.values(data.data);
                    }
                } else if (Array.isArray(data)) {
                    // Raw array fallback
                    filteredItems = data;
                }

                // Filter invalid/empty items
                filteredItems = filteredItems.filter((i: any) => i && typeof i === 'object' && Object.keys(i).length > 0);
                const itemCount = filteredItems.length;

                // Sync to Firestore if targetDocId provided
                if (targetDocId && itemCount > 0) {
                    try {
                        console.log(`Syncing ${sheetName} to Firestore (${targetDocId})...`);
                        await setDoc(doc(db, 'system_data', targetDocId), {
                            items: filteredItems,
                            lastUpdated: serverTimestamp()
                        }, { merge: true });
                        console.log('Sync Complete');
                    } catch (err) { console.error("Firestore Sync Error:", err); }
                }

                setExplorerData(filteredItems);
                setLastFetchTime(new Date());

                return itemCount;
            }
            return 0;
        } catch (e) {
            console.error(e);
            return 0;
        } finally {
            setLoadingExplorer(false);
        }
    };


    const executeAction = async (action: string, payload: any) => {
        setActionLoading(true);
        setActionResult(null);
        try {
            // New: Intercept Native Actions for fast Firestore updates
            if (action === 'add_exp' || action === 'deduct_exp') {
                const amount = action === 'deduct_exp' ? -Math.abs(Number(payload.amount)) : Math.abs(Number(payload.amount));
                await addExpToUser(payload.phone, amount, user?.email || 'Admin', payload.reason || 'Admin Action');
                setActionResult({ success: true, message: `Successfully ${action === 'add_exp' ? 'Added' : 'Deducted'} ${Math.abs(amount)} EXP.` });
            }
            else if (action === 'add_party_point') {
                await addPartyPoints(payload.partyName, Number(payload.amount), user?.email || 'Admin', payload.reason || 'Admin Action');
                setActionResult({ success: true, message: `Added ${payload.amount} points to ${payload.partyName}!` });
            }
            else {
                // Fallback to Apps Script for legacy actions (e.g., Rebirth, Party Management if complex)
                await fetch(APPS_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action, secret: API_SECRET, ...payload, adminName: user?.email })
                });
                setActionResult({ success: true, message: "Command sent to Script! Checking..." });
            }

            await logAdminAction(action, payload);
            setActionForm({});
        } catch (e: any) {
            console.error(e);
            setActionResult({ error: true, message: "Error: " + e.message });
        } finally {
            setActionLoading(false);
        }
    };

    const handleSaveMember = async () => {
        if (!editingMember) return;
        const payload = {
            targetPhone: editingMember.originalPhone,
            newPhone: editingMember.phone,
            displayName: editingMember.displayName,
            codename: editingMember.codename,
            rank: editingMember.rank,
            exp: editingMember.exp,
            party: editingMember.party
        };
        await executeAction('edit_member', payload);
        // Refresh legacy/users data (Snapshot listeners will handle this automatically usually, but we might want to close modal)
        setEditingMember(null);
    };

    const handleSaveDatabaseMember = async () => {
        if (!dbMember) return;
        setLoadingExplorer(true);
        try {
            // Determine Collection
            const collectionName = dbMember.isClaimed ? 'users' : 'legacy_users';
            const docId = dbMember.id || dbMember.phone;

            if (!docId) throw new Error("Missing Document ID");

            const updateData = {
                displayName: dbMember.displayName,
                codename: dbMember.codename,
                phone: dbMember.phone,
                rank: dbMember.rank,
                exp: Number(dbMember.exp),
                rebirthCount: Number(dbMember.rebirthCount || 0),
                expMultiplier: Number(dbMember.expMultiplier || 1),
                party: dbMember.party,
                lastUpdated: serverTimestamp()
            };

            await updateDoc(doc(db, collectionName, docId), updateData);

            await loadUnifiedMembers();
            setDbMember(null);
            alert("✅ Member Updated Successfully!");
        } catch (e: any) {
            console.error(e);
            alert("Error updating member: " + e.message);
        } finally {
            setLoadingExplorer(false);
        }
    };

    const handleSaveExplorerItem = async () => {
        if (!editingExplorerItem) return;

        // Convert the form state back to original keys if needed, 
        // essentially we just send the updated object + context
        const payload = {
            sheetName: explorerTitle,
            rowIndex: editingExplorerItem._rowIndex, // We need to pass the row index
            updates: editingExplorerItem.data
        };

        await executeAction('update_sheet_row', payload);

        // Optimistic Update
        const newData = [...explorerData];
        if (newData[editingExplorerItem._index]) {
            newData[editingExplorerItem._index] = editingExplorerItem.data;
            setExplorerData(newData);
        }

        setEditingExplorerItem(null);
    };

    const handleApproveClaim = async (req: any) => {
        if (!confirm(`Approve ${req.currentDisplayName}?`)) return;
        setProcessingReqId(req.id);
        try {
            const batch = writeBatch(db);
            const userRef = doc(db, 'users', req.uid);
            const requestRef = doc(db, 'claim_requests', req.id);
            const legacyRef = doc(db, 'legacy_users', req.requestedPhone);

            // Check if legacy doc still exists
            const legacySnap = await getDoc(legacyRef);
            const legacyData = legacySnap.exists() ? legacySnap.data() : req.legacyData;

            batch.update(userRef, {
                rank: legacyData.rank, exp: legacyData.exp, party: legacyData.party || '',
                phone: req.requestedPhone, codename: legacyData.codename || '',
                rebirthCount: legacyData.rebirthCount || 0, expMultiplier: legacyData.expMultiplier || 1,
                isLegacyLinked: true, lastSynced: new Date().toISOString()
            });

            batch.delete(requestRef);
            if (legacySnap.exists()) batch.delete(legacyRef);

            await logAdminAction('approve_claim', req);
            await batch.commit();
        } catch (e: any) { alert(e.message); } finally { setProcessingReqId(null); }
    };

    const handleRejectClaim = async (reqId: string) => {
        if (!confirm('Reject?')) return;
        setProcessingReqId(reqId);
        try { await deleteDoc(doc(db, 'claim_requests', reqId)); } catch (e: any) { alert(e.message); } finally { setProcessingReqId(null); }
    };

    const ActionCard = ({ title, icon: Icon, color, onClick }: any) => (
        <button onClick={onClick} className="bg-[#2b2d42] p-4 rounded-xl border border-slate-700/50 hover:bg-[#32344a] hover:border-slate-500 transition-all text-left flex items-start gap-3 group w-full">
            <div className={`p-3 rounded-lg ${color} bg-opacity-20 text-white group-hover:scale-110 transition-transform`}>
                <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
            </div>
            <div>
                <div className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">{title}</div>
                <div className="text-[10px] text-slate-500 mt-1">Remote Execution</div>
            </div>
        </button>
    );

    const Modal = ({ title, children, onClose }: any) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#1e1e24] w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-[#2b2d42]">
                    <h3 className="font-bold text-white flex items-center gap-2"><Wand2 className="w-4 h-4 text-purple-400" /> {title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );

    // 1. Loading State
    if (loading) return (
        <div className="h-screen bg-[#1e1e24] flex items-center justify-center text-white gap-2">
            <Loader2 className="animate-spin text-blue-500" /> Verifying Access...
        </div>
    );

    // 2. Unauthenticated State (Login Screen)
    if (!user) return (
        <div className="min-h-screen bg-[#1e1e24] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#2b2d42] border border-slate-700 rounded-2xl p-8 shadow-2xl text-center animate-in zoom-in-50 duration-300">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                    <Shield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
                <p className="text-slate-400 text-sm mb-8">Secured Access Area. Please verify your identity.</p>

                <button
                    onClick={signInWithGoogle}
                    className="w-full bg-white text-slate-900 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-100 transition-colors"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                    Sign in with Google
                </button>
            </div>
        </div>
    );

    // 3. Unauthorized State (Logged in but not admin)
    if (!ADMIN_EMAILS.includes((user.email || '').toLowerCase())) return (
        <div className="min-h-screen bg-[#1e1e24] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#1e1e24] border border-red-900/50 rounded-2xl p-8 text-center animate-in shake">
                <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-8 h-8 text-red-500" />
                </div>
                <h1 className="text-xl font-bold text-white mb-2">Access Denied</h1>
                <p className="text-slate-400 text-sm mb-6">
                    The account <span className="text-white font-mono bg-slate-800 px-1 rounded">{user.email}</span> is not authorized to access this portal.
                </p>
                <div className="flex gap-3 justify-center">
                    <button onClick={signOut} className="text-sm text-slate-400 hover:text-white underline">Sign Out</button>
                    <button onClick={() => router.push('/dashboard')} className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500">Go to Dashboard</button>
                </div>
            </div>
        </div>
    );

    // 4. Authorized Main UI
    return (
        <div className="min-h-screen bg-[#1e1e24] text-slate-200 font-sans pb-24">

            {/* Header */}
            <div className="bg-[#2b2d42] px-6 py-4 shadow-xl sticky top-0 z-20 flex justify-between items-center border-b border-slate-700/50">
                <div className="flex items-center gap-3 font-bold text-white text-lg tracking-tight">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <Shield className="w-5 h-5 text-white fill-white/20" />
                    </div>
                    <div>
                        Admin Portal
                        <div className="text-[10px] text-slate-400 font-normal leading-none mt-1">Logged as {user.displayName}</div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={signOut} className="text-xs text-red-400 hover:text-red-300 px-3 py-2 flex items-center gap-2"><LogOut className="w-3 h-3" /> Sign Out</button>
                    <button onClick={() => router.push('/dashboard')} className="text-xs bg-slate-700/50 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors font-medium border border-slate-600">Client View</button>
                </div>
            </div>

            {/* Navigation */}
            <div className="px-6 pt-6 pb-2">
                <div className="flex bg-[#23232a] p-1 rounded-2xl w-fit border border-slate-700/50 overflow-x-auto">
                    {['OVERVIEW', 'EXPLORER', 'ACTIONS', 'PAYMENTS', 'APPLICATIONS', 'REQUESTS'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap relative ${activeTab === tab ? 'bg-slate-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                            {tab}
                            {tab === 'PAYMENTS' && publicPayments.filter(p => p.status === 'pending_admin').length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-[9px] border-2 border-[#1e1e24]">{publicPayments.filter(p => p.status === 'pending_admin').length}</span>}
                            {tab === 'REQUESTS' && requests.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] border-2 border-[#1e1e24]">{requests.length}</span>}
                            {tab === 'APPLICATIONS' && users.filter((u: any) => u.status === 'pending_payment').length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[9px] border-2 border-[#1e1e24]">{users.filter((u: any) => u.status === 'pending_payment').length}</span>}
                        </button>
                    ))}
                    {user?.email === 'champ.championest@gmail.com' && (
                        <button onClick={() => setActiveTab('LOGS')}
                            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'LOGS' ? 'bg-amber-600/20 text-amber-500 shadow-lg border border-amber-500/50' : 'text-amber-700 hover:text-amber-500'}`}>
                            <Shield className="w-3 h-3" /> LOGS
                        </button>
                    )}
                </div>
            </div>

            <div className="px-6 py-4">

                {/* --- TAB: OVERVIEW --- */}
                {activeTab === 'OVERVIEW' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/10 p-5 rounded-2xl border border-blue-500/30">
                                <div className="text-[10px] font-bold text-blue-300 mb-1 tracking-wider">TOTAL WAITING</div>
                                <div className="text-3xl font-black text-white">{legacyUsers.length}</div>
                            </div>
                            <div className="bg-gradient-to-br from-green-600/20 to-green-900/10 p-5 rounded-2xl border border-green-500/30">
                                <div className="text-[10px] font-bold text-green-300 mb-1 tracking-wider">ACTIVE</div>
                                <div className="text-3xl font-black text-white">{users.filter(u => u.phone).length}</div>
                            </div>
                        </div>

                        <div className="bg-[#2b2d42] rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
                            <div className="px-6 py-4 border-b border-slate-700/50 flex justify-between items-center bg-[#23232a]">
                                <h3 className="font-bold text-white text-sm">Unclaimed Members</h3>
                                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">Source: Sheet</span>
                            </div>
                            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-[#2a2a35] text-slate-500 sticky top-0 z-10">
                                        <tr>
                                            <th className="p-4">Rank</th>
                                            <th className="p-4">Profile</th>
                                            <th className="p-4 text-right">EXP</th>
                                            <th className="p-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/20">
                                        {legacyUsers.map(u => (
                                            <tr key={u.phone} className="hover:bg-white/5 transition-colors group">
                                                <td className="p-4 text-2xl text-center w-16 bg-black/10 group-hover:bg-transparent transition-colors">{getRankEmoji(u.rank)}</td>
                                                <td className="p-4">
                                                    <div className="font-bold text-white text-sm">{u.displayName}</div>
                                                    <div className="text-[10px] text-slate-500 mt-1 font-mono">{u.codename} • {u.phone}</div>
                                                </td>
                                                <td className="p-4 text-right font-mono text-yellow-400 font-bold text-sm bg-black/10 group-hover:bg-transparent">{u.exp?.toLocaleString()}</td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => setEditingMember({ ...u, originalPhone: u.phone })}
                                                        className="p-2 bg-slate-700/50 hover:bg-blue-600 text-slate-400 hover:text-white rounded-lg transition-all"
                                                    >
                                                        <Settings className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB: PAYMENTS --- */}
                {activeTab === 'PAYMENTS' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <ScrollText className="w-6 h-6 text-amber-400" />
                                Incoming Payments ({publicPayments.filter(p => p.status === 'pending_admin').length})
                            </h2>
                        </div>

                        {/* Payment Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-gradient-to-br from-amber-600/20 to-amber-900/10 p-4 rounded-2xl border border-amber-500/30">
                                <div className="text-[10px] font-bold text-amber-300 mb-1 tracking-wider uppercase">Total Verified</div>
                                <div className="text-2xl font-black text-white">
                                    ฿{publicPayments.filter(p => p.status !== 'pending_admin').reduce((sum, p) => sum + (Number(p.amount) || 0), 0).toLocaleString()}
                                </div>
                                <div className="text-[10px] text-amber-500/70 mt-1">{publicPayments.filter(p => p.status !== 'pending_admin').length} Transactions</div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/10 p-4 rounded-2xl border border-blue-500/30">
                                <div className="text-[10px] font-bold text-blue-300 mb-1 tracking-wider uppercase">Total Pending</div>
                                <div className="text-2xl font-black text-white">
                                    ฿{publicPayments.filter(p => p.status === 'pending_admin').reduce((sum, p) => sum + (Number(p.amount) || 0), 0).toLocaleString()}
                                </div>
                                <div className="text-[10px] text-blue-500/70 mt-1">{publicPayments.filter(p => p.status === 'pending_admin').length} Transactions</div>
                            </div>
                            {/* Category Breakdown - Top 2 Categories */}
                            {Object.entries(
                                publicPayments.reduce((acc: any, p) => {
                                    if (p.category) acc[p.category] = (acc[p.category] || 0) + (Number(p.amount) || 0);
                                    return acc;
                                }, {})
                            ).slice(0, 2).map(([cat, amt]: any) => (
                                <div key={cat} className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
                                    <div className="text-[10px] font-bold text-slate-400 mb-1 tracking-wider uppercase">{cat}</div>
                                    <div className="text-2xl font-black text-white">฿{amt.toLocaleString()}</div>
                                    <div className="text-[10px] text-slate-500 mt-1">Total Category Income</div>
                                </div>
                            ))}
                        </div>

                        {publicPayments.length === 0 ? (
                            <div className="p-12 text-center text-slate-500 bg-[#2b2d42] rounded-2xl border border-slate-700/50 border-dashed">
                                <RefreshCw className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>No payment records found.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                <div className="xl:col-span-2 space-y-4">
                                    {publicPayments.map((pay: any) => (
                                        <div key={pay.id} className={`bg-[#2b2d42] border ${pay.status === 'pending_admin' ? 'border-amber-500/30' : 'border-slate-700/50'} p-4 rounded-2xl flex justify-between items-center group hover:bg-[#32344a] transition-all`}>
                                            <div className="flex items-center gap-4">
                                                <div className="text-2xl font-black text-white w-24">฿{pay.amount.toLocaleString()}</div>
                                                <div className="h-10 w-[1px] bg-slate-700"></div>
                                                <div>
                                                    <div className="font-bold text-white text-sm">
                                                        {pay.customerName} <span className="text-[10px] font-normal text-slate-500">[{pay.sender?.displayName}]</span>
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 flex gap-2">
                                                        <span>Ref: {pay.transRef}</span>
                                                        <span>•</span>
                                                        <span>{pay.verifiedAt?.toDate ? pay.verifiedAt.toDate().toLocaleString() : 'Just now'}</span>
                                                    </div>
                                                    {pay.note && <div className="text-xs text-indigo-300 mt-1 italic">Note: "{pay.note}"</div>}
                                                    {pay.category && <div className="mt-1"><span className="text-[9px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full border border-green-500/30 uppercase font-bold">{pay.category}</span></div>}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {pay.slipImage && (
                                                    <button onClick={() => setViewSlip(pay.slipImage)} className="p-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
                                                        <FileText className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {pay.status === 'pending_admin' && (
                                                    <div className="flex gap-1">
                                                        <select
                                                            onChange={(e) => {
                                                                const cat = e.target.value;
                                                                if (!cat) return;
                                                                if (confirm(`Mark this payment as ${cat}?`)) {
                                                                    updateDoc(doc(db, 'public_payments', pay.id), {
                                                                        category: cat,
                                                                        status: 'verified',
                                                                        processedBy: user?.email,
                                                                        processedAt: serverTimestamp()
                                                                    });
                                                                }
                                                            }}
                                                            className="bg-[#1e1e24] text-xs border border-slate-600 rounded-lg px-2 py-1 outline-none focus:border-indigo-500"
                                                        >
                                                            <option value="">Categorize...</option>
                                                            <option value="ค่าเข้าแข่ง">ค่าเข้าแข่ง (Tournament)</option>
                                                            <option value="ค่าขนม/น้ำ">ค่าขนม/น้ำ</option>
                                                            <option value="ค่าสมาชิกรายเดือน">ค่าสมาชิกรายเดือน</option>
                                                            <option value="ค่าการ์ด/สินค้า">ค่าการ์ด/สินค้า</option>
                                                            <option value="อื่น ๆ">อื่น ๆ</option>
                                                        </select>
                                                        <button
                                                            onClick={async () => {
                                                                if (confirm("Delete this record?")) await deleteDoc(doc(db, 'public_payments', pay.id));
                                                            }}
                                                            className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="hidden xl:block bg-[#15151a] border border-slate-700/50 rounded-2xl p-6 h-fit sticky top-24">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4">Payment Summary (Today)</div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <div className="text-sm text-slate-400">Total Verified</div>
                                            <div className="text-2xl font-black text-green-400">฿{publicPayments.filter(p => p.status === 'verified').reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString()}</div>
                                        </div>
                                        <div className="h-[1px] bg-slate-800"></div>
                                        <div className="space-y-2">
                                            {['ค่าเข้าแข่ง', 'ค่าขนม/น้ำ', 'ค่าสมาชิกรายเดือน', 'ค่าการ์ด/สินค้า'].map(c => (
                                                <div key={c} className="flex justify-between text-[11px]">
                                                    <span className="text-slate-500">{c}</span>
                                                    <span className="text-white font-mono">฿{publicPayments.filter(p => p.category === c).reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- TAB: APPLICATIONS --- */}
                {activeTab === 'APPLICATIONS' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Users className="w-6 h-6 text-blue-400" />
                            New Member Applications
                            <span className="text-sm font-normal text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{users.filter((u: any) => u.status === 'pending_payment').length} pending</span>
                        </h2>

                        {users.filter((u: any) => u.status === 'pending_payment').length === 0 ? (
                            <div className="p-12 text-center text-slate-500 bg-[#2b2d42] rounded-2xl border border-slate-700/50 border-dashed">
                                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No new applications at the moment.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {users.filter((u: any) => u.status === 'pending_payment').map((app: any) => (
                                    <div key={app.id} className="bg-[#2b2d42] border border-slate-700/50 p-6 rounded-2xl flex justify-between items-center shadow-lg hover:border-slate-500 transition-colors">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <div className="font-bold text-white text-lg">{app.displayName}</div>
                                                <div className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30 font-mono">ID: {app.phone}</div>
                                            </div>
                                            <div className="text-slate-400 text-sm mt-2 flex gap-4">
                                                <span className="flex items-center gap-1.5">Phone: {app.phone}</span>
                                                <span className="flex items-center gap-1.5">Nick: {app.nickname}</span>
                                                {app.lineId && <span className="flex items-center gap-1.5 text-green-400">LINE: {app.lineId}</span>}
                                            </div>
                                            <div className="mt-2 text-[10px] text-slate-500">Applied: {app.createdAt?.toDate ? app.createdAt.toDate().toLocaleString() : 'Just now'}</div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={async () => {
                                                    if (!confirm(`Reject (Delete) ${app.displayName}? This cannot be undone.`)) return;
                                                    await deleteDoc(doc(db, 'users', app.id));
                                                }}
                                                className="bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-white px-4 py-2 rounded-xl text-xs font-bold border border-red-900/30 transition-all"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (!confirm(`Approve ${app.displayName}?`)) return;
                                                    await updateDoc(doc(db, 'users', app.id), { status: 'active', paymentStatus: 'paid', approvedAt: serverTimestamp() });
                                                }}
                                                className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-green-900/20 hover:scale-105 transition-all"
                                            >
                                                <Check className="w-4 h-4" /> Approve Application
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* --- TAB: EXPLORER --- */}
                {activeTab === 'EXPLORER' && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[75vh] animate-in fade-in">
                        <div className="md:col-span-3 bg-[#2b2d42] rounded-2xl border border-slate-700/50 overflow-y-auto custom-scrollbar p-2">
                            <button
                                onClick={syncAllData}
                                disabled={loadingExplorer}
                                className="w-full mb-6 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${loadingExplorer ? 'animate-spin' : ''}`} />
                                Sync All Data
                            </button>
                            <div className="mb-4">
                                <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    Management
                                </div>
                                <div className="space-y-1">
                                    <button onClick={() => { setExplorerTitle('Members'); setExplorerData([]); loadUnifiedMembers(); }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between group ${explorerTitle === 'Members' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-3.5 h-3.5" />
                                            Member Manager
                                        </div>
                                        {explorerTitle === 'Members' && <ChevronRight className="w-3 h-3 text-white/70" />}
                                    </button>
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    System Sheets
                                </div>
                                <div className="space-y-1">
                                    <button onClick={() => loadSystemData('quests', 'Quests')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between group ${explorerTitle === 'Quests' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                                        Quest Board
                                        {explorerTitle === 'Quests' && <ChevronRight className="w-3 h-3 text-white/70" />}
                                    </button>
                                    <button onClick={() => loadSystemData('shop', 'Shop')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between group ${explorerTitle === 'Shop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                                        Item Shop
                                        {explorerTitle === 'Shop' && <ChevronRight className="w-3 h-3 text-white/70" />}
                                    </button>
                                </div>
                            </div>
                            {explorerMenu.map(([catName, items]: any) => (
                                <div key={catName} className="mb-4">
                                    <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                        {catName}
                                    </div>
                                    <div className="space-y-1">
                                        {items.map((item: any) => (
                                            <button key={item.id} onClick={() => loadSystemData(item.id, item.title)}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between group ${explorerTitle === item.title ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                                                {item.title}
                                                {explorerTitle === item.title && <ChevronRight className="w-3 h-3 text-white/70" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="md:col-span-9 bg-[#2b2d42] rounded-2xl border border-slate-700/50 overflow-hidden flex flex-col shadow-2xl">
                            <div className="px-6 py-4 border-b border-slate-700/50 bg-[#23232a] flex justify-between items-center h-16 shrink-0">
                                <div className="flex items-center gap-4">
                                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                                        <Database className="w-4 h-4 text-indigo-400" />
                                        {explorerTitle || "Select a Data Source"}
                                    </h3>
                                    {explorerTitle && (
                                        <>
                                            {(explorerTitle === 'Member Dashboard' || explorerTitle === 'member') && (
                                                <button
                                                    onClick={async () => {
                                                        if (!confirm("Run 'Fix Phones' to add leading zeros to all phone numbers in the sheet?")) return;
                                                        await executeAction('fix_phones', {});
                                                        await loadExplorerData(explorerTitle);
                                                    }}
                                                    className="p-1.5 hover:bg-slate-700 rounded-full transition-colors text-amber-400 hover:text-amber-200"
                                                    title="Fix Phone Numbers (Add leading 0)"
                                                    disabled={loadingExplorer || actionLoading}
                                                >
                                                    <Wrench className={`w-3.5 h-3.5 ${actionLoading ? 'animate-pulse' : ''}`} />
                                                </button>
                                            )}
                                            {lastFetchTime && (
                                                <span className="text-[10px] text-slate-500 font-mono hidden sm:inline-block border-r border-slate-700 pr-3 mr-1">
                                                    Upd: {lastFetchTime.toLocaleTimeString()}
                                                </span>
                                            )}
                                            <button
                                                onClick={() => explorerTitle && loadExplorerData(explorerTitle)}
                                                className="p-1.5 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
                                                title="Refresh Data"
                                                disabled={loadingExplorer}
                                            >
                                                <RefreshCw className={`w-3.5 h-3.5 ${loadingExplorer ? 'animate-spin' : ''}`} />
                                            </button>
                                        </>
                                    )}
                                </div>
                                {explorerData.length > 0 && <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">{explorerData.length} records</span>}
                            </div>
                            <div className="flex-1 overflow-auto bg-[#1e1e24]/50 relative">
                                {loadingExplorer ? <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div> :
                                    explorerData.length > 0 ? (
                                        explorerTitle === 'Members' ? (
                                            <div className="w-full">
                                                <table className="w-full text-left text-xs border-collapse">
                                                    <thead className="sticky top-0 bg-[#2b2d42] shadow-lg z-10">
                                                        <tr className="text-slate-400 font-semibold border-b border-slate-700">
                                                            <th className="p-3">Profile</th>
                                                            <th className="p-3">Rank / Rebirth</th>
                                                            <th className="p-3">EXP</th>
                                                            <th className="p-3">Party</th>
                                                            <th className="p-3 text-right">Last Sync</th>
                                                            <th className="p-3 text-right">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-800">
                                                        {explorerData.map((user: any, i) => (
                                                            <tr key={user.id || i} className={`hover:bg-white/5 transition-colors ${user.isClaimed ? '' : 'opacity-70 bg-slate-900/30'}`}>
                                                                <td className="p-3">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${user.isClaimed ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                                                            {user.displayName?.[0] || user.codename?.[0] || '?'}
                                                                        </div>
                                                                        <div>
                                                                            <div className="font-bold text-white flex items-center gap-2">
                                                                                {user.codename || user.displayName || 'Unnamed'}
                                                                                {user.isClaimed && <span className="text-[9px] bg-green-500/20 text-green-400 px-1 rounded border border-green-500/30">APP</span>}
                                                                            </div>
                                                                            <div className="text-[10px] text-slate-500 font-mono">{user.phone}</div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="p-3">
                                                                    <div className="flex flex-col">
                                                                        <div className="font-bold text-indigo-300">{user.rank || 'Rookie'}</div>
                                                                        {user.rebirthCount > 0 && (
                                                                            <div className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                                                                                <Zap className="w-3 h-3" /> Rebirth {user.rebirthCount}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="p-3">
                                                                    <div className="font-mono text-slate-300">{(Number(user.exp) || 0).toLocaleString()}</div>
                                                                    {user.expMultiplier && user.expMultiplier > 1 && (
                                                                        <div className="text-[9px] text-slate-500">x{user.expMultiplier} Bonus</div>
                                                                    )}
                                                                </td>
                                                                <td className="p-3 text-slate-400">{user.party || '-'}</td>
                                                                <td className="p-3 text-right font-mono text-slate-500 text-[10px]">
                                                                    {user.lastUpdated ?
                                                                        (user.lastUpdated.toDate ? user.lastUpdated.toDate() : new Date(user.lastUpdated)).toLocaleDateString()
                                                                        : '-'}
                                                                </td>
                                                                <td className="p-3 text-right">
                                                                    <button
                                                                        onClick={() => setDbMember({ ...user })}
                                                                        className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-white rounded transition-colors"
                                                                    >
                                                                        <Highlighter className="w-4 h-4" />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) :
                                            explorerTitle === 'โพสต์ Rank Up' ? (
                                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {(() => {
                                                        // Corrected Rank Order: Series 1 -> Rebirth -> Series 2
                                                        // Previous interleaved order (Gold, Gold II, Platinum...) was causing incorrect "Missing" flags for Series 1 players.
                                                        const RankOrder = [
                                                            'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Grandmaster', 'Legend', 'God',
                                                            'REBIRTH',
                                                            'Gold II', 'Platinum II', 'Diamond II', 'Grandmaster II', 'Legend II', 'God II'
                                                        ];

                                                        const getMissing = (row: any) => {
                                                            const currentRank = (row['Current Rank'] || '').trim();
                                                            const currentIdx = RankOrder.indexOf(currentRank);

                                                            // If rank not found or index -1, no requirements
                                                            if (currentIdx === -1) return [];

                                                            const missing: string[] = [];
                                                            for (let i = 0; i <= currentIdx; i++) {
                                                                const r = RankOrder[i];
                                                                // Only check if column exists in the row data
                                                                // This prevents "Bronze" appearing if the column was deleted/hidden
                                                                if (row[r] === undefined) continue;

                                                                // Check if checked. In Sheet: Checked = true, Unchecked = false/empty
                                                                if (row[r] !== true && row[r] !== 'true') {
                                                                    missing.push(r);
                                                                }
                                                            }
                                                            return missing;
                                                        };

                                                        const processedData = explorerData.map((row, i) => ({
                                                            ...row,
                                                            _missing: getMissing(row),
                                                            _rowIndex: row._rowIndex || (i + 2),
                                                            _originalIndex: i
                                                        })).filter(item => item._missing.length > 0);

                                                        // Sort by number of missing items (Descending)
                                                        processedData.sort((a, b) => b._missing.length - a._missing.length);

                                                        if (processedData.length === 0) {
                                                            return (
                                                                <div className="col-span-full flex flex-col items-center justify-center p-12 text-slate-500 opacity-50">
                                                                    <Check className="w-12 h-12 mb-2" />
                                                                    <p>All rank posts are up to date! Great job!</p>
                                                                </div>
                                                            );
                                                        }

                                                        return processedData.map((row, i) => (
                                                            <div key={row._originalIndex} className="bg-[#23232a] border border-slate-700/50 rounded-xl p-4 flex flex-col gap-3 shadow-sm hover:border-slate-500 transition-colors animate-in fade-in slide-in-from-bottom-2">
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <div className="text-sm font-bold text-white flex items-center gap-2">
                                                                            <Users className="w-4 h-4 text-slate-400" />
                                                                            {row['Code name'] || row['Name'] || 'Unknown'}
                                                                        </div>
                                                                        <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                                                                            Current Rank:
                                                                            <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                                                                                {row['Current Rank'] || '-'}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    {row._missing.length > 0 && <div className="px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold">
                                                                        {row._missing.length} MISSING
                                                                    </div>}
                                                                </div>

                                                                <div className="bg-[#1e1e24] rounded-lg p-2 space-y-2 border border-slate-700/30">
                                                                    {row._missing.map((rank: string) => (
                                                                        <div key={rank} className="flex items-center justify-between group">
                                                                            <span className="text-xs font-medium text-slate-300 flex items-center gap-2">
                                                                                <Trophy className="w-3 h-3 text-yellow-500/80" />
                                                                                Post {rank}
                                                                            </span>
                                                                            <button
                                                                                onClick={async () => {
                                                                                    if (!confirm(`Mark ${rank} post as DONE for ${row['Code name']}?`)) return;

                                                                                    // Optimistic Update First
                                                                                    const newData = [...explorerData];
                                                                                    const idx = newData.findIndex(r => r._rowIndex === row._rowIndex);
                                                                                    if (idx !== -1) {
                                                                                        newData[idx][rank] = true;
                                                                                        setExplorerData(newData);
                                                                                    }

                                                                                    // Server Update
                                                                                    const payload = {
                                                                                        sheetName: explorerTitle,
                                                                                        rowIndex: row._rowIndex,
                                                                                        updates: { [rank]: true }
                                                                                    };
                                                                                    await executeAction('update_sheet_row', payload);

                                                                                    // Force Refresh from Sheet to ensure consistency
                                                                                    await loadExplorerData(explorerTitle);
                                                                                }}
                                                                                className="flex items-center gap-1 px-2 py-1 bg-green-900/40 hover:bg-green-600 border border-green-700/50 text-green-300 hover:text-white rounded text-[10px] font-bold transition-all"
                                                                            >
                                                                                <CheckSquare className="w-3 h-3" /> MARK DONE
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                    {row._missing.length === 0 && <div className="text-center text-[10px] text-green-500 py-1 flex items-center justify-center gap-1"><Check className="w-3 h-3" /> All ranks completed</div>}
                                                                </div>
                                                            </div>
                                                        ));
                                                    })()}
                                                </div>
                                            ) : (
                                                <div className="w-full">
                                                    {/* Define headers once to ensure consistent order */}
                                                    {(() => {
                                                        // Default: use keys from first row, except invalid ones
                                                        let headers = Object.keys(explorerData[0]).filter(k => k !== '_rowIndex' && k !== '_index' && k !== 'data');

                                                        // CUSTOM ORDER for Leaderboard
                                                        if (explorerTitle === 'Leaderboard' || explorerTitle === 'Member Dashboard') {
                                                            const desiredOrder = ['ชื่อเล่น', 'Phone', 'Codename', 'Rank', 'EXP', 'Party', 'Rebirth Count', 'EXP Multiplier'];
                                                            const availableKeys = Object.keys(explorerData[0]);
                                                            const matchedKeys = desiredOrder.filter(k => availableKeys.includes(k));
                                                            if (matchedKeys.length > 0) headers = matchedKeys;
                                                        }

                                                        return (
                                                            <table className="w-full text-xs whitespace-nowrap border-collapse">
                                                                <thead className="bg-[#23232a] text-slate-400 sticky top-0 z-10 shadow-sm border-b border-slate-700">
                                                                    <tr>
                                                                        <th className="px-4 py-3 text-center font-semibold bg-[#23232a] w-20">Actions</th>
                                                                        {headers.map(k => <th key={k} className="px-4 py-3 text-left font-semibold bg-[#23232a] text-slate-300">{k}</th>)}
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-slate-700/20 text-slate-300">
                                                                    {explorerData.map((row, i) => (
                                                                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                                                                            <td className="px-4 py-3 flex items-center justify-center gap-2">
                                                                                <button
                                                                                    onClick={() => setEditingExplorerItem({ _index: i, _rowIndex: row._rowIndex || (i + 2), data: { ...row } })}
                                                                                    className="px-3 py-1.5 bg-slate-700/50 hover:bg-indigo-600 text-slate-400 hover:text-white rounded transition-all text-[10px] font-bold flex items-center gap-1.5 border border-slate-600/30 hover:border-indigo-500/50"
                                                                                >
                                                                                    <Settings className="w-3 h-3" /> Edit
                                                                                </button>
                                                                            </td>
                                                                            {headers.map((k, j) => {
                                                                                const val = row[k];
                                                                                let displayVal = val;

                                                                                // Rank with Emoji
                                                                                if (k === 'Rank') {
                                                                                    return (
                                                                                        <td key={j} className="px-4 py-3">
                                                                                            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#1a1a20] border border-slate-700/50 font-bold text-white shadow-sm">
                                                                                                <span className="text-sm filter drop-shadow-md">{getRankEmoji(String(val))}</span>
                                                                                                {val}
                                                                                            </span>
                                                                                        </td>
                                                                                    );
                                                                                }

                                                                                // Highlight EXP
                                                                                if (k === 'EXP') {
                                                                                    return <td key={j} className="px-4 py-3 font-mono text-amber-400 font-bold text-sm shadow-amber-500/10 drop-shadow-sm">{val}</td>
                                                                                }

                                                                                // Format Phone (Monospace)
                                                                                if (k === 'Phone' || k === 'เบอร์' || k.toLowerCase().includes('phone')) {
                                                                                    return <td key={j} className="px-4 py-3 font-mono text-slate-400 bg-slate-800/20 rounded px-2">{val}</td>
                                                                                }

                                                                                // Date Formatting Logic
                                                                                if (val && (k.toLowerCase().includes('date') || k.toLowerCase().includes('time') || k.includes('เวลา') || k.includes('วัน'))) {
                                                                                    if (typeof val === 'number' && val > 35000) {
                                                                                        try {
                                                                                            const date = new Date((val - 25569) * 86400 * 1000);
                                                                                            displayVal = date.toLocaleString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                                                                                        } catch (e) { }
                                                                                    }
                                                                                }

                                                                                return <td key={j} className="px-4 py-3 font-medium">{displayVal}</td>
                                                                            })}
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        );
                                                    })()}
                                                </div>
                                            )
                                    ) : <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-3"><LayoutGrid className="w-12 h-12 opacity-20" /><p className="text-xs">Select data source</p></div>}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB: ACTIONS --- */}
                {activeTab === 'ACTIONS' && (
                    <div className="animate-in fade-in grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">EXP & Activity</h3>
                            <ActionCard title="Add EXP" icon={Zap} color="bg-yellow-500" onClick={() => setActionModal('add_exp')} />
                            <ActionCard title="Deduct EXP" icon={ArrowUpRight} color="bg-red-500" onClick={() => setActionModal('deduct_exp')} />
                            <ActionCard title="Undo Last EXP Action" icon={RotateCcw} color="bg-orange-500" onClick={() => setActionModal('undo_exp')} />
                            <ActionCard title="Add Party Point" icon={Star} color="bg-indigo-500" onClick={() => setActionModal('add_party_point')} />
                            <ActionCard title="Redeem Party Point" icon={Star} color="bg-pink-600" onClick={() => setActionModal('redeem_party_point')} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">Party System</h3>
                            <ActionCard title="Create Party" icon={PlusCircle} color="bg-green-500" onClick={() => setActionModal('create_party')} />
                            <ActionCard title="Assign / Move Party" icon={Users} color="bg-blue-500" onClick={() => setActionModal('assign_party')} />
                            <ActionCard title="Remove from Party" icon={UserMinus} color="bg-red-400" onClick={() => setActionModal('remove_from_party')} />
                            <ActionCard title="Disband Party" icon={Trash2} color="bg-red-600" onClick={() => setActionModal('disband_party')} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">System</h3>
                            <ActionCard title="Perform Rebirth" icon={RefreshCw} color="bg-purple-500" onClick={() => setActionModal('rebirth')} />
                            <ActionCard title="Update Leaderboard" icon={Database} color="bg-blue-600" onClick={() => executeAction('update_leaderboard', {})} />
                            <ActionCard title="Highlight Ranks" icon={Highlighter} color="bg-yellow-600" onClick={() => executeAction('highlight_ranks', {})} />
                            <ActionCard title="Manual Sync All" icon={RefreshCw} color="bg-slate-600" onClick={() => executeAction('sync_all', {})} />
                            <ActionCard title="Reset User (Test Mode)" icon={Trash2} color="bg-red-900" onClick={() => setActionModal('reset_user_test')} />
                        </div>
                    </div>
                )}

                {/* --- TAB: REQUESTS --- */}
                {activeTab === 'REQUESTS' && (
                    <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in">
                        {requests.length === 0 ? <div className="text-center py-20 text-slate-500 bg-[#2b2d42] rounded-2xl border border-slate-700/50"><Check className="w-12 h-12 mx-auto mb-3 opacity-20 text-green-500" /><p>All clear!</p></div> :
                            requests.map(req => (
                                <div key={req.id} className="bg-[#2b2d42] p-5 rounded-2xl border border-slate-700 shadow-lg">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-slate-700 overflow-hidden ring-2 ring-slate-600">
                                            {req.profileImage ? <img src={req.profileImage} className="w-full h-full" /> : <Users className="w-6 h-6 m-auto text-slate-500" />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-lg">{req.currentDisplayName || req.displayName} <span className="text-slate-400 text-sm font-normal">({req.requestedPhone || req.phone})</span></div>
                                            <div className="text-xs text-slate-400">{req.legacyData?.displayName || req.nickname || 'Unknown Legacy Name'}</div>
                                            {req.slipImage && (
                                                <button onClick={() => setViewSlip(req.slipImage)} className="mt-2 text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30 hover:bg-indigo-500/40 flex items-center gap-1 w-fit">
                                                    <FileText className="w-3 h-3" /> View Payment Slip
                                                </button>
                                            )}
                                        </div>
                                        <div className="ml-auto flex gap-2">
                                            <button onClick={() => handleRejectClaim(req.id)} className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm font-bold hover:bg-red-500/20">Decline</button>
                                            <button onClick={() => handleApproveClaim(req)} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-500 shadow-lg shadow-green-900/30">Approve</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}

                {/* --- TAB: LOGS --- */}
                {activeTab === 'LOGS' && user?.email === 'champ.championest@gmail.com' && (
                    <div className="max-w-7xl mx-auto space-y-4 animate-in fade-in">
                        <div className="bg-[#1e1e24] rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
                            <div className="p-4 bg-[#23232a] border-b border-slate-700 flex justify-between items-center">
                                <h3 className="font-bold text-white flex items-center gap-2 text-sm"><Shield className="text-amber-500 w-4 h-4" /> Admin Action Logs</h3>
                                <span className="text-xs text-slate-500 bg-black/20 px-2 py-1 rounded">{adminLogs.length} Records</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left whitespace-nowrap">
                                    <thead className="bg-[#1a1a20] text-slate-400 font-semibold uppercase tracking-wider sticky top-0">
                                        <tr>
                                            <th className="p-3 w-40">Time</th>
                                            <th className="p-3 w-48">Admin</th>
                                            <th className="p-3 w-32">Action</th>
                                            <th className="p-3">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/20 text-slate-300 font-mono">
                                        {adminLogs.map(log => (
                                            <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                                <td className="p-3 text-slate-500">{log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString('th-TH') : 'N/A'}</td>
                                                <td className="p-3 text-blue-400 font-bold">{log.admin}</td>
                                                <td className="p-3">
                                                    <span className="bg-slate-700/50 border border-slate-600 px-1.5 py-0.5 rounded text-[10px] text-white">
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-slate-400 truncate max-w-xl" title={log.details}>
                                                    {log.details}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* --- MODALS --- */}
            {actionModal && (
                <Modal title={actionModal.replace('_', ' ').toUpperCase()} onClose={() => setActionModal(null)}>
                    {!actionResult ? (
                        <div className="space-y-4">
                            {/* Phone Input (For User Actions) */}
                            {!['create_party', 'disband_party', 'add_party_point', 'redeem_party_point'].includes(actionModal) && (
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Phone Number</label>
                                    <input type="text" className="w-full bg-[#15151a] border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none font-mono"
                                        placeholder="08xxxxxxxx" onChange={e => setActionForm({ ...actionForm, phone: e.target.value })} />
                                </div>
                            )}

                            {/* Party Name Input (Text for Create/Disband, Select for others) */}
                            {['create_party', 'disband_party', 'assign_party', 'add_party_point', 'redeem_party_point'].includes(actionModal) && (
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Party Name</label>
                                    {['create_party', 'disband_party'].includes(actionModal) ? (
                                        <input type="text" className="w-full bg-[#15151a] border border-slate-700 rounded-lg p-3 text-white focus:border-green-500 outline-none"
                                            placeholder="Party Name" onChange={e => setActionForm({ ...actionForm, partyName: e.target.value })} />
                                    ) : (
                                        <select className="w-full bg-[#15151a] border border-slate-700 rounded-lg p-3 text-white focus:border-pink-500 outline-none"
                                            onChange={e => setActionForm({ ...actionForm, partyName: e.target.value })}>
                                            <option value="">Select Party</option>
                                            {['Meow', 'Woof', 'Hoot', 'Squeak', 'Moo', 'Oink', 'Gao'].map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    )}
                                </div>
                            )}

                            {/* Amount Input */}
                            {['add_exp', 'deduct_exp', 'add_party_point', 'redeem_party_point'].includes(actionModal) && (
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Amount</label>
                                    <input type="number" className="w-full bg-[#15151a] border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                        placeholder="Amount" onChange={e => setActionForm({ ...actionForm, amount: e.target.value })} />
                                </div>
                            )}

                            {/* Reason Input */}
                            {['add_exp', 'deduct_exp'].includes(actionModal) && (
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Reason / Activity</label>
                                    <input type="text" className="w-full bg-[#15151a] border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                        placeholder="Details..." onChange={e => setActionForm({ ...actionForm, activity: e.target.value, reason: e.target.value })} />
                                </div>
                            )}

                            {/* Warnings */}
                            {actionModal === 'rebirth' && (
                                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-200 text-xs text-center">
                                    ⚠️ Warning: This will reset the user's Level but keep the Rank, and increment Rebirth Count.
                                </div>
                            )}
                            {actionModal === 'disband_party' && (
                                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-200 text-xs text-center">
                                    ⚠️ Warning: This will DELETE the party and remove all members from it.
                                </div>
                            )}

                            <button disabled={actionLoading} onClick={() => executeAction(actionModal, actionForm)} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-500 disabled:opacity-50 flex justify-center shadow-lg shadow-blue-900/40">
                                {actionLoading ? <Loader2 className="animate-spin" /> : "Execute Command"}
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${actionResult.error ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                                {actionResult.error ? <X /> : <Check />}
                            </div>
                            <div className="text-white font-bold mb-2">{actionResult.error ? 'Error' : 'Success!'}</div>
                            <div className="text-slate-400 text-xs mb-4">{actionResult.message}</div>
                            <button onClick={() => { setActionResult(null); setActionModal(null); }} className="text-slate-400 hover:text-white underline">Close</button>
                        </div>
                    )}
                </Modal>
            )}

            {/* --- EDIT MEMBER MODAL --- */}
            {editingMember && (
                <Modal title="Edit Member" onClose={() => setEditingMember(null)}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Nickname</label>
                                <input type="text" className="w-full bg-[#15151a] border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    value={editingMember.displayName || ''}
                                    onChange={e => setEditingMember({ ...editingMember, displayName: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Codename</label>
                                <input type="text" className="w-full bg-[#15151a] border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    value={editingMember.codename || ''}
                                    onChange={e => setEditingMember({ ...editingMember, codename: e.target.value })} />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Phone Number</label>
                            <input type="text" className="w-full bg-[#15151a] border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none font-mono"
                                value={editingMember.phone || ''}
                                onChange={e => setEditingMember({ ...editingMember, phone: e.target.value })} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Rank</label>
                                <select className="w-full bg-[#15151a] border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    value={editingMember.rank || 'Rookie'}
                                    onChange={e => setEditingMember({ ...editingMember, rank: e.target.value })}>
                                    {['Rookie', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Grandmaster', 'Legend'].map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Party</label>
                                <input type="text" className="w-full bg-[#15151a] border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    value={editingMember.party || ''}
                                    onChange={e => setEditingMember({ ...editingMember, party: e.target.value })} />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-slate-400 block mb-1">EXP</label>
                            <input type="number" className="w-full bg-[#15151a] border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none font-mono"
                                value={editingMember.exp || 0}
                                onChange={e => setEditingMember({ ...editingMember, exp: Number(e.target.value) })} />
                        </div>

                        <button disabled={actionLoading} onClick={handleSaveMember} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-500 disabled:opacity-50 flex justify-center shadow-lg shadow-blue-900/40 mt-4">
                            {actionLoading ? <Loader2 className="animate-spin" /> : "Save Changes"}
                        </button>
                    </div>
                </Modal>
            )}

            {/* --- DATABASE MEMBER EDITOR MODAL --- */}
            {dbMember && (
                <Modal title={`Edit Database Member (${dbMember._status})`} onClose={() => setDbMember(null)}>
                    <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Display Name</label>
                                <input type="text" className="w-full bg-[#15151a] border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    value={dbMember.displayName || ''}
                                    onChange={e => setDbMember({ ...dbMember, displayName: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Codename</label>
                                <input type="text" className="w-full bg-[#15151a] border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    value={dbMember.codename || ''}
                                    onChange={e => setDbMember({ ...dbMember, codename: e.target.value })} />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Phone (ID)</label>
                            <input type="text" className="w-full bg-[#15151a] border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none font-mono"
                                value={dbMember.phone || ''}
                                disabled={dbMember.isClaimed}
                                onChange={e => setDbMember({ ...dbMember, phone: e.target.value })} />
                            {dbMember.isClaimed && <p className="text-[10px] text-slate-500 mt-1">Claimed user phone cannot be changed directly here.</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Rank</label>
                                <select className="w-full bg-[#15151a] border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    value={dbMember.rank || 'Rookie'}
                                    onChange={e => setDbMember({ ...dbMember, rank: e.target.value })}>
                                    {['Rookie', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Grandmaster', 'Legend'].map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Party</label>
                                <input type="text" className="w-full bg-[#15151a] border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    value={dbMember.party || ''}
                                    onChange={e => setDbMember({ ...dbMember, party: e.target.value })} />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-1">
                                <label className="text-xs text-slate-400 block mb-1">EXP</label>
                                <input type="number" className="w-full bg-[#15151a] border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none font-mono"
                                    value={dbMember.exp || 0}
                                    onChange={e => setDbMember({ ...dbMember, exp: e.target.value })} />
                            </div>
                            <div className="col-span-1">
                                <label className="text-xs text-slate-400 block mb-1">Rebirths</label>
                                <input type="number" className="w-full bg-[#15151a] border border-slate-700 rounded-lg p-3 text-white focus:border-amber-500 outline-none font-mono"
                                    value={dbMember.rebirthCount || 0}
                                    onChange={e => setDbMember({ ...dbMember, rebirthCount: e.target.value })} />
                            </div>
                            <div className="col-span-1">
                                <label className="text-xs text-slate-400 block mb-1">Multiplier</label>
                                <input type="number" className="w-full bg-[#15151a] border border-slate-700 rounded-lg p-3 text-white focus:border-amber-500 outline-none font-mono"
                                    value={dbMember.expMultiplier || 1}
                                    onChange={e => setDbMember({ ...dbMember, expMultiplier: e.target.value })} />
                            </div>
                        </div>

                        <button disabled={loadingExplorer} onClick={handleSaveDatabaseMember} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 flex justify-center shadow-lg transform active:scale-[0.98] transition-all">
                            {loadingExplorer ? <Loader2 className="animate-spin" /> : "Save to Database"}
                        </button>
                    </div>
                </Modal>
            )}

            {/* --- RESET USER TEST MODAL --- */}
            {actionModal === 'reset_user_test' && (
                <Modal title="Danger Zone: Reset User" onClose={() => { setActionModal(null); setActionForm({}); }}>
                    <div className="space-y-4">
                        <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl text-xs">
                            <h3 className="font-bold flex items-center gap-2 mb-2"><AlertCircle className="w-4 h-4 text-red-500" /> WARNING</h3>
                            <p>This will permanently DELETE the user from the database. It is intended for testing the registration flow repeatedly.</p>
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Target Phone Number</label>
                            <input type="text" className="w-full bg-[#15151a] border border-slate-700 rounded-lg p-3 text-white focus:border-red-500 outline-none font-mono"
                                placeholder="08xxxxxxxx"
                                value={actionForm.phone || ''}
                                onChange={e => setActionForm({ ...actionForm, phone: e.target.value })} />
                        </div>
                        <button disabled={actionLoading} onClick={async () => {
                            if (!actionForm.phone) return alert("Phone number required");
                            if (!confirm(`Confirm DELETE user ${actionForm.phone}?`)) return;
                            setActionLoading(true);
                            try {
                                // 1. Find User UID by Phone to delete from 'users'
                                const q = query(collection(db, 'users'), where('phone', '==', actionForm.phone.trim()));
                                const snap = await getDocs(q);
                                if (snap.empty) {
                                    console.log("No claimed user found.");
                                }
                                snap.forEach(async (d) => {
                                    await deleteDoc(d.ref);
                                    console.log(`Deleted user ${d.id}`);
                                });

                                // 2. Delete from 'legacy_users'
                                await deleteDoc(doc(db, 'legacy_users', actionForm.phone.trim()));

                                alert("User reset complete! They can register again now.");
                                setActionModal(null); setActionForm({});
                            } catch (e: any) {
                                alert("Error: " + e.message);
                            } finally {
                                setActionLoading(false);
                            }
                        }} className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-500 disabled:opacity-50 flex justify-center shadow-lg shadow-red-900/40">
                            {actionLoading ? <Loader2 className="animate-spin" /> : "DELETE USER"}
                        </button>
                    </div>
                </Modal>
            )}

            {/* --- VIEW SLIP MODAL --- */}
            {viewSlip && (
                <Modal title="Payment Verification" onClose={() => setViewSlip(null)}>
                    <div className="flex flex-col items-center">
                        <img src={viewSlip} className="max-w-full max-h-[70vh] rounded-lg border border-slate-700 mb-4" />
                        <a href={viewSlip} download="slip.jpg" className="text-blue-400 text-sm hover:underline">Download Original</a>
                    </div>
                </Modal>
            )}

            {/* --- EDIT EXPLORER ITEM MODAL --- */}
            {editingExplorerItem && (
                <Modal title={`Edit ${explorerTitle}`} onClose={() => setEditingExplorerItem(null)}>
                    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                        {Object.keys(editingExplorerItem.data).map((key) => (
                            <div key={key}>
                                <label className="text-xs text-slate-400 block mb-1">{key}</label>
                                <textarea
                                    className="w-full bg-[#15151a] border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none min-h-[40px]"
                                    rows={1}
                                    value={editingExplorerItem.data[key]}
                                    onChange={(e) => {
                                        const newData = { ...editingExplorerItem.data, [key]: e.target.value };
                                        setEditingExplorerItem({ ...editingExplorerItem, data: newData });
                                    }}
                                />
                            </div>
                        ))}
                        <button disabled={actionLoading} onClick={handleSaveExplorerItem} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-500 disabled:opacity-50 flex justify-center shadow-lg shadow-blue-900/40 mt-4">
                            {actionLoading ? <Loader2 className="animate-spin" /> : "Save Changes"}
                        </button>
                    </div>
                </Modal>
            )}
            {/* --- MODAL: VIEW SLIP --- */}
            {viewSlip && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-200">
                    <div className="relative max-w-2xl w-full">
                        <button
                            onClick={() => setViewSlip(null)}
                            className="absolute -top-12 right-0 text-white flex items-center gap-2 hover:text-slate-300 transition-colors"
                        >
                            <X className="w-6 h-6" /> Close
                        </button>
                        <div className="bg-[#1a1a1f] p-2 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
                            <img src={viewSlip} alt="Payment Slip" className="w-full h-auto rounded-xl max-h-[80vh] object-contain" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
