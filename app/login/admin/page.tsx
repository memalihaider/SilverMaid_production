'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ArrowLeft, Building2, Shield, Lock, Mail, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import { validateCredentials, storeSession } from '@/lib/auth';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const authResponse = await validateCredentials('admin', email, password);
      
      if (authResponse.success && authResponse.session) {
        storeSession(authResponse.session);
        router.push('/admin/dashboard');
      } else {
        setError(authResponse.message || 'Verification failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An unexpected system error occurred');
    }
    
    setIsLoading(false);
  };

  const fillDemoCredentials = () => {
    setEmail('admin@silvermaid.ae');
    setPassword('Demo@123');
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-800/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-900/30 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Navigation */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-all mb-8 group"
        >
          <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg group-hover:border-zinc-700">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Portal Registry</span>
        </Link>

        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-6 relative">
             <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full scale-150 animate-pulse"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-zinc-800 to-black border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl rotate-3">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">
            ADMIN SYSTEM
          </h1>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/80 border border-zinc-800/50 rounded-full">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Restricted Access</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#0f0f0f]/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-1">Administrative Login</h2>
            <p className="text-zinc-500 text-sm">Authorized personnel only</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-100 px-4 py-3 rounded-2xl mb-6 text-[11px] font-bold flex items-center gap-3">
              <div className="w-1.5 h-4 bg-red-500 rounded-full"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Terminal ID (Email)</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-zinc-600 group-focus-within/input:text-white transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl text-white placeholder-zinc-700 focus:outline-none focus:border-white/20 focus:bg-zinc-900 transition-all text-sm font-medium"
                  placeholder="admin@silvermaid.ae"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Universal Key</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-zinc-600 group-focus-within/input:text-white transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl text-white placeholder-zinc-700 focus:outline-none focus:border-white/20 focus:bg-zinc-900 transition-all text-sm font-medium"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-xl shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed group/btn relative overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Access Dashboard
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Quick Access */}
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-4">
               <button 
                onClick={fillDemoCredentials}
                className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all group/demo"
               >
                 <div className="flex flex-col items-start translate-x-0 group-hover/demo:translate-x-1 transition-transform">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Testing Mode</span>
                    <span className="text-xs text-white">Load demo credentials</span>
                 </div>
                 <Sparkles className="w-5 h-5 text-zinc-600 group-hover/demo:text-white transition-colors" />
               </button>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">
            SYSTEM CLASSIFIED ▪ LEVEL 1 SECURE
          </p>
        </div>
      </div>
    </div>
  );
}

