'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, User, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import Link from 'next/link';

export default function HomePage() {
  const { user, signInWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (user?.uid) {
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
        router.push('/dashboard');
      } else {
        if (!displayName) throw new Error("Please enter a Display Name");
        await registerWithEmail(email, password, displayName);
        // Registration success handles redirection or state update in context usually
        // But for safety:
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setErrorMsg('');
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-blue-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">

        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-xl shadow-indigo-500/20 mb-4">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Up Level Guild
          </h1>
          <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">
            The Ultimate Pokemon TCG Community
          </p>
        </div>

        {/* Auth Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl"
        >
          {user ? (
            // Logged In State
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-indigo-500 shadow-lg">
                {userData?.photoURL || user.photoURL ? (
                  <img src={userData?.photoURL || user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Welcome, {userData?.displayName || user.displayName || 'Hunter'}!</h2>
                <p className="text-indigo-400 text-sm font-semibold mt-1">{userData?.rank || 'Rookie'} • {userData?.exp || 0} EXP</p>
              </div>

              <button
                onClick={() => router.push('/dashboard')}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group"
              >
                Enter Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="pt-4 border-t border-slate-700/50 grid grid-cols-2 gap-4">
                <Link href="/gymbattle.html" target="_blank" className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-300 transition-colors">
                  ⚔️ Gym Battle
                </Link>
                <Link href="/gymstanding.html" target="_blank" className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-300 transition-colors">
                  🏆 Standings
                </Link>
              </div>
            </div>
          ) : (
            // Guest / Login State
            <div className="space-y-6">
              {/* Toggle */}
              <div className="flex bg-slate-900/50 p-1 rounded-xl">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  Log In
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  Sign Up
                </button>
              </div>

              {/* Google Login */}
              <button
                onClick={handleGoogle}
                type="button"
                className="w-full py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl flex items-center justify-center gap-3 transition-colors"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                Continue with Google
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-700"></span></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-800/50 px-2 text-slate-500">Or continue with email</span></div>
              </div>

              {/* Form */}
              <form onSubmit={handleAuth} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 ml-1">Display Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                      <input
                        type="text" required={!isLogin}
                        value={displayName} onChange={e => setDisplayName(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600"
                        placeholder="Trainer Name"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                    <input
                      type="email" required
                      value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                    <input
                      type="password" required
                      value={password} onChange={e => setPassword(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
