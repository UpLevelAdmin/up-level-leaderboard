'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Star, Shield, Zap, Award, Users, Link as LinkIcon, AlertCircle, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import AvatarSelector from '@/components/AvatarSelector';

export default function Dashboard() {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    // User Stats
    const [userData, setUserData] = useState<any>(null);
    const [rank, setRank] = useState('Rookie');
    const [exp, setExp] = useState(0);
    const [party, setParty] = useState('No Party');

    // Link Account & Request State
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [phoneInput, setPhoneInput] = useState('');
    const [linkError, setLinkError] = useState('');
    const [linkSuccess, setLinkSuccess] = useState('');
    const [isLinking, setIsLinking] = useState(false);
    const [pendingRequest, setPendingRequest] = useState<any>(null);

    useEffect(() => {
        setIsMounted(true);
        if (!loading && !user) router.push('/');
        if (!user) return;

        // Fetch real-time data from Firestore 'users' collection
        const unsub = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setUserData(data);
                setRank(data.rank || 'Rookie');
                setExp(data.exp || 0);
                setParty(data.party || 'No Party');
            }
        });

        // Check pending requests
        const checkPending = async () => {
            const requestSnap = await getDoc(doc(db, 'claim_requests', user.uid));
            if (requestSnap.exists()) setPendingRequest(requestSnap.data());
        };
        checkPending();

        return () => unsub();
    }, [user, loading, router]);

    const handleLinkAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setLinkError('');
        setLinkSuccess('');
        setIsLinking(true);

        try {
            if (!user) return;
            const phone = phoneInput.trim().replace(/-/g, ''); // Normalize phone
            if (!phone || phone.length < 9) throw new Error("Invalid phone number");

            // 1. Check legacy_users (verify existence ONLY)
            const legacyRef = doc(db, 'legacy_users', phone);
            const legacySnap = await getDoc(legacyRef);

            if (!legacySnap.exists()) {
                throw new Error("Phone number not found in legacy system (or already claimed).");
            }

            const legacyData = legacySnap.data();

            // 2. Create Claim Request instead of claiming directly
            await setDoc(doc(db, 'claim_requests', user.uid), {
                uid: user.uid,
                email: user.email,
                currentDisplayName: user.displayName,
                profileImage: user.photoURL,
                requestedPhone: phone,
                legacyData: legacyData, // Store snapshot for admin review
                status: 'pending',
                createdAt: new Date().toISOString()
            });

            setPendingRequest({ requestedPhone: phone, status: 'pending' });
            setLinkSuccess(`Verification request sent! Please wait for Admin approval.`);

            // Close modal after success
            setTimeout(() => setShowLinkModal(false), 2000);

        } catch (err: any) {
            setLinkError(err.message);
        } finally {
            setIsLinking(false);
        }
    };

    if (!isMounted || loading || !user) {
        return (
            <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7AC0E7]"></div>
            </div>
        );
    }

    // Rank Logic for Progress Bar
    const getNextLevelExp = (r: string) => {
        if (r === 'Legend') return 200;
        if (r === 'Grandmaster') return 200;
        if (r === 'Diamond') return 120;
        if (r === 'Platinum') return 75;
        if (r === 'Gold') return 50;
        if (r === 'Silver') return 30;
        return 15; // Rookie/Bronze
    };
    const nextLevelExp = getNextLevelExp(rank);
    const progress = Math.min((exp / nextLevelExp) * 100, 100);

    return (
        <div className="min-h-screen bg-[#F0F2F5] pb-24 relative font-poppins">
            {/* Header Background */}
            <div className="h-56 bg-[#1F2E4A] rounded-b-[3rem] relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                {/* Logout Button */}
                <button
                    onClick={() => signOut()}
                    className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-white border border-white/20 transition-all"
                >
                    Logout
                </button>
            </div>

            <div className="px-6 -mt-24">
                {/* Profile Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-[2rem] p-6 shadow-xl border-4 border-white relative z-10"
                >
                    <div className="flex flex-col items-center">
                        {/* Avatar */}
                        <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#FFD700] to-[#FFB300] border-[6px] border-white shadow-lg flex items-center justify-center -mt-20 mb-4 relative z-20 overflow-hidden">
                            {userData?.photoURL || user?.photoURL ? (
                                <img src={userData?.photoURL || user?.photoURL} alt="User Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-5xl">🦉</span>
                            )}
                            <div className="absolute bottom-0 w-full bg-[#4A90E2] text-white text-[10px] font-bold py-0.5 text-center tracking-wider">
                                MEMBER
                            </div>
                        </div>

                        <h2 className="text-2xl font-black text-[#1F2E4A] tracking-tight">{user.displayName}</h2>
                        <div className="flex items-center gap-2 mt-2 mb-6">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 shadow-sm
                                ${rank === 'Rookie' ? 'bg-gray-100 text-gray-500 border-gray-200' :
                                    rank === 'Gold' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                                        'bg-blue-50 text-blue-600 border-blue-200'}`}>
                                <Shield className="w-3.5 h-3.5 fill-current" />
                                {rank.toUpperCase()}
                            </span>
                            <span className="px-4 py-1.5 bg-blue-50 text-blue-500 rounded-full text-xs font-bold border border-blue-100 flex items-center gap-1.5 shadow-sm">
                                <Users className="w-3.5 h-3.5" />
                                {party || 'No Party'}
                            </span>
                        </div>

                        {/* EXP Bar */}
                        <div className="w-full bg-gray-100 h-5 rounded-full overflow-hidden relative mb-2 shadow-inner">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ delay: 0.2, duration: 1, type: "spring" }}
                                className="h-full bg-gradient-to-r from-[#4A90E2] to-[#357ABD] rounded-full relative"
                            >
                                <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
                            </motion.div>
                        </div>
                        <div className="flex justify-between w-full text-xs font-bold text-gray-400 mb-6 px-1">
                            <span>EXP {exp}</span>
                            <span>Top {nextLevelExp}</span>
                        </div>

                        {/* Onboarding Choices for New Users */}
                        {exp === 0 && !pendingRequest && (
                            <div className="w-full grid grid-cols-2 gap-3 mb-6">
                                {/* Option 1: Existing Member */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowLinkModal(true)}
                                    className="bg-gradient-to-br from-orange-400 to-pink-500 text-white p-4 rounded-2xl shadow-lg shadow-orange-500/20 flex flex-col items-center justify-center gap-2 h-32 group"
                                >
                                    <div className="bg-white/20 p-3 rounded-full mb-1">
                                        <LinkIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold text-sm">Link Old Account</p>
                                        <p className="text-[9px] text-white/90 font-medium opacity-80 mt-1">I was a member</p>
                                    </div>
                                </motion.button>

                                {/* Option 2: New Member */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => router.push('/register')}
                                    className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-4 rounded-2xl shadow-lg shadow-indigo-500/20 flex flex-col items-center justify-center gap-2 h-32 group"
                                >
                                    <div className="bg-white/20 p-3 rounded-full mb-1">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold text-sm">New Member</p>
                                        <p className="text-[9px] text-white/90 font-medium opacity-80 mt-1">Register new ID</p>
                                    </div>
                                </motion.button>
                            </div>
                        )}

                        {pendingRequest && (
                            <div className="w-full bg-yellow-50 border border-yellow-200 p-4 rounded-2xl flex items-center gap-3 mb-6 shadow-sm">
                                <div className="bg-yellow-100 p-2 rounded-full text-yellow-600 animate-pulse">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-[#1F2E4A]">Verification Pending</p>
                                    <p className="text-[10px] text-gray-500">Processing phone: {pendingRequest.requestedPhone}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Please wait for Admin approval.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Quests Section */}
                <div className="mt-8 mb-4">
                    <h3 className="text-lg font-black text-[#1F2E4A] mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500 fill-current" />
                        Active Quests
                    </h3>
                    <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                        <p className="text-gray-400 text-sm font-bold">No active quests available.</p>
                        <p className="text-gray-300 text-xs mt-1">Check back later at 12:00 PM</p>
                    </div>
                </div>
            </div>

            {/* Link Account Modal */}
            <AnimatePresence>
                {showLinkModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 h-screen"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl"
                        >
                            <h3 className="text-xl font-black text-[#1F2E4A] mb-2">Claim Your Data</h3>
                            <p className="text-gray-500 text-xs mb-6">Request admin approval to verify ownership of this phone number.</p>

                            <form onSubmit={handleLinkAccount}>
                                <div className="mb-4">
                                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider ml-1 mb-1 block">Phone Number</label>
                                    <input
                                        type="tel"
                                        placeholder="08X-XXX-XXXX"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-[#1F2E4A] font-bold outline-none focus:border-blue-500 transition-colors"
                                        value={phoneInput}
                                        onChange={(e) => setPhoneInput(e.target.value)}
                                    />
                                </div>

                                {linkError && (
                                    <div className="bg-red-50 text-red-500 text-xs p-3 rounded-xl mb-4 flex items-center gap-2 font-bold">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        {linkError}
                                    </div>
                                )}
                                {linkSuccess && (
                                    <div className="bg-green-50 text-green-500 text-xs p-3 rounded-xl mb-4 flex items-center gap-2 font-bold">
                                        <Zap className="w-4 h-4 shrink-0 fill-current" />
                                        {linkSuccess}
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowLinkModal(false)}
                                        className="flex-1 py-3 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        disabled={isLinking || !!linkSuccess}
                                        className="flex-1 py-3 rounded-xl font-bold text-white bg-[#4A90E2] hover:bg-[#357ABD] shadow-lg shadow-blue-200 transition-all disabled:opacity-70"
                                    >
                                        {isLinking ? 'Checking...' : 'Send Request'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Avatar Selector Modal Force */}
            <AnimatePresence>
                {userData && !userData.avatarId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-6 h-screen"
                    >
                        <AvatarSelector userRank={rank} onSelect={() => { }} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
