'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  X,
  LayoutDashboard,
  Briefcase,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Download,
  CheckSquare,
  Users,
  FileText,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { getSession, clearSession, type SessionData } from '@/lib/auth';
import { EmployeeSidebar } from '../_components/sidebar';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Job {
  id: string;
  title: string;
  client: string;
  status: 'Pending' | 'Scheduled' | 'In Progress' | 'Completed';
  location: string;
  progress: number;
  dueDate: string;
  assignedDate: string;
}

interface Task {
  id: string;
  title: string;
  jobId: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  estimatedHours: number;
  completedHours: number;
}

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

const mockJobsData: Job[] = [
  {
    id: 'JOB-2024-001',
    title: 'Office Renovation - Phase 1',
    client: 'Al Futtaim Group',
    status: 'In Progress',
    location: 'Dubai Festival City',
    progress: 65,
    dueDate: '2024-02-15',
    assignedDate: '2024-01-20'
  },
  {
    id: 'JOB-2024-005',
    title: 'AC Maintenance Services',
    client: 'DEWA',
    status: 'Scheduled',
    location: 'Jebel Ali',
    progress: 0,
    dueDate: '2024-02-01',
    assignedDate: '2024-01-25'
  },
  {
    id: 'JOB-2024-008',
    title: 'Commercial Space Setup',
    client: 'Emaar Properties',
    status: 'In Progress',
    location: 'Downtown Dubai',
    progress: 45,
    dueDate: '2024-02-10',
    assignedDate: '2024-01-18'
  },
  {
    id: 'JOB-2024-002',
    title: 'Residential Interior Design',
    client: 'Private Client',
    status: 'Completed',
    location: 'Palm Jumeirah',
    progress: 100,
    dueDate: '2024-01-28',
    assignedDate: '2024-01-05'
  }
];

const mockTasksData: Task[] = [
  {
    id: 'TASK-001',
    title: 'Install main electrical panel',
    jobId: 'JOB-2024-001',
    status: 'Completed',
    priority: 'High',
    dueDate: '2024-02-05',
    estimatedHours: 8,
    completedHours: 8
  },
  {
    id: 'TASK-002',
    title: 'Plumbing system installation',
    jobId: 'JOB-2024-001',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2024-02-10',
    estimatedHours: 12,
    completedHours: 6
  },
  {
    id: 'TASK-003',
    title: 'Paint and finishing',
    jobId: 'JOB-2024-001',
    status: 'Pending',
    priority: 'Medium',
    dueDate: '2024-02-15',
    estimatedHours: 16,
    completedHours: 0
  },
  {
    id: 'TASK-004',
    title: 'System inspection and testing',
    jobId: 'JOB-2024-005',
    status: 'Pending',
    priority: 'High',
    dueDate: '2024-02-01',
    estimatedHours: 4,
    completedHours: 0
  },
  {
    id: 'TASK-005',
    title: 'Furniture arrangement',
    jobId: 'JOB-2024-008',
    status: 'In Progress',
    priority: 'Medium',
    dueDate: '2024-02-08',
    estimatedHours: 8,
    completedHours: 3
  }
];

const dailyStatsData = [
  { time: '08:00 AM', completed: 2, inProgress: 3, pending: 5 },
  { time: '10:00 AM', completed: 3, inProgress: 4, pending: 4 },
  { time: '12:00 PM', completed: 5, inProgress: 3, pending: 3 },
  { time: '02:00 PM', completed: 6, inProgress: 3, pending: 2 },
  { time: '04:00 PM', completed: 8, inProgress: 2, pending: 1 },
  { time: '06:00 PM', completed: 9, inProgress: 1, pending: 1 }
];

const jobStatusData = [
  { name: 'Completed', value: 12, color: '#10b981' },
  { name: 'In Progress', value: 8, color: '#f59e0b' },
  { name: 'Scheduled', value: 5, color: '#3b82f6' },
  { name: 'Pending', value: 3, color: '#ef4444' }
];

