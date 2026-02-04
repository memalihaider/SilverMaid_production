'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SupervisorSidebar } from '../_components/sidebar';
import {
  TrendingUp,
  Users,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Plus,
  ChevronRight,
  Building2,
  MapPin,
  UserCheck,
  BarChart3,
  X
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { getSession, type SessionData } from '@/lib/auth';

// Mock data for supervisor dashboard
const dailyStatsData = [
  { hour: '08:00', completed: 2, inProgress: 4, pending: 3 },
  { hour: '10:00', completed: 4, inProgress: 5, pending: 2 },
  { hour: '12:00', completed: 6, inProgress: 4, pending: 2 },
  { hour: '14:00', completed: 9, inProgress: 3, pending: 2 },
  { hour: '16:00', completed: 12, inProgress: 2, pending: 1 },
  { hour: '18:00', completed: 15, inProgress: 1, pending: 0 }
];

const teamStatusData = [
  { name: 'Present', value: 8, color: '#10b981' },
  { name: 'Late', value: 1, color: '#f59e0b' },
  { name: 'On Leave', value: 1, color: '#6b7280' }
];

const kpis = [
  { title: 'Team Present', value: '8/10', change: '+1', trend: 'up' as const, icon: UserCheck, color: 'green' },
  { title: 'Tasks Completed', value: '15/24', change: '+3', trend: 'up' as const, icon: CheckCircle2, color: 'blue' },
  { title: 'Active Jobs', value: '4', change: '+0', trend: 'up' as const, icon: Briefcase, color: 'purple' },
  { title: 'Pending Approvals', value: '3', change: '-1', trend: 'up' as const, icon: AlertCircle, color: 'orange' }
];

const activeJobs = [
  { id: 'JOB-2024-001', client: 'Al Futtaim Group', location: 'Dubai Festival City', workers: 3, status: 'on-track', progress: 65 },
  { id: 'JOB-2024-002', client: 'Emirates NBD', location: 'Sheikh Zayed Road', workers: 2, status: 'on-track', progress: 48 },
  { id: 'JOB-2024-003', client: 'ADNOC', location: 'Abu Dhabi HQ', workers: 2, status: 'delayed', progress: 35 },
];

const teamMembers = [
  { id: '1', name: 'Ahmed Hassan', status: 'present', checkIn: '07:55 AM', job: 'JOB-2024-001' },
  { id: '2', name: 'Mohammed Ali', status: 'present', checkIn: '08:02 AM', job: 'JOB-2024-001' },
  { id: '3', name: 'Sara Al Maktoum', status: 'present', checkIn: '07:58 AM', job: 'Office' },
  { id: '4', name: 'Omar Rashid', status: 'late', checkIn: '08:15 AM', job: 'JOB-2024-004' },
  { id: '5', name: 'Fatima Khalid', status: 'on-leave', checkIn: null, job: null },
];

const pendingApprovals = [
  { id: 'APR-001', type: 'Overtime', requester: 'Ahmed Hassan', details: '3 hours for JOB-2024-001', icon: Clock, color: 'bg-orange-100', textColor: 'text-orange-600' },
  { id: 'APR-002', type: 'Leave Request', requester: 'Omar Rashid', details: 'Half day off', icon: Users, color: 'bg-blue-100', textColor: 'text-blue-600' },
  { id: 'APR-003', type: 'Material Request', requester: 'Layla Noor', details: '5 boxes of supplies', icon: Briefcase, color: 'bg-purple-100', textColor: 'text-purple-600' },
];

export default function SupervisorDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, user: 'Ahmed Hassan', action: 'completed task', target: '#TSK-001', time: '5 mins ago', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
    { id: 2, user: 'Team', action: 'checked in', target: '8 members', time: '15 mins ago', icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 3, user: 'System', action: 'job progress', target: 'JOB-2024-001 at 65%', time: '1 hour ago', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    { id: 4, user: 'Omar Rashid', action: 'submitted request', target: 'Overtime approval', time: '2 hours ago', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
  ]);

  useEffect(() => {
    const storedSession = getSession();
    if (!storedSession || storedSession.portal !== 'supervisor') {
      router.push('/login/supervisor');
      return;
    }
    setSession(storedSession);
  }, [router]);

  const handleExportData = useCallback(() => {
    setExportLoading(true);
    setTimeout(() => {
      const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(
        "Hour,Completed,In Progress,Pending\n" + dailyStatsData.map(d => `${d.hour},${d.completed},${d.inProgress},${d.pending}`).join("\n")
      );
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      link.setAttribute("download", `supervisor-dashboard-${new Date().toISOString().split('T')[0]}.csv`);
      link.click();
      setExportLoading(false);
    }, 800);
  }, []);

  const handleDeleteActivity = useCallback((id: number) => {
    setRecentActivities(prev => prev.filter(a => a.id !== id));
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <SupervisorSidebar session={session} open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <main className="flex-1 overflow-auto">
        <div className="space-y-8 p-6 lg:p-8">
          {/* Toast Notification */}
          {toast && (
            <div className={`fixed top-6 right-6 px-6 py-3 rounded-xl text-white text-sm font-bold flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top-5 ${
              toast.type === 'success' ? 'bg-green-600 shadow-lg shadow-green-500/20' : 'bg-red-600 shadow-lg shadow-red-500/20'
            }`}>
              {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {toast.message}
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-white">Daily Overview</h1>
              <p className="text-slate-400 mt-1">Welcome back, {session?.user?.email}. Here&apos;s today&apos;s summary.</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleExportData}
                disabled={exportLoading}
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-slate-200 hover:bg-slate-700 transition-all disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                {exportLoading ? 'Exporting...' : 'Export Data'}
              </button>
              <Link 
                href="/supervisor/team"
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
              >
                <Plus className="h-4 w-4" />
                Team View
              </Link>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/supervisor/team" className="group bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm hover:shadow-lg hover:border-emerald-500/50 transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6" />
                </div>
                <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h3 className="text-sm font-bold text-slate-300">Team</h3>
              <p className="text-2xl font-black text-white mt-2">8/10</p>
              <p className="text-xs text-slate-400 mt-1">Present today</p>
            </Link>

            <Link href="/supervisor/jobs" className="group bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm hover:shadow-lg hover:border-blue-500/50 transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                  <Briefcase className="h-6 w-6" />
                </div>
                <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
              </div>
              <h3 className="text-sm font-bold text-slate-300">Active Jobs</h3>
              <p className="text-2xl font-black text-white mt-2">4</p>
              <p className="text-xs text-slate-400 mt-1">Job sites</p>
            </Link>

            <Link href="/supervisor/approvals" className="group bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm hover:shadow-lg hover:border-purple-500/50 transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
              </div>
              <h3 className="text-sm font-bold text-slate-300">Approvals</h3>
              <p className="text-2xl font-black text-white mt-2">3</p>
              <p className="text-xs text-slate-400 mt-1">Pending action</p>
            </Link>

            <Link href="/supervisor/reports" className="group bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm hover:shadow-lg hover:border-orange-500/50 transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-orange-500/20 text-orange-400 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-orange-400 transition-colors" />
              </div>
              <h3 className="text-sm font-bold text-slate-300">Reports</h3>
              <p className="text-2xl font-black text-white mt-2">Daily</p>
              <p className="text-xs text-slate-400 mt-1">View reports</p>
            </Link>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi, index) => (
              <div key={index} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm hover:shadow-md transition-all group cursor-pointer hover:border-slate-600">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-xl bg-slate-700 text-slate-300 group-hover:scale-110 transition-transform">
                    <kpi.icon className="h-6 w-6" />
                  </div>
                  <div className={`flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                    kpi.trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {kpi.change}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-400">{kpi.title}</h3>
                <p className="text-3xl font-black text-white mt-2">{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Main Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-black text-white">Daily Task Progress</h3>
                  <p className="text-sm text-slate-400">Completion trend throughout the day</p>
                </div>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyStatsData}>
                    <defs>
                      <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                    <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '12px', color: '#f1f5f9' }} />
                    <Area type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
                    <Area type="monotone" dataKey="inProgress" stroke="#f59e0b" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                    <Area type="monotone" dataKey="pending" stroke="#ef4444" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-sm">
              <h3 className="text-xl font-black text-white mb-2">Team Attendance</h3>
              <p className="text-sm text-slate-400 mb-8">Today&apos;s status</p>
              <div className="h-64 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={teamStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {teamStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black text-white">10</span>
                  <span className="text-xs font-bold text-slate-400 uppercase">Total Team</span>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                {teamStatusData.map((status, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: status.color }}></div>
                      <span className="text-slate-300">{status.name}</span>
                    </div>
                    <span className="font-bold text-white">{status.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Jobs & Approvals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Active Jobs */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-sm">
              <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                <h3 className="text-lg font-black text-white">Active Job Sites</h3>
                <Link href="/supervisor/jobs" className="text-emerald-400 hover:text-emerald-300 text-sm font-bold flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="divide-y divide-slate-700">
                {activeJobs.map((job) => (
                  <div key={job.id} className="p-6 hover:bg-slate-700/30 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-white">{job.id}</p>
                        <p className="text-xs text-slate-400 mt-1">{job.client}</p>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-2">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        job.status === 'on-track' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {job.status === 'on-track' ? '✓ On Track' : '⚠ Delayed'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Progress: {job.progress}%</span>
                        <span className="text-white font-bold">{job.workers} workers</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${job.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-sm">
              <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-black text-white">Pending Approvals</h3>
                  <p className="text-xs text-slate-400 mt-1">{pendingApprovals.length} awaiting action</p>
                </div>
                <Link href="/supervisor/approvals" className="text-emerald-400 hover:text-emerald-300 text-sm font-bold flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="divide-y divide-slate-700">
                {pendingApprovals.map((approval) => (
                  <div key={approval.id} className="p-6 hover:bg-slate-700/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-lg ${approval.color}`}>
                        <approval.icon className={`w-5 h-5 ${approval.textColor}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-white text-sm">{approval.type}</p>
                        <p className="text-xs text-slate-400 mt-1">{approval.requester}</p>
                        <p className="text-xs text-slate-500 mt-1">{approval.details}</p>
                      </div>
                      <span className="text-yellow-400 text-xs font-bold">⏱ Pending</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-sm">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-lg font-black text-white">Activity Log</h3>
            </div>
            <div className="divide-y divide-slate-700">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="p-6 hover:bg-slate-700/30 transition-colors flex items-start justify-between group">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-lg ${activity.bg}`}>
                      <activity.icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div>
                      <p className="text-white text-sm">
                        <span className="font-bold">{activity.user}</span> {activity.action} <span className="text-emerald-400 font-bold">{activity.target}</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteActivity(activity.id)}
                    className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-slate-700 transition-all text-slate-400 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
