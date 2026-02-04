'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SupervisorSidebar } from '../_components/sidebar';
import {
  Briefcase,
  MapPin,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { getSession, type SessionData } from '@/lib/auth';

const jobs = [
  {
    id: 'JOB-2024-001',
    client: 'Al Futtaim Group',
    location: 'Dubai Festival City',
    status: 'on-track',
    progress: 65,
    startDate: '2024-01-05',
    dueDate: '2024-02-15',
    workers: 3,
    budget: 150000,
    spent: 97500,
    tasks: 24,
    completedTasks: 15
  },
  {
    id: 'JOB-2024-002',
    client: 'Emirates NBD',
    location: 'Sheikh Zayed Road',
    status: 'on-track',
    progress: 48,
    startDate: '2024-01-10',
    dueDate: '2024-02-20',
    workers: 2,
    budget: 80000,
    spent: 32000,
    tasks: 20,
    completedTasks: 9
  },
  {
    id: 'JOB-2024-003',
    client: 'ADNOC',
    location: 'Abu Dhabi HQ',
    status: 'delayed',
    progress: 35,
    startDate: '2024-01-15',
    dueDate: '2024-03-01',
    workers: 2,
    budget: 250000,
    spent: 37500,
    tasks: 30,
    completedTasks: 10
  },
  {
    id: 'JOB-2024-004',
    client: 'Emaar Properties',
    location: 'Downtown Dubai',
    status: 'on-track',
    progress: 80,
    startDate: '2024-01-01',
    dueDate: '2024-02-10',
    workers: 1,
    budget: 120000,
    spent: 96000,
    tasks: 15,
    completedTasks: 12
  }
];

export default function JobsPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  useEffect(() => {
    const storedSession = getSession();
    if (!storedSession || storedSession.portal !== 'supervisor') {
      router.push('/login/supervisor');
      return;
    }
    setSession(storedSession);
  }, [router]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || job.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

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
            <h1 className="text-4xl font-black text-white">Job Management</h1>
            <p className="text-slate-400 mt-1">Monitor and oversee all active job sites</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by job ID, client, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <select
              value={selectedStatus || ''}
              onChange={(e) => setSelectedStatus(e.target.value || null)}
              className="px-6 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="">All Status</option>
              <option value="on-track">On Track</option>
              <option value="delayed">Delayed</option>
            </select>
          </div>

          {/* Jobs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-slate-800 rounded-2xl border border-slate-700 shadow-sm hover:shadow-lg transition-all overflow-hidden group cursor-pointer">
                <div className="p-6 border-b border-slate-700 flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-white">{job.id}</h3>
                    <p className="text-sm text-slate-400 mt-1">{job.client}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-2">
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                    job.status === 'on-track' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {job.status === 'on-track' ? '✓ On Track' : '⚠ Delayed'}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-400">Progress</span>
                      <span className="text-sm font-bold text-white">{job.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${job.progress}%` }}></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-700/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-slate-400">Workers</span>
                      </div>
                      <p className="text-lg font-black text-white">{job.workers}</p>
                    </div>
                    <div className="bg-slate-700/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart3 className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-slate-400">Tasks</span>
                      </div>
                      <p className="text-lg font-black text-white">{job.completedTasks}/{job.tasks}</p>
                    </div>
                    <div className="bg-slate-700/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        <span className="text-xs text-slate-400">Due Date</span>
                      </div>
                      <p className="text-sm font-bold text-white">{job.dueDate}</p>
                    </div>
                    <div className="bg-slate-700/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="w-4 h-4 text-orange-400" />
                        <span className="text-xs text-slate-400">Budget</span>
                      </div>
                      <p className="text-sm font-bold text-white">{Math.round((job.spent / job.budget) * 100)}%</p>
                    </div>
                  </div>

                  {/* Budget Info */}
                  <div className="pt-2 border-t border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-400">Budget Spent</span>
                      <span className="text-sm font-bold text-orange-400">AED {(job.spent / 1000).toFixed(0)}K / {(job.budget / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full transition-all" style={{ width: `${(job.spent / job.budget) * 100}%` }}></div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2">
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3 opacity-50" />
              <p className="text-slate-400">No jobs found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