export default function EmployeeDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [jobs, setJobs] = useState<Job[]>(mockJobsData);
  const [tasks, setTasks] = useState<Task[]>(mockTasksData);

  useEffect(() => {
    const storedSession = getSession();
    if (!storedSession || storedSession.portal !== 'employee') {
      router.push('/login/employee');
      return;
    }
    setSession(storedSession);
  }, [router]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleExport = useCallback(() => {
    setExportLoading(true);
    setTimeout(() => {
      const csvContent = [
        ['Job ID', 'Title', 'Client', 'Status', 'Progress', 'Due Date'].join(','),
        ...jobs.map(j => [j.id, j.title, j.client, j.status, j.progress, j.dueDate].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `employee-jobs-${new Date().getTime()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setExportLoading(false);
      showToast('Jobs exported successfully!', 'success');
    }, 600);
  }, [jobs, showToast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-900/20 text-green-400 border-green-800';
      case 'In Progress': return 'bg-amber-900/20 text-amber-400 border-amber-800';
      case 'Scheduled': return 'bg-blue-900/20 text-blue-400 border-blue-800';
      case 'Pending': return 'bg-red-900/20 text-red-400 border-red-800';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  const getTaskStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'In Progress': return <Clock className="w-4 h-4 text-amber-400" />;
      case 'Pending': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const completedJobs = jobs.filter(j => j.status === 'Completed').length;
  const activeJobs = jobs.filter(j => j.status === 'In Progress' || j.status === 'Scheduled').length;

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <EmployeeSidebar session={session} open={sidebarOpen} onOpenChange={setSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-slate-800/95 backdrop-blur border-b border-slate-700">
          <div className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-sm text-slate-400">Welcome back! Here's your work overview</p>
              </div>
            </div>
            <button
              onClick={handleExport}
              disabled={exportLoading}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              {exportLoading ? 'Exporting...' : 'Export'}
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-4 right-4 p-4 rounded-lg ${
            toast.type === 'success' ? 'bg-green-900 text-green-200' :
            toast.type === 'error' ? 'bg-red-900 text-red-200' :
            'bg-blue-900 text-blue-200'
          } z-50 animate-fade-in max-w-md`}>
            {toast.message}
          </div>
        )}

        {/* Content */}
        <div className="p-6 max-w-7xl mx-auto space-y-6">

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-linear-to-br from-violet-900 to-violet-800 rounded-xl p-6 border border-violet-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-violet-300 text-sm font-medium">Active Jobs</p>
                  <p className="text-3xl font-bold text-white mt-2">{activeJobs}</p>
                </div>
                <Briefcase className="w-12 h-12 text-violet-500/20" />
              </div>
              <p className="text-violet-300 text-xs mt-3">Currently assigned</p>
            </div>

            <div className="bg-linear-to-br from-amber-900 to-amber-800 rounded-xl p-6 border border-amber-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-300 text-sm font-medium">In Progress Tasks</p>
                  <p className="text-3xl font-bold text-white mt-2">{inProgressTasks}</p>
                </div>
                <CheckSquare className="w-12 h-12 text-amber-500/20" />
              </div>
              <p className="text-amber-300 text-xs mt-3">Need attention</p>
            </div>

            <div className="bg-linear-to-br from-green-900 to-green-800 rounded-xl p-6 border border-green-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-sm font-medium">Completed Tasks</p>
                  <p className="text-3xl font-bold text-white mt-2">{completedTasks}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-500/20" />
              </div>
              <p className="text-green-300 text-xs mt-3">This month</p>
            </div>

            <div className="bg-linear-to-br from-blue-900 to-blue-800 rounded-xl p-6 border border-blue-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm font-medium">Completed Jobs</p>
                  <p className="text-3xl font-bold text-white mt-2">{completedJobs}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-blue-500/20" />
              </div>
              <p className="text-blue-300 text-xs mt-3">Total completed</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/employee/jobs" className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-4 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <p className="font-semibold text-white group-hover:text-violet-400 transition-colors">My Jobs</p>
                  <p className="text-xs text-slate-400">View all {jobs.length} assignments</p>
                </div>
              </div>
            </Link>

            <Link href="/employee/tasks" className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-4 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="font-semibold text-white group-hover:text-amber-400 transition-colors">My Tasks</p>
                  <p className="text-xs text-slate-400">Manage {tasks.length} tasks</p>
                </div>
              </div>
            </Link>

            <Link href="/employee/attendance" className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-4 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-white group-hover:text-green-400 transition-colors">Attendance</p>
                  <p className="text-xs text-slate-400">Check in/out</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Task Progress Chart */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Daily Task Progress</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailyStatsData}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInProgress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                  <Legend />
                  <Area type="monotone" dataKey="completed" stroke="#10b981" fillOpacity={1} fill="url(#colorCompleted)" />
                  <Area type="monotone" dataKey="inProgress" stroke="#f59e0b" fillOpacity={1} fill="url(#colorInProgress)" />
                  <Area type="monotone" dataKey="pending" stroke="#ef4444" fillOpacity={1} fill="url(#colorPending)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Job Status Distribution */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Job Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={jobStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {jobStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Jobs Section */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Active Jobs</h3>
              <Link href="/employee/jobs" className="text-violet-400 hover:text-violet-300 text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {jobs.filter(j => j.status !== 'Completed').map(job => (
                <div key={job.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-white">{job.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">{job.client} • {job.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="w-24 bg-slate-600 rounded-full h-2 mb-2">
                      <div
                        className="bg-violet-500 h-2 rounded-full"
                        style={{ width: `${job.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-slate-300">{job.progress}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Tasks Section */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">My Tasks</h3>
              <Link href="/employee/tasks" className="text-violet-400 hover:text-violet-300 text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold text-slate-300">Task</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-300">Job</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-300">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-300">Priority</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-300">Progress</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-300">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.slice(0, 5).map(task => (
                    <tr key={task.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                      <td className="py-3 px-4 text-white">{task.title}</td>
                      <td className="py-3 px-4 text-slate-400">{task.jobId}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getTaskStatusBadge(task.status)}
                          <span>{task.status}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded ${
                          task.priority === 'High' ? 'bg-red-900/20 text-red-300' :
                          task.priority === 'Medium' ? 'bg-amber-900/20 text-amber-300' :
                          'bg-green-900/20 text-green-300'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-600 rounded h-2">
                            <div
                              className="bg-violet-500 h-2 rounded"
                              style={{ width: `${(task.completedHours / task.estimatedHours) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-slate-400">{Math.round((task.completedHours / task.estimatedHours) * 100)}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{new Date(task.dueDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
