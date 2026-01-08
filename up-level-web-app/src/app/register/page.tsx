'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, CheckCircle2, Loader2, ArrowRight, ShieldCheck, Gamepad2, Calendar, CreditCard, Upload } from 'lucide-react';
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

const CARD_GAMES = [
    'Pokemon TCG', 'One Piece', 'Disney Lorcana', 'Magic: The Gathering',
    'Flesh and Blood', 'Union Arena', 'Battle Spirits', 'Digimon', 'Board Games'
];

export default function RegisterPage() {
    const { user, signInWithGoogle } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1); // 1=Form, 2=Payment, 3=Success
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        thaiName: '',
        nickname: '',
        phone: '',
        lineId: '',
        birthDate: '',
        interests: [] as string[]
    });
    const [slipImage, setSlipImage] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error("Login Failed", error);
        }
    };

    const toggleInterest = (game: string) => {
        if (form.interests.includes(game)) {
            setForm({ ...form, interests: form.interests.filter(i => i !== game) });
        } else {
            setForm({ ...form, interests: [...form.interests, game] });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Resize & Convert to Base64
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Max size 800px to keep Firestore happy
                const MAX_SIZE = 800;
                if (width > height) {
                    if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
                } else {
                    if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                setSlipImage(canvas.toDataURL('image/jpeg', 0.7)); // Compress to 70% quality
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const validateStep1 = () => {
        if (!form.firstName.trim() || !form.lastName.trim()) return "English Full Name is required";
        if (!form.thaiName.trim()) return "Thai Full Name is required";
        if (!form.nickname.trim()) return "Nickname is required (for Badge)";
        if (!form.phone.trim() || form.phone.length < 9) return "Valid phone number is required";
        if (!form.birthDate) return "Birthday is required";
        return null;
    };

    const goToPayment = async () => {
        const error = validateStep1();
        if (error) { alert(error); return; }

        // Check duplicate phone ONLY before moving to payment
        setLoading(true);
        try {
            const phoneQuery = query(collection(db, 'users'), where('phone', '==', form.phone));
            const existingPhone = await getDocs(phoneQuery);
            if (!existingPhone.empty) {
                alert("This phone number is already registered!");
                setLoading(false);
                return;
            }
            setLoading(false);
            setStep(2);
        } catch (e) {
            console.error(e);
            setLoading(false);
            alert("Error checking phone number");
        }
    };

    const handleSubmit = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Create User Application (Status: Pending)
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: `${form.firstName} ${form.lastName}`,
                firstName: form.firstName,
                lastName: form.lastName,
                thaiName: form.thaiName,
                nickname: form.nickname,
                codename: form.nickname,
                phone: form.phone,
                lineId: form.lineId,
                birthDate: form.birthDate,
                interests: form.interests,
                slipImage: slipImage || null,

                // Game Stats (Initial)
                rank: 'Rookie',
                exp: 0,
                level: 1,
                party: 'Novice',

                // System Status
                status: 'pending_payment',
                paymentStatus: 'pending_verification',
                role: 'member',
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp()
            });

            setStep(3); // Success Screen
        } catch (e: any) {
            console.error(e);
            alert("Registration failed: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAutoVerify = async () => {
        if (!slipImage || !user) return;
        setIsVerifying(true);
        setLoading(true);
        try {
            // 1. Save Data First (Same as handleSubmit logic to ensure ID exists)
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: `${form.firstName} ${form.lastName}`,
                firstName: form.firstName,
                lastName: form.lastName,
                thaiName: form.thaiName,
                nickname: form.nickname,
                codename: form.nickname,
                phone: form.phone,
                lineId: form.lineId,
                birthDate: form.birthDate,
                interests: form.interests,
                slipImage: slipImage,

                // Game Stats (Initial)
                rank: 'Rookie',
                exp: 0,
                level: 1,
                party: 'Novice',

                // System Status
                status: 'pending_payment',
                paymentStatus: 'pending_verification',
                role: 'member',
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp()
            });

            // 2. Call Verify API
            const res = await fetch('/api/verify-slip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slipImage, userId: user.uid, amount: 50 })
            });
            const data = await res.json();

            if (data.success) {
                alert("✅ Payment Verified! Welcome to Up Level Guild.");
                window.location.href = '/dashboard';
            } else {
                alert("⚠️ Auto-Verification Failed: " + (data.error || "Unknown error") + "\n\nWe submitted your application for Manual Review instead.");
                setStep(3); // Go to manual success screen
            }

        } catch (e: any) {
            console.error(e);
            alert("Verification Error: " + e.message);
        } finally {
            setIsVerifying(false);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1014] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse delay-1000" />
            </div>

            <div className="max-w-xl w-full relative z-10 my-10">
                {/* Header with Benefits */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent uppercase tracking-tight">
                        Up Level Guild
                    </h1>
                    <p className="text-slate-400 font-medium mb-6">Become a Member • Unlock Privileges</p>

                    {/* Benefits Banner */}
                    <div className="bg-gradient-to-br from-[#1a1b23] to-[#131419] border border-slate-700 rounded-2xl p-4 shadow-xl text-left transform rotate-1 hover:rotate-0 transition-all duration-300">
                        <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" /> Member Privileges
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                            <div className="flex items-center gap-2"><span className="text-yellow-500">★</span> Lifetime Membership (50 THB)</div>
                            <div className="flex items-center gap-2"><span className="text-yellow-500">★</span> Special Member Pricing</div>
                            <div className="flex items-center gap-2"><span className="text-yellow-500">★</span> Earn EXP & Rank Up</div>
                            <div className="flex items-center gap-2"><span className="text-yellow-500">★</span> Exclusive Tournament Access</div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1a1b23] border border-slate-700/50 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl">
                    {/* Step 1: Login */}
                    {!user && (
                        <div className="space-y-8 py-8 animate-in fade-in slide-in-from-bottom-4">
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-bold">Sign In to Apply</h2>
                                <p className="text-sm text-slate-400">Secure your progress with Google Account.</p>
                            </div>
                            <button
                                onClick={handleGoogleLogin}
                                className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-200 transition-all active:scale-95 shadow-lg shadow-white/10"
                            >
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                                Continue with Google
                            </button>
                        </div>
                    )}

                    {/* Step 1: Personal Info Form */}
                    {user && step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold flex items-center gap-2"><User className="w-5 h-5 text-indigo-400" /> Personal Info</h2>
                                <span className="text-xs font-bold bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded">Step 1/2</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-1 block">First Name (Eng)</label>
                                    <input type="text" placeholder="John"
                                        className="w-full bg-[#0f1014] border border-slate-700 rounded-xl p-3 outline-none focus:border-indigo-500 transition-colors"
                                        value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-1 block">Last Name (Eng)</label>
                                    <input type="text" placeholder="Doe"
                                        className="w-full bg-[#0f1014] border border-slate-700 rounded-xl p-3 outline-none focus:border-indigo-500 transition-colors"
                                        value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-1 block">Full Name (Thai) *Important</label>
                                <input type="text" placeholder="ชื่อ-นามสกุล ภาษาไทย"
                                    className="w-full bg-[#0f1014] border border-slate-700 rounded-xl p-3 outline-none focus:border-indigo-500 transition-colors"
                                    value={form.thaiName} onChange={e => setForm({ ...form, thaiName: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-1 block">Nickname</label>
                                    <input type="text" placeholder="ProGamer"
                                        className="w-full bg-[#0f1014] border border-slate-700 rounded-xl p-3 outline-none focus:border-indigo-500 transition-colors"
                                        value={form.nickname} onChange={e => setForm({ ...form, nickname: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-1 block">Birthday (D/M)</label>
                                    <input type="text" placeholder="25/12"
                                        className="w-full bg-[#0f1014] border border-slate-700 rounded-xl p-3 outline-none focus:border-indigo-500 transition-colors"
                                        value={form.birthDate} onChange={e => setForm({ ...form, birthDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-1 block">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                                        <input type="tel" placeholder="0812345678"
                                            className="w-full bg-[#0f1014] border border-slate-700 rounded-xl p-3 pl-10 outline-none focus:border-indigo-500 transition-colors font-mono"
                                            value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-1 block">Line ID</label>
                                    <input type="text" placeholder="@lineid"
                                        className="w-full bg-[#0f1014] border border-slate-700 rounded-xl p-3 outline-none focus:border-indigo-500 transition-colors"
                                        value={form.lineId} onChange={e => setForm({ ...form, lineId: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-2 block">Interested In</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {CARD_GAMES.map(game => (
                                        <button key={game}
                                            onClick={() => toggleInterest(game)}
                                            className={`text-xs p-2 rounded-lg border text-left transition-all ${form.interests.includes(game) ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-[#0f1014] border-slate-700 text-slate-400 hover:border-slate-500'}`}
                                        >
                                            {game}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={goToPayment}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all active:scale-95 flex items-center justify-center gap-2 mt-6"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <>Payment Step <ArrowRight className="w-5 h-5" /></>}
                            </button>
                        </div>
                    )}

                    {/* Step 2: Payment */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold flex items-center gap-2"><CreditCard className="w-5 h-5 text-indigo-400" /> Payment</h2>
                                <span className="text-xs font-bold bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded">Step 2/2</span>
                            </div>

                            <div className="bg-white p-4 rounded-2xl flex flex-col items-center">
                                <div className="bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full mb-3">50.00 THB</div>
                                <img src="/payment-qr.png" alt="Payment QR" className="w-48 h-auto rounded-lg shadow-inner border" />
                                <p className="text-slate-500 text-xs font-bold mt-2">Scan to Pay (SCB: Chawanut C.)</p>
                            </div>

                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-sm md:text-xs">
                                <div className="font-bold text-white mb-2 flex items-center gap-2">
                                    <Upload className="w-4 h-4" />
                                    {slipImage ? "Slip Attached" : "Upload Transfer Slip"}
                                </div>

                                {!slipImage ? (
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-800 hover:bg-slate-700 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 mb-2 text-slate-400" />
                                            <p className="text-xs text-slate-400">Click to upload slip image</p>
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </label>
                                ) : (
                                    <div className="relative w-full h-48 bg-black rounded-lg overflow-hidden border border-slate-600">
                                        <img src={slipImage} className="w-full h-full object-contain" />
                                        <button onClick={() => setSlipImage(null)} className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow-lg">
                                            <ArrowRight className="w-4 h-4 rotate-45" /> {/* X icon hack */}
                                        </button>
                                    </div>
                                )}
                                <p className="text-slate-500 mt-2 text-center text-[10px]">Image will be resized automatically.</p>
                            </div>

                            <div className="flex gap-3 flex-col md:flex-row">
                                <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl font-bold text-slate-400 bg-slate-800 hover:bg-slate-700 transition-colors">
                                    Back
                                </button>

                                {/* Manual Submit */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || isVerifying}
                                    className="flex-1 bg-slate-700 text-slate-300 font-bold py-3 rounded-xl hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
                                >
                                    {loading && !isVerifying ? <Loader2 className="animate-spin" /> : "Submit for Manual Check"}
                                </button>

                                {/* Auto Check (Highlight) */}
                                <button
                                    onClick={handleAutoVerify}
                                    disabled={loading || isVerifying || !slipImage}
                                    className="flex-[2] bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-600/20 hover:shadow-green-600/40 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isVerifying ? <Loader2 className="animate-spin" /> : <>Check Slip & Join Now <CheckCircle2 className="w-5 h-5" /></>}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Success */}
                    {step === 3 && (
                        <div className="text-center space-y-6 animate-in zoom-in-95 duration-300 py-4">
                            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-500/10">
                                <CheckCircle2 className="w-12 h-12 text-green-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black text-white">Welcome, {form.nickname}!</h2>
                                <p className="text-slate-400 text-sm px-4">
                                    Your application has been received.<br />
                                    <span className="text-indigo-400 font-bold">Status: Pending Verification</span>
                                </p>
                            </div>

                            <div className="bg-[#0f1014] p-6 rounded-2xl text-left space-y-3 border border-slate-800 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-10"><Gamepad2 className="w-24 h-24" /></div>
                                <div className="text-xs text-slate-500 uppercase font-black tracking-widest">WHAT'S NEXT</div>
                                <ul className="space-y-3">
                                    <li className="flex gap-3 text-sm text-slate-300">
                                        <span className="bg-slate-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">1</span>
                                        Admin verifies your payment
                                    </li>
                                    <li className="flex gap-3 text-sm text-slate-300">
                                        <span className="bg-slate-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">2</span>
                                        Your rank is updated to "Rookie"
                                    </li>
                                    <li className="flex gap-3 text-sm text-slate-300">
                                        <span className="bg-slate-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">3</span>
                                        Start earning EXP!
                                    </li>
                                </ul>
                            </div>

                            <button onClick={() => router.push('/')} className="text-slate-400 hover:text-white text-sm font-bold flex items-center justify-center gap-2 mx-auto mt-4 px-4 py-2 hover:bg-white/5 rounded-lg transition-all">
                                <ArrowRight className="w-4 h-4 rotate-180" /> Back to Home
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
