'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gamepad2, ArrowRight, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { user, loading, signInWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user && !loading) router.push('/dashboard');
  }, [user, loading, router]);

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
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 relative overflow-hidden font-poppins">

      {/* Background FX */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-[#0f172a] to-[#0f172a]" />
      <div className="absolute top-20 left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-[80px] animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-blue-500/20 rounded-full blur-[100px]"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-[#1e293b]/90 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden relative z-10"
      >
        <div className="p-8 pb-4 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/40 mb-4 transform rotate-3">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Guild Member</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to sync your data</p>
        </div>

        {/* Social Buttons */}
        <div className="px-8 space-y-3">
          <button
            onClick={handleGoogle}
            className="w-full py-3 bg-white hover:bg-gray-50 text-slate-900 font-bold rounded-xl flex items-center justify-center gap-3 transition-all shadow-md group"
          >
            <span className="text-blue-600 font-black text-lg">G</span> Continue with Google
          </button>
        </div>

        <div className="relative flex py-6 items-center px-8">
          <div className="flex-grow border-t border-slate-700/50"></div>
          <span className="flex-shrink-0 mx-4 text-slate-500 text-[10px] tracking-widest uppercase">Or email</span>
          <div className="flex-grow border-t border-slate-700/50"></div>
        </div>

        {/* Email Form */}
        <div className="px-8 pb-8">
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
    </div>
  );
}
