'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SupervisorSidebar } from '../_components/sidebar';
import {
  FileText,
  Download,
  BarChart3,
  TrendingUp,
  Users,
  AlertCircle,
  Calendar,
  Clock,
  CheckCircle2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { getSession, type SessionData } from '@/lib/auth';

const dailyReportData = [
  { date: 'Jan 25', completed: 12, inProgress: 8, pending: 2 },
  { date: 'Jan 26', completed: 14, inProgress: 6, pending: 2 },
  { date: 'Jan 27', completed: 16, inProgress: 5, pending: 1 },
  { date: 'Jan 28', completed: 18, inProgress: 4, pending: 1 },
  { date: 'Jan 29', completed: 15, inProgress: 3, pending: 2 },
];

const attendanceData = [
  { date: 'Jan 25', present: 9, late: 1, absent: 0 },
  { date: 'Jan 26', present: 10, late: 0, absent: 0 },
  { date: 'Jan 27', present: 8, late: 2, absent: 0 },
  { date: 'Jan 28', present: 9, late: 1, absent: 0 },
  { date: 'Jan 29', present: 8, late: 1, absent: 1 },
];

const reports = [
  {
    id: 1,
    title: 'Daily Task Summary',
    date: '2024-01-29',
    status: 'completed',
    icon: CheckCircle2,
    color: 'emerald',
    summary: 'Reviewed 24 tasks, 15 completed'
  },
  {
    id: 2,
    title: 'Team Attendance Report',
    date: '2024-01-29',
    status: 'completed',
    icon: Users,
    color: 'blue',
    summary: '8 present, 1 late, 1 absent'
  },
  {
    id: 3,
    title: 'Job Progress Update',
    date: '2024-01-29',
    status: 'pending',
    icon: BarChart3,
    color: 'orange',
    summary: '4 active jobs - 3 on track, 1 delayed'
  },
  {
    id: 4,
    title: 'Material Usage Report',
    date: '2024-01-29',
    status: 'pending',
    icon: AlertCircle,
    color: 'purple',
    summary: 'Tracked usage across all job sites'
  },
];

export default function ReportsPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    const storedSession = getSession();
    if (!storedSession || storedSession.portal !== 'supervisor') {
      router.push('/login/supervisor');
      return;
    }
    setSession(storedSession);
  }, [router]);

  const handleExportReport = (reportId: number, reportTitle: string) => {
    setExportLoading(true);
    setTimeout(() => {
      const csvContent = `data:text/csv;charset=utf-8,Report: ${reportTitle}
Date: ${new Date().toISOString()}
Data: Sample report data

Date,Metric1,Metric2,Metric3
${dailyReportData.map(d => `${d.date},${d.completed},${d.inProgress},${d.pending}`).join('\n')}`;

      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csvContent));
      link.setAttribute("download", `${reportTitle.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`);
      link.click();
      setExportLoading(false);
    }, 800);
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
          {/* Header */}
          <div>
            <h1 className="text-4xl font-black text-white">Reports & Analytics</h1>
            <p className="text-slate-400 mt-1">View daily reports and team performance analytics</p>
          </div>

          {/* Quick Reports */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm hover:shadow-lg transition-all group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${
                    report.color === 'emerald' ? 'bg-emerald-500/20' :
                    report.color === 'blue' ? 'bg-blue-500/20' :
                    report.color === 'orange' ? 'bg-orange-500/20' :
                    'bg-purple-500/20'
                  }`}>
                    <report.icon className={`h-6 w-6 ${
                      report.color === 'emerald' ? 'text-emerald-400' :
                      report.color === 'blue' ? 'text-blue-400' :
                      report.color === 'orange' ? 'text-orange-400' :
                      'text-purple-400'
                    }`} />
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    report.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {report.status === 'completed' ? '✓' : '⏱'} {report.status}
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm mb-1">{report.title}</h3>
                <p className="text-xs text-slate-400 mb-3">{report.date}</p>
                <p className="text-xs text-slate-500">{report.summary}</p>
                <button
                  onClick={() => handleExportReport(report.id, report.title)}
                  className="mt-4 w-full px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-3 h-3" />
                  Export
                </button>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Task Progress Chart */}
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-sm">
              <h3 className="text-xl font-black text-white mb-6">Daily Task Progress</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyReportData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '12px', color: '#f1f5f9' }} />
                    <Legend />
                    <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="inProgress" fill="#f59e0b" name="In Progress" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="pending" fill="#ef4444" name="Pending" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Attendance Trend */}
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-sm">
              <h3 className="text-xl font-black text-white mb-6">Attendance Trend</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '12px', color: '#f1f5f9' }} />
                    <Legend />
                    <Line type="monotone" dataKey="present" stroke="#10b981" strokeWidth={3} name="Present" dot={{ fill: '#10b981', r: 5 }} />
                    <Line type="monotone" dataKey="late" stroke="#f59e0b" strokeWidth={3} name="Late" dot={{ fill: '#f59e0b', r: 5 }} />
                    <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={3} name="Absent" dot={{ fill: '#ef4444', r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">Week Overview</h3>
                <BarChart3 className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Total Tasks</span>
                  <span className="font-bold text-white">75</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Completed</span>
                  <span className="font-bold text-emerald-400">70</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Completion Rate</span>
                  <span className="font-bold text-white">93%</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">Team Performance</h3>
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Avg Attendance</span>
                  <span className="font-bold text-white">92%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Avg Rating</span>
                  <span className="font-bold text-yellow-400">★ 4.7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Active Members</span>
                  <span className="font-bold text-white">8/10</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">Job Status</h3>
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Active Jobs</span>
                  <span className="font-bold text-white">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">On Track</span>
                  <span className="font-bold text-emerald-400">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Delayed</span>
                  <span className="font-bold text-red-400">1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
