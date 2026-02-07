// 'use client';

// import Link from 'next/link';
// import { 
//   Building2, 
//   UserCog, 
//   ClipboardCheck, 
//   User, 
//   Building, 
//   Eye,
//   ArrowRight,
//   Shield
// } from 'lucide-react';

// const portals = [
//   {
//     id: 'admin',
//     name: 'Admin Portal',
//     description: 'Full system administration and organization management',
//     icon: Building2,
//     color: 'from-blue-500 to-blue-600',
//     href: '/login/admin',
//     iconBg: 'bg-blue-100 dark:bg-blue-900/50',
//     textColor: 'text-blue-600 dark:text-blue-400',
//     borderColor: 'border-blue-500/20 hover:border-blue-500/40',
//     roles: ['Super Admin', 'Admin'],
//     badge: 'Full Access'
//   },
  
// ];

// export default function LoginPortalSelection() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
//       {/* Background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
//         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
//         <div className="absolute top-1/2 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
//       </div>

//       <div className="relative z-10 w-full max-w-7xl">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <div className="flex items-center justify-center gap-3 mb-4">
//             <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
//               <Shield className="w-7 h-7 text-white" />
//             </div>
//             <h1 className="text-4xl md:text-5xl font-bold text-white">
//               Silver Maid
//             </h1>
//           </div>
//           <p className="text-lg text-slate-300 mb-2">
//             Multi-Portal Management System
//           </p>
//           <p className="text-sm text-slate-400">
//             Select your portal to access the system
//           </p>
//         </div>

//         {/* Portal Cards Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 m-auto flex justify-center">
//           {portals.map((portal) => {
//             const Icon = portal.icon;
//             return (
//               <Link
//                 key={portal.id}
//                 href={portal.href}
//                 className={`group relative overflow-hidden m-auto rounded-2xl bg-slate-800/40 justify-center backdrop-blur-xl border ${portal.borderColor} transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]`}
//               >
//                 {/* Gradient overlay on hover */}
//                 <div
//                   className={`absolute inset-0 bg-gradient-to-br ${portal.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
//                 ></div>

//                 <div className="relative p-6">
//                   {/* Header with icon and badge */}
//                   <div className="flex items-start justify-between mb-4">
//                     <div className={`${portal.iconBg} w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
//                       <Icon className={`${portal.textColor} w-7 h-7`} />
//                     </div>
//                     <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${portal.iconBg} ${portal.textColor}`}>
//                       {portal.badge}
//                     </span>
//                   </div>

//                   {/* Content */}
//                   <h3 className="text-xl font-bold text-white mb-2">
//                     {portal.name}
//                   </h3>
//                   <p className="text-slate-400 text-sm mb-4 min-h-[40px]">
//                     {portal.description}
//                   </p>

//                   {/* Roles */}
//                   <div className="flex flex-wrap gap-1.5 mb-4">
//                     {portal.roles.map(role => (
//                       <span 
//                         key={role}
//                         className="text-xs px-2 py-0.5 rounded bg-slate-700/50 text-slate-300"
//                       >
//                         {role}
//                       </span>
//                     ))}
//                   </div>

//                   {/* Arrow indicator */}
//                   <div className="flex items-center text-slate-400 group-hover:text-white transition-colors duration-300">
//                     <span className="text-sm font-semibold">Sign in</span>
//                     <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
//                   </div>
//                 </div>

//                 {/* Bottom gradient line */}
//                 <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${portal.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
//               </Link>
//             );
//           })}
//         </div>

//         {/* Quick Access Info */}
       

//         {/* Footer */}
//         <div className="text-center text-slate-400 text-sm space-y-2">
          
//         </div>
//       </div>
//     </div>
//   );
// }

// new code
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

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-800/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-900/30 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]"></div>
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-white/10 blur-xl rounded-full scale-150 animate-pulse"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-zinc-800 to-black border border-white/10 rounded-[2rem] flex items-center justify-center shadow-2xl">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">
            Silver Maid
          </h1>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-800/50 border border-zinc-700/50 rounded-full">
            <Sparkles className="w-3 h-3 text-zinc-400" />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Management System</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#0f0f0f]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-1">Welcome back</h2>
            <p className="text-zinc-500 text-sm">Please enter your workspace credentials</p>
          </div>

          {/* Success/Error message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl mb-6 text-xs font-bold flex items-center gap-3 animate-shake">
              <div className="w-1 h-4 bg-red-500 rounded-full"></div>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Email Terminal</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-zinc-600 group-focus-within/input:text-white transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-white placeholder-zinc-700 focus:outline-none focus:border-white/20 focus:bg-zinc-900 transition-all text-sm"
                  placeholder="admin@silvermaid.ae"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Access Key</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-zinc-600 group-focus-within/input:text-white transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-white placeholder-zinc-700 focus:outline-none focus:border-white/20 focus:bg-zinc-900 transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl hover:bg-zinc-200 active:scale-95 transition-all shadow-xl shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed group/btn overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Initiate Session
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Quick links */}
          <div className="mt-8 flex items-center justify-between">
            <Link href="/" className="text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors">
              Return Home
            </Link>
            <div className="h-px flex-1 bg-zinc-800 mx-4"></div>
            <button type="button" className="text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors">
              Recovery
            </button>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-10 text-center space-y-4">
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">
            Encrypted End-to-End System
          </p>
          <div className="flex items-center justify-center gap-6 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
             {/* Simple security indicators */}
             <div className="w-2 h-2 rounded-full bg-zinc-500"></div>
             <div className="w-2 h-2 rounded-full bg-zinc-500"></div>
             <div className="w-2 h-2 rounded-full bg-zinc-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

