'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gamepad2, ArrowRight, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function LoginPage() {
  const { user, loading, signInWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      });
      return () => unsub();
    }
  }, [user]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        if (!displayName) throw new Error("Please enter your Display Name");
        await registerWithEmail(email, password, displayName);
      }
    } catch (err: any) {
      let msg = err.message;
      if (msg.includes("auth/user-not-found")) msg = "User not found";
      if (msg.includes("auth/wrong-password")) msg = "Incorrect password";
      if (msg.includes("auth/email-already-in-use")) msg = "Email already in use";
      if (msg.includes("auth/weak-password")) msg = "Password should be at least 6 characters";
      setErrorMsg(msg);
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setErrorMsg('');
      await signInWithGoogle();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-start p-6 pt-16 relative overflow-visible font-poppins pb-32">

      {/* Background FX */}
      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-[#0f172a] to-[#0f172a] pointer-events-none" />
      <div className="fixed top-20 left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-[80px] animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-20 right-10 w-60 h-60 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header / Top Bar */}
      <div className="w-full max-w-md flex justify-between items-center mb-8 relative z-20">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/40">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white leading-tight">Up Level</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Guild Hub</p>
          </div>
        </div>

        {/* User Avatar / Profile Link */}
        {user ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 bg-[#1e293b] border border-slate-700 p-1 pr-3 rounded-full hover:border-slate-500 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden relative">
              {userData?.photoURL || user.photoURL ? (
                <img src={userData?.photoURL || user.photoURL} className="w-full h-full object-cover" alt="Avatar" />
              ) : (
                <User className="w-4 h-4 m-auto text-slate-400 absolute inset-0" />
              )}
            </div>
            <span className="text-xs font-bold text-slate-200 max-w-[80px] truncate">{user.displayName || 'Member'}</span>
          </motion.button>
        ) : (
          <button onClick={() => document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs font-bold text-blue-400 hover:text-blue-300">
            Login
          </button>
        )}
      </div>

      {/* --- PUBLIC EVENT HUB --- */}
      <h2 className="text-lg font-bold text-white mb-4 w-full max-w-md flex items-center gap-2 relative z-20">
        <span className="text-2xl">🌍</span> Explore Events
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-3 w-full max-w-md relative z-10 mb-8"
      >
        <a href="/mega-starter-preorder.html" className="p-4 bg-[#1e293b]/80 backdrop-blur-xl border border-white/5 rounded-2xl hover:bg-green-500/10 hover:border-green-500/50 transition-all group text-center flex flex-col items-center justify-center gap-2 h-32 cursor-pointer shadow-lg hover:shadow-green-500/20">
          <div className="text-4xl mb-1 group-hover:scale-110 transition-transform drop-shadow-md">🌿</div>
          <div>
            <div className="text-xs font-bold text-green-400 group-hover:text-green-300">Mega Starter</div>
            <div className="text-[9px] text-slate-500 mt-1">Pre-order Now</div>
          </div>
        </a>

        <a href="/gymbattle.html" className="p-4 bg-[#1e293b]/80 backdrop-blur-xl border border-white/5 rounded-2xl hover:bg-blue-500/10 hover:border-blue-500/50 transition-all group text-center flex flex-col items-center justify-center gap-2 h-32 cursor-pointer shadow-lg hover:shadow-blue-500/20">
          <div className="text-4xl mb-1 group-hover:scale-110 transition-transform drop-shadow-md">⚔️</div>
          <div>
            <div className="text-xs font-bold text-blue-400 group-hover:text-blue-300">Gym Battle</div>
            <div className="text-[9px] text-slate-500 mt-1">Challenge Leaders</div>
          </div>
        </a>

        <a href="/gymstanding.html" className="p-4 bg-[#1e293b]/80 backdrop-blur-xl border border-white/5 rounded-2xl hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all group text-center flex flex-col items-center justify-center gap-2 h-32 cursor-pointer shadow-lg hover:shadow-cyan-500/20">
          <div className="text-4xl mb-1 group-hover:scale-110 transition-transform drop-shadow-md">🏆</div>
          <div>
            <div className="text-xs font-bold text-cyan-400 group-hover:text-cyan-300">Gym Standings</div>
            <div className="text-[9px] text-slate-500 mt-1">Check Rankings</div>
          </div>
        </a>

        <a href="/pairing.html" className="p-4 bg-[#1e293b]/80 backdrop-blur-xl border border-white/5 rounded-2xl hover:bg-green-500/10 hover:border-green-500/50 transition-all group text-center flex flex-col items-center justify-center gap-2 h-32 cursor-pointer shadow-lg hover:shadow-green-500/20">
          <div className="text-4xl mb-1 group-hover:scale-110 transition-transform drop-shadow-md">🤝</div>
          <div>
            <div className="text-xs font-bold text-green-400 group-hover:text-green-300">Pairings</div>
            <div className="text-[9px] text-slate-500 mt-1">Tournament Tables</div>
          </div>
        </a>

        <a href="/lorcana-pack-rush.html" className="p-4 bg-[#1e293b]/80 backdrop-blur-xl border border-white/5 rounded-2xl hover:bg-yellow-500/10 hover:border-yellow-500/50 transition-all group text-center flex flex-col items-center justify-center gap-2 h-32 cursor-pointer shadow-lg hover:shadow-yellow-500/20">
          <div className="text-4xl mb-1 group-hover:scale-110 transition-transform drop-shadow-md">✨</div>
          <div>
            <div className="text-xs font-bold text-yellow-400 group-hover:text-yellow-300">Lorcana</div>
            <div className="text-[9px] text-slate-500 mt-1">Pack Rush Event</div>
          </div>
        </a>

        <a href="/legacy_index.html" className="p-4 bg-[#1e293b]/50 backdrop-blur-xl border border-white/5 rounded-2xl hover:bg-slate-700/50 transition-all group text-center flex flex-col items-center justify-center gap-2 h-32 cursor-pointer">
          <div className="text-2xl mb-1 group-hover:scale-110 transition-transform text-slate-500">📂</div>
          <div>
            <div className="text-xs font-bold text-slate-400 group-hover:text-white">All Events</div>
            <div className="text-[9px] text-slate-600 mt-1">View Legacy List</div>
          </div>
        </a>
      </motion.div>


      {/* --- LOGIN SECTION --- */}
      {/* Only show if NOT logged in */}
      {!user ? (
        <motion.div
          id="login-section"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-[#1e293b]/90 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden relative z-10"
        >
          <div className="p-6 text-center border-b border-white/5">
            <h2 className="text-lg font-bold text-white tracking-tight">Access Guild Member</h2>
            <p className="text-slate-400 text-xs mt-1">Sign in to check your EXP & Rank</p>
          </div>

          <div className="p-6">
            <button
              onClick={handleGoogle}
              className="w-full py-3 bg-white hover:bg-gray-50 text-slate-900 font-bold rounded-xl flex items-center justify-center gap-3 transition-all shadow-md group mb-6"
            >
              <span className="text-blue-600 font-black text-lg">G</span> Continue with Google
            </button>

            <div className="relative flex py-2 items-center mb-6">
              <div className="flex-grow border-t border-slate-700/50"></div>
              <span className="flex-shrink-0 mx-4 text-slate-500 text-[10px] tracking-widest uppercase">Or email</span>
              <div className="flex-grow border-t border-slate-700/50"></div>
            </div>

            <div className="flex bg-[#0f172a]/50 p-1 rounded-xl mb-4">
              <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${isLogin ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-white'}`}>LOGIN</button>
              <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!isLogin ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-white'}`}>REGISTER</button>
            </div>

            <form onSubmit={handleAuth} className="space-y-3">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-slate-500 w-4 h-4" />
                  <input
                    type="text" placeholder="Display Name" required={!isLogin}
                    value={displayName} onChange={e => setDisplayName(e.target.value)}
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-blue-500 outline-none"
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-500 w-4 h-4" />
                <input
                  type="email" placeholder="Email Address" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-blue-500 outline-none"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-slate-500 w-4 h-4" />
                <input
                  type="password" placeholder="Password" required
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-blue-500 outline-none"
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-[10px] text-red-300">
                  <AlertCircle className="w-3 h-3 shrink-0 py-0.5" /> {errorMsg}
                </div>
              )}

              <button disabled={isLoading} className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] mt-2">
                {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>
          </div>
        </motion.div>
      ) : (
        <div className="w-full max-w-md bg-[#1e293b]/50 backdrop-blur border border-white/5 rounded-3xl p-6 text-center">
          <p className="text-slate-400 text-sm">Welcome back!</p>
          <h3 className="text-xl font-bold text-white mt-1">{user.displayName}</h3>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <User className="w-5 h-5" /> Go to My Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
