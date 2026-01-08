
'use client';

import { useState } from 'react';
import { Upload, Loader2, CheckCircle2, XCircle, Send, User, MessageSquare, Phone } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function PublicPayPage() {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'upload' | 'info' | 'success'>('upload');
    const [slipData, setSlipData] = useState<any>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', note: '' });
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setError(null);

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new window.Image();
            img.onload = async () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const MAX_SIZE = 1000;
                if (width > height) {
                    if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
                } else {
                    if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                const resizedBase64 = canvas.toDataURL('image/jpeg', 0.8);
                setImagePreview(resizedBase64);

                try {
                    const res = await fetch('/api/verify-slip', {
                        method: 'POST',
                        body: JSON.stringify({ slipImage: resizedBase64, userId: 'PUBLIC_PAY', amount: 0 }),
                        headers: { 'Content-Type': 'application/json' }
                    });
                    const result = await res.json();

                    if (result.success) {
                        setSlipData(result.data);
                        setStep('info');
                    } else {
                        setError(result.error || "ตรวจสอบสลิปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
                    }
                } catch (err) {
                    setError("เกิดข้อผิดพลาดในการเชื่อมต่อระบบตรวจสอบ");
                } finally {
                    setLoading(false);
                }
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        if (!customerInfo.name) {
            alert("กรุณากรอกชื่อผู้แจ้งครับ");
            return;
        }

        setLoading(true);
        try {
            const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxtjsDwHI6nJU4OIHExUxMaZwUn3qwakvdkzwbQO7C8Trzz5Gh84SX6F1gqb4BOFQcn/exec";
            const API_SECRET = "up-level-secret-key-1234";

            // 🚀 1. ส่งรูปจริงไปเก็บที่ Google Drive
            await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'save_slip_to_drive',
                    secret: API_SECRET,
                    slipImage: imagePreview,
                    customerName: customerInfo.name,
                    phone: customerInfo.phone,
                    amount: slipData.amount,
                    transRef: slipData.transRef,
                    note: customerInfo.note
                })
            });

            // 🚀 2. สร้าง Thumbnail
            const thumbCanvas = document.createElement('canvas');
            const thumbImg = new window.Image();
            await new Promise((resolve) => {
                thumbImg.onload = resolve;
                thumbImg.src = imagePreview || '';
            });
            const size = 150;
            thumbCanvas.width = size;
            thumbCanvas.height = (thumbImg.height / thumbImg.width) * size;
            thumbCanvas.getContext('2d')?.drawImage(thumbImg, 0, 0, thumbCanvas.width, thumbCanvas.height);
            const thumbnail = thumbCanvas.toDataURL('image/jpeg', 0.5);

            // 🚀 3. บันทึกลง Firestore
            await addDoc(collection(db, 'public_payments'), {
                customerName: customerInfo.name,
                phoneNumber: customerInfo.phone,
                note: customerInfo.note,
                amount: slipData.amount,
                transRef: slipData.transRef,
                transTimestamp: slipData.transTimestamp,
                sender: slipData.sender,
                slipImage: thumbnail,
                driveStatus: "Saved to Google Drive Folder: UpLevel_PaymentSlips",
                status: 'pending_admin',
                verifiedAt: serverTimestamp(),
            });

            setStep('success');
        } catch (err) {
            console.error(err);
            alert("ไม่สามารถบันทึกข้อมูลได้ กรุณาแจ้งพนักงาน");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1014] text-white p-6 font-sans flex flex-col items-center justify-center">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-indigo-400 mb-2">UP LEVEL PAY</h1>
                    <p className="text-slate-400 text-sm italic">ระบบแจ้งโอนเงินอัตโนมัติ ⚡</p>
                </div>

                {step === 'upload' && (
                    <div className="bg-[#15151a] border border-slate-700/50 rounded-3xl p-8 shadow-2xl text-center">
                        <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Upload className="w-10 h-10 text-indigo-400" />
                        </div>
                        <h2 className="text-xl font-bold mb-4">แจ้งโอนเงิน</h2>
                        <p className="text-slate-400 text-xs mb-8">กรุณาแนบสลิปเพื่อตรวจสอบข้อมูล</p>

                        <label className="block w-full cursor-pointer group">
                            <div className="bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-900/40 active:scale-95 flex items-center justify-center gap-2">
                                {loading ? <Loader2 className="animate-spin" /> : <><Upload className="w-5 h-5" /> เลือกรูปสลิป</>}
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={loading} />
                        </label>

                        {error && (
                            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                                <XCircle className="w-4 h-4 shrink-0" /> {error}
                            </div>
                        )}
                    </div>
                )}

                {step === 'info' && (
                    <div className="bg-[#15151a] border border-slate-700/50 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-4">
                        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl mb-6 flex items-center gap-4">
                            <CheckCircle2 className="text-green-400 w-10 h-10" />
                            <div>
                                <div className="text-green-400 font-bold uppercase text-[10px]">ตรวจสอบสลิปผ่านแล้ว</div>
                                <div className="text-xl font-black">฿{slipData.amount.toLocaleString()}</div>
                                <div className="text-[10px] text-slate-500">คุณ{slipData.sender.displayName}</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 flex items-center gap-1">
                                    <User className="w-3 h-3" /> ชื่อผู้แจ้ง (Nickname)
                                </label>
                                <input
                                    type="text"
                                    value={customerInfo.name}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                    className="w-full bg-[#0f1014] border border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all font-bold"
                                    placeholder="เช่น แชมป์"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 flex items-center gap-1">
                                    <Phone className="w-3 h-3" /> เบอร์โทรศัพท์ (เพื่อใช้เช็คสถานะ)
                                </label>
                                <input
                                    type="tel"
                                    maxLength={10}
                                    value={customerInfo.phone}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value.replace(/[^\d]/g, '') })}
                                    className="w-full bg-[#0f1014] border border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all font-mono"
                                    placeholder="08XXXXXXXX"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 flex items-center gap-1">
                                    <MessageSquare className="w-3 h-3" /> หมายเหตุ (เช่น ค่าแข่ง, ค่าการ์ด)
                                </label>
                                <textarea
                                    value={customerInfo.note}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, note: e.target.value })}
                                    className="w-full bg-[#0f1014] border border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all h-20"
                                    placeholder="ระบุเพิ่มเติม..."
                                />
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full bg-white text-black font-bold py-4 rounded-2xl shadow-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 mt-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <><Send className="w-5 h-5" /> ยืนยันข้อมูล</>}
                            </button>
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <div className="bg-[#15151a] border border-slate-700/50 rounded-3xl p-10 shadow-2xl text-center animate-in zoom-in">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-400" />
                        </div>
                        <h2 className="text-2xl font-black mb-2">ได้รับเงินแล้ว!</h2>
                        <p className="text-slate-400 text-sm mb-8">ขอบคุณที่มาใช้บริการครับ 😊<br />แจ้งแอดมินได้เลยว่า "โอนแล้ว"</p>

                        <button
                            onClick={() => window.location.reload()}
                            className="text-slate-500 text-xs underline hover:text-slate-400"
                        >
                            เริ่มรายการใหม่
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
