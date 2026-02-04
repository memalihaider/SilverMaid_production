'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
  Search,
  Filter,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { getSession, type SessionData } from '@/lib/auth';
import { EmployeeSidebar } from '../_components/sidebar';

interface Job {
  id: string;
  title: string;
  client: string;
  status: 'Pending' | 'Scheduled' | 'In Progress' | 'Completed';
  location: string;
  progress: number;
  dueDate: string;
  assignedDate: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  teamMembers: number;
  tasksCompleted: number;
  tasksTotal: number;
  budget?: number;
  spent?: number;
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
    assignedDate: '2024-01-20',
    description: 'Complete office renovation including electrical, plumbing, and interior design',
    priority: 'High',
    teamMembers: 5,
    tasksCompleted: 8,
    tasksTotal: 12,
    budget: 150000,
    spent: 97500
  },
  {
    id: 'JOB-2024-005',
    title: 'AC Maintenance Services',
    client: 'DEWA',
    status: 'Scheduled',
    location: 'Jebel Ali',
    progress: 0,
    dueDate: '2024-02-01',
    assignedDate: '2024-01-25',
    description: 'Preventive maintenance for AC systems at Jebel Ali facility',
    priority: 'Medium',
    teamMembers: 2,
    tasksCompleted: 0,
    tasksTotal: 4,
    budget: 25000,
    spent: 0
  },
  {
    id: 'JOB-2024-008',
    title: 'Commercial Space Setup',
    client: 'Emaar Properties',
    status: 'In Progress',
    location: 'Downtown Dubai',
    progress: 45,
    dueDate: '2024-02-10',
    assignedDate: '2024-01-18',
    description: 'Setup and furnish commercial office space',
    priority: 'High',
    teamMembers: 8,
    tasksCompleted: 5,
    tasksTotal: 11,
    budget: 200000,
    spent: 90000
  },
  {
    id: 'JOB-2024-002',
    title: 'Residential Interior Design',
    client: 'Private Client',
    status: 'Completed',
    location: 'Palm Jumeirah',
    progress: 100,
    dueDate: '2024-01-28',
    assignedDate: '2024-01-05',
    description: 'Complete interior design and furnishing for residential villa',
    priority: 'Medium',
    teamMembers: 4,
    tasksCompleted: 10,
    tasksTotal: 10,
    budget: 180000,
    spent: 178500
  },
  {
    id: 'JOB-2024-003',
    title: 'Hotel Lobby Renovation',
    client: 'JW Marriott',
    status: 'Pending',
    location: 'Dubai Marina',
    progress: 0,
    dueDate: '2024-03-15',
    assignedDate: '2024-01-28',
    description: 'Luxury hotel lobby renovation project',
    priority: 'Critical',
    teamMembers: 12,
    tasksCompleted: 0,
    tasksTotal: 20,
    budget: 500000,
    spent: 0
  }
];

export default function EmployeeJobsPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(mockJobsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  useEffect(() => {
    const storedSession = getSession();
    if (!storedSession || storedSession.portal !== 'employee') {
      router.push('/login/employee');
      return;
    }
    setSession(storedSession);
  }, [router]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-900/20 text-green-400 border-green-800';
      case 'In Progress': return 'bg-amber-900/20 text-amber-400 border-amber-800';
      case 'Scheduled': return 'bg-blue-900/20 text-blue-400 border-blue-800';
      case 'Pending': return 'bg-red-900/20 text-red-400 border-red-800';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-900/20 text-red-300';
      case 'High': return 'bg-orange-900/20 text-orange-300';
      case 'Medium': return 'bg-amber-900/20 text-amber-300';
      case 'Low': return 'bg-green-900/20 text-green-300';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <EmployeeSidebar session={session} open={sidebarOpen} onOpenChange={setSidebarOpen} />

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
                <h1 className="text-2xl font-bold text-white">My Jobs</h1>
                <p className="text-sm text-slate-400">Manage and track your assigned jobs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by job title, client, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
            >
              <option>All</option>
              <option>Pending</option>
              <option>Scheduled</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm font-medium">Total Jobs</p>
              <p className="text-3xl font-bold text-white mt-2">{jobs.length}</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm font-medium">In Progress</p>
              <p className="text-3xl font-bold text-amber-400 mt-2">{jobs.filter(j => j.status === 'In Progress').length}</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-400 mt-2">{jobs.filter(j => j.status === 'Completed').length}</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm font-medium">Avg Progress</p>
              <p className="text-3xl font-bold text-blue-400 mt-2">{Math.round(jobs.reduce((sum, j) => sum + j.progress, 0) / jobs.length)}%</p>
            </div>
          </div>

          {/* Jobs List */}
          <div className="space-y-4">
            {filteredJobs.map(job => (
              <div
                key={job.id}
                className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition-all"
              >
                <div
                  onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                  className="p-6 cursor-pointer hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                        <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(job.priority)}`}>
                          {job.priority}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.client}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Due: {new Date(job.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-3xl font-bold text-violet-400">{job.progress}%</div>
                      <div className="w-32 bg-slate-600 rounded-full h-2 mt-2">
                        <div
                          className="bg-violet-500 h-2 rounded-full"
                          style={{ width: `${job.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-slate-500 ml-4 transition-transform ${expandedJob === job.id ? 'rotate-90' : ''}`} />
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedJob === job.id && (
                  <div className="border-t border-slate-700 p-6 bg-slate-700/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-white mb-3">Job Details</h4>
                        <p className="text-slate-300 text-sm mb-4">{job.description}</p>
                        <div className="space-y-2 text-sm text-slate-400">
                          <p><span className="font-medium text-slate-300">Assigned:</span> {new Date(job.assignedDate).toLocaleDateString()}</p>
                          <p><span className="font-medium text-slate-300">Team Members:</span> {job.teamMembers}</p>
                          <p><span className="font-medium text-slate-300">Tasks:</span> {job.tasksCompleted}/{job.tasksTotal} completed</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-3">Budget</h4>
                        {job.budget && job.spent !== undefined && (
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-400">Spent</span>
                                <span className="text-white font-semibold">AED {job.spent.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-400">Budget</span>
                                <span className="text-white font-semibold">AED {job.budget.toLocaleString()}</span>
                              </div>
                              <div className="w-full bg-slate-600 rounded-full h-2">
                                <div
                                  className="bg-red-500 h-2 rounded-full"
                                  style={{ width: `${(job.spent / job.budget) * 100}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-slate-400 mt-2">{Math.round((job.spent / job.budget) * 100)}% spent</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-6 flex gap-3">
                      <Link
                        href={`/employee/jobs/${job.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
                      >
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No jobs found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
