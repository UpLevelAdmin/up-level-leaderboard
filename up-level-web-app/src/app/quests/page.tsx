'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollText, CheckCircle2, Gift, Loader2, Send, X, FileText } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

export default function Quests() {
    const { user } = useAuth();
    const [quests, setQuests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);

    // Submission State
    const [selectedQuest, setSelectedQuest] = useState<any>(null);
    const [proofText, setProofText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // 1. Fetch User Data
    useEffect(() => {
        if (!user) return;
        const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
            if (snap.exists()) setUserData(snap.data());
        });
        return () => unsub();
    }, [user]);

    // 2. Fetch Quests
    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'system_data', 'quests'), (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                const items = (data.items || [])
                    .filter((i: any) => i['Quest'] || i['Title'] || i['Task'] || i['Quest Name']) // Valid Quests Only
                    .map((i: any, idx: number) => ({
                        id: idx,
                        title: i['Quest'] || i['Title'] || i['Task'] || i['Quest Name'] || 'Untitled Quest',
                        description: i['Description'] || i['Desc'] || i['Details'] || '',
                        reward: i['Reward'] || i['Rewards'] || i['Exp'] || '10 EXP',
                        type: i['Type'] || i['Category'] || 'General',
                        icon: i['Icon'] || '📜',
                        target: i['Target'] || 1,
                        status: 'active'
                    }));
                setQuests(items);
            }
            setLoading(false);
        });

        return () => unsub();
    }, []);

    const handleSubmit = async () => {
        if (!selectedQuest || !user) return;
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'quest_submissions'), {
                uid: user.uid,
                userEmail: user.email,
                userName: userData?.displayName || user.displayName,
                questTitle: selectedQuest.title,
                reward: selectedQuest.reward,
                proof: proofText,
                status: 'pending',
                timestamp: serverTimestamp()
            });
            setSubmitStatus('success');
            setTimeout(() => {
                setSelectedQuest(null);
                setSubmitStatus('idle');
                setProofText('');
            }, 2000);
        } catch (e) {
            console.error(e);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] pb-24 font-poppins">
            <div className="bg-[#7AC0E7] p-6 pb-12 rounded-b-[3rem] shadow-lg sticky top-0 z-10">
                <h1 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
                    <ScrollText className="w-6 h-6 fill-current text-blue-100" />
                    QUEST BOARD
                </h1>
                <p className="text-blue-50 text-sm font-bold opacity-80">Complete tasks to earn rewards!</p>
            </div>

            <div className="px-4 -mt-6 space-y-4 relative z-20">
                {loading ? (
                    <div className="flex justify-center pt-10">
                        <Loader2 className="w-8 h-8 animate-spin text-[#7AC0E7]" />
                    </div>
                ) : quests.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                        <ScrollText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No active quests at the moment.</p>
                    </div>
                ) : (
                    quests.map((quest, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white p-5 rounded-2xl shadow-sm border-2 border-gray-100 relative overflow-hidden group hover:border-blue-200 transition-colors"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl border border-blue-100 shrink-0">
                                    {quest.icon}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded mb-1 inline-block uppercase tracking-wider">
                                            {quest.type}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-[#1F2E4A] text-sm mb-1">{quest.title}</h3>
                                    {quest.description && <p className="text-xs text-gray-400 mb-2">{quest.description}</p>}

                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-50 p-2 rounded-lg inline-flex">
                                        <Gift className="w-3 h-3 text-[#FFD700]" />
                                        <span className="text-[#FFD700] text-sm">{quest.reward}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedQuest(quest)}
                                className="w-full py-2 bg-slate-100 font-bold text-slate-500 rounded-xl text-xs hover:bg-[#7AC0E7] hover:text-white transition-colors"
                            >
                                Submit Proof
                            </button>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Submission Modal */}
            <AnimatePresence>
                {selectedQuest && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative overflow-hidden"
                        >
                            {submitStatus === 'success' ? (
                                <div className="flex flex-col items-center py-6 text-center">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-500">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-black text-[#1F2E4A] mb-2">Submission Sent!</h3>
                                    <p className="text-gray-500 text-xs">Admin will review your proof shortly.</p>
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setSelectedQuest(null)}
                                        className="absolute top-4 right-4 text-gray-300 hover:text-gray-600 p-2"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>

                                    <h3 className="text-lg font-black text-[#1F2E4A] mb-1">Submit Quest</h3>
                                    <p className="text-xs text-gray-500 mb-4 font-bold">{selectedQuest.title}</p>

                                    <div className="bg-blue-50 p-3 rounded-xl mb-4 flex items-center gap-3">
                                        <div className="text-2xl">{selectedQuest.icon}</div>
                                        <div>
                                            <div className="text-[10px] text-blue-400 font-bold uppercase">Reward</div>
                                            <div className="text-sm font-bold text-blue-600">{selectedQuest.reward}</div>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Proof / Details</label>
                                        <textarea
                                            value={proofText}
                                            onChange={(e) => setProofText(e.target.value)}
                                            placeholder="Example: I won against Player X at Gym (See attached link)..."
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm min-h-[100px] outline-none focus:border-blue-400 transition-colors resize-none"
                                        />
                                    </div>

                                    <button
                                        disabled={isSubmitting || !proofText.trim()}
                                        onClick={handleSubmit}
                                        className="w-full py-3.5 bg-[#4A90E2] hover:bg-[#357ABD] text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                        Submit for Review
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
