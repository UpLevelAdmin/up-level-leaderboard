'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Sparkles, Package, Loader2, AlertCircle, CheckCircle2, Wallet, X } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

export default function Shop() {
    const { user } = useAuth();
    const [items, setItems] = useState<any[]>([]);
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Purchase State
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // 1. Fetch User Data (for EXP Balance)
    useEffect(() => {
        if (!user) return;
        const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
            if (snap.exists()) setUserData(snap.data());
        });
        return () => unsub();
    }, [user]);

    // 2. Fetch Shop Items
    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'system_data', 'shop'), (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                const processed = (data.items || []).map((i: any, idx: number) => ({
                    id: idx,
                    name: i['Item Name'] || i['Name'] || i['Item'] || 'Mystery Item',
                    price: Number((i['Price'] || i['Cost'] || '0').replace(/[^0-9.]/g, '')),
                    currency: (i['Price'] || '').includes('EXP') ? 'EXP' : 'THB',
                    image: i['Image'] || i['Img'] || '🎁',
                    type: i['Type'] || 'General',
                    desc: i['Description'] || i['Desc'] || ''
                }));
                setItems(processed);
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const handleBuy = async () => {
        if (!selectedItem || !user) return;
        setIsProcessing(true);
        try {
            // Create Purchase Request
            await addDoc(collection(db, 'shop_requests'), {
                uid: user.uid,
                userEmail: user.email,
                userName: userData?.displayName || user.displayName,
                userPhone: userData?.phone || '',
                itemName: selectedItem.name,
                price: selectedItem.price,
                currency: selectedItem.currency,
                status: 'pending',
                timestamp: serverTimestamp()
            });
            setPurchaseStatus('success');
            setTimeout(() => {
                setSelectedItem(null);
                setPurchaseStatus('idle');
            }, 2000);
        } catch (e) {
            console.error(e);
            setPurchaseStatus('error');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] pb-24 font-poppins">
            {/* Header */}
            <div className="bg-[#B0F2C2] p-6 pb-12 rounded-b-[3rem] relative overflow-hidden shadow-lg sticky top-0 z-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                <h1 className="text-2xl font-black text-[#1F2E4A] mb-2 flex items-center gap-2 relative z-10">
                    <ShoppingBag className="w-6 h-6 text-green-700" />
                    ITEM SHOP
                </h1>

                {userData && (
                    <div className="bg-white/40 backdrop-blur-md inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[#1F2E4A] text-xs font-bold border border-white/50 relative z-10 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                        <Wallet className="w-3.5 h-3.5" />
                        <span>My Balance: {userData.exp?.toLocaleString() || 0} EXP</span>
                    </div>
                )}
            </div>

            <div className="px-5 -mt-6 relative z-20">
                {loading ? (
                    <div className="flex justify-center pt-10">
                        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                        <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Shop is currently closed.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {items.map((item, idx) => (
                            <motion.button
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => setSelectedItem(item)}
                                className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center relative overflow-hidden group hover:shadow-md transition-shadow text-left w-full"
                            >
                                {/* Sparkle Effect */}
                                <div className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Sparkles className="w-4 h-4 text-yellow-400" />
                                </div>

                                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl mb-3 shadow-inner">
                                    {item.image.includes('http') ? <img src={item.image} className="w-full h-full object-cover rounded-2xl" /> : item.image}
                                </div>

                                <h3 className="font-bold text-[#1F2E4A] text-xs text-center mb-1 line-clamp-2 min-h-[2.5em]">{item.name}</h3>
                                {item.desc && <p className="text-[10px] text-gray-400 text-center mb-2 line-clamp-1">{item.desc}</p>}

                                <div className="mt-auto w-full pt-2">
                                    <div className="w-full py-2.5 bg-[#1F2E4A] text-white text-xs font-bold rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-1 hover:bg-[#2a3b5e]">
                                        {item.currency === 'EXP' ? '🪙' : '฿'} {item.price.toLocaleString()}
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                )}
            </div>

            {/* Purchase Modal */}
            <AnimatePresence>
                {selectedItem && (
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
                            {purchaseStatus === 'success' ? (
                                <div className="flex flex-col items-center py-6 text-center">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-500">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-black text-[#1F2E4A] mb-2">Request Sent!</h3>
                                    <p className="text-gray-500 text-xs">Admin will process your order shortly.</p>
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setSelectedItem(null)}
                                        className="absolute top-4 right-4 text-gray-300 hover:text-gray-600 p-2"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>

                                    <div className="text-center mb-6">
                                        <div className="w-24 h-24 bg-gray-50 rounded-2xl mx-auto flex items-center justify-center text-5xl shadow-inner mb-4 border border-gray-100">
                                            {selectedItem.image.includes('http') ? <img src={selectedItem.image} className="w-full h-full object-cover rounded-2xl" /> : selectedItem.image}
                                        </div>
                                        <h3 className="text-lg font-black text-[#1F2E4A] mb-1">{selectedItem.name}</h3>
                                        <div className="inline-flex items-center gap-1 bg-[#1F2E4A] text-white px-3 py-1 rounded-lg text-xs font-bold">
                                            {selectedItem.currency === 'EXP' ? '🪙' : '฿'} {selectedItem.price.toLocaleString()}
                                        </div>
                                    </div>

                                    {/* Warnings */}
                                    {selectedItem.currency === 'EXP' && userData && userData.exp < selectedItem.price && (
                                        <div className="bg-red-50 text-red-500 text-xs p-3 rounded-xl mb-4 flex items-center gap-2 font-bold">
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                            Not enough EXP! ({userData.exp})
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        <p className="text-center text-[10px] text-gray-400">
                                            By confirming, a purchase request will be sent to the Admin.
                                        </p>
                                        <button
                                            disabled={isProcessing || (selectedItem.currency === 'EXP' && userData?.exp < selectedItem.price)}
                                            onClick={handleBuy}
                                            className="w-full py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-200 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                                        >
                                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingBag className="w-5 h-5" />}
                                            Confirm Purchase
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
