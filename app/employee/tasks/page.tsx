'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  X,
  CheckSquare,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  Briefcase,
  Calendar,
  Zap,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { getSession, type SessionData } from '@/lib/auth';
import { EmployeeSidebar } from '../_components/sidebar';

interface Task {
  id: string;
  title: string;
  jobId: string;
  jobTitle: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  estimatedHours: number;
  completedHours: number;
  description: string;
  assignedDate: string;
  notes?: string;
}

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

const mockTasksData: Task[] = [
  {
    id: 'TASK-001',
    title: 'Install main electrical panel',
    jobId: 'JOB-2024-001',
    jobTitle: 'Office Renovation - Phase 1',
    status: 'Completed',
    priority: 'High',
    dueDate: '2024-02-05',
    estimatedHours: 8,
    completedHours: 8,
    description: 'Install and test the main electrical distribution panel',
    assignedDate: '2024-01-20'
  },
  {
    id: 'TASK-002',
    title: 'Plumbing system installation',
    jobId: 'JOB-2024-001',
    jobTitle: 'Office Renovation - Phase 1',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2024-02-10',
    estimatedHours: 12,
    completedHours: 6,
    description: 'Install complete plumbing system including fixtures and connections',
    assignedDate: '2024-01-22'
  },
  {
    id: 'TASK-003',
    title: 'Paint and finishing',
    jobId: 'JOB-2024-001',
    jobTitle: 'Office Renovation - Phase 1',
    status: 'Pending',
    priority: 'Medium',
    dueDate: '2024-02-15',
    estimatedHours: 16,
    completedHours: 0,
    description: 'Complete interior painting and finishing touches',
    assignedDate: '2024-01-25'
  },
  {
    id: 'TASK-004',
    title: 'System inspection and testing',
    jobId: 'JOB-2024-005',
    jobTitle: 'AC Maintenance Services',
    status: 'Pending',
    priority: 'High',
    dueDate: '2024-02-01',
    estimatedHours: 4,
    completedHours: 0,
    description: 'Full inspection and testing of AC systems',
    assignedDate: '2024-01-28'
  },
  {
    id: 'TASK-005',
    title: 'Furniture arrangement',
    jobId: 'JOB-2024-008',
    jobTitle: 'Commercial Space Setup',
    status: 'In Progress',
    priority: 'Medium',
    dueDate: '2024-02-08',
    estimatedHours: 8,
    completedHours: 3,
    description: 'Arrange and setup all office furniture',
    assignedDate: '2024-01-24'
  },
  {
    id: 'TASK-006',
    title: 'Cable routing and setup',
    jobId: 'JOB-2024-008',
    jobTitle: 'Commercial Space Setup',
    status: 'Pending',
    priority: 'High',
    dueDate: '2024-02-06',
    estimatedHours: 6,
    completedHours: 0,
    description: 'Setup IT infrastructure and cable routing',
    assignedDate: '2024-01-26'
  },
  {
    id: 'TASK-007',
    title: 'Lighting installation',
    jobId: 'JOB-2024-008',
    jobTitle: 'Commercial Space Setup',
    status: 'Pending',
    priority: 'Medium',
    dueDate: '2024-02-12',
    estimatedHours: 10,
    completedHours: 0,
    description: 'Install all ceiling and wall lighting fixtures',
    assignedDate: '2024-01-27'
  },
  {
    id: 'TASK-008',
    title: 'Final quality check',
    jobId: 'JOB-2024-002',
    jobTitle: 'Residential Interior Design',
    status: 'Completed',
    priority: 'High',
    dueDate: '2024-01-28',
    estimatedHours: 5,
    completedHours: 5,
    description: 'Final walkthrough and quality assurance check',
    assignedDate: '2024-01-26'
  }
];

export default function EmployeeTasksPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(mockTasksData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [toast, setToast] = useState<Toast | null>(null);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

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

  const handleCompleteTask = useCallback((taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'Completed', completedHours: task.estimatedHours }
        : task
    ));
    showToast('Task marked as completed!', 'success');
  }, [tasks, showToast]);

  const handleUpdateProgress = useCallback((taskId: string, hours: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, completedHours: Math.min(hours, task.estimatedHours) }
        : task
    ));
    showToast('Task progress updated!', 'success');
  }, [tasks, showToast]);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'In Progress': return <Clock className="w-5 h-5 text-amber-400" />;
      case 'Pending': return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-900/20 text-green-400 border-green-800';
      case 'In Progress': return 'bg-amber-900/20 text-amber-400 border-amber-800';
      case 'Pending': return 'bg-red-900/20 text-red-400 border-red-800';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-900/20 text-red-300';
      case 'Medium': return 'bg-amber-900/20 text-amber-300';
      case 'Low': return 'bg-green-900/20 text-green-300';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    hoursWorked: tasks.reduce((sum, t) => sum + t.completedHours, 0),
    totalHours: tasks.reduce((sum, t) => sum + t.estimatedHours, 0)
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
                <h1 className="text-2xl font-bold text-white">My Tasks</h1>
                <p className="text-sm text-slate-400">Track and manage your assigned tasks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Toast */}
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
          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm font-medium">Total Tasks</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-400 mt-2">{stats.completed}</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm font-medium">In Progress</p>
              <p className="text-3xl font-bold text-amber-400 mt-2">{stats.inProgress}</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold text-red-400 mt-2">{stats.pending}</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm font-medium">Hours</p>
              <p className="text-3xl font-bold text-blue-400 mt-2">{stats.hoursWorked}/{stats.totalHours}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search tasks..."
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
              <option>All Status</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
            >
              <option>All Priority</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            {filteredTasks.map(task => (
              <div
                key={task.id}
                className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition-all"
              >
                <div
                  onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                  className="p-4 cursor-pointer hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="pt-1">
                      {getStatusIcon(task.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white font-semibold">{task.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {task.jobTitle}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-4 h-4" />
                          {task.completedHours}/{task.estimatedHours} hours
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="w-24 bg-slate-600 rounded-full h-2 mb-2">
                        <div
                          className="bg-violet-500 h-2 rounded-full"
                          style={{ width: `${(task.completedHours / task.estimatedHours) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-slate-300">{Math.round((task.completedHours / task.estimatedHours) * 100)}%</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-slate-500 ml-2 transition-transform ${expandedTask === task.id ? 'rotate-90' : ''}`} />
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedTask === task.id && (
                  <div className="border-t border-slate-700 p-4 bg-slate-700/30 space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Task Description</h4>
                      <p className="text-slate-300 text-sm">{task.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-white mb-3">Progress</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">Hours Completed</span>
                          <span className="text-white font-semibold">{task.completedHours}/{task.estimatedHours} hrs</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div
                            className="bg-violet-500 h-2 rounded-full"
                            style={{ width: `${(task.completedHours / task.estimatedHours) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <input
                            type="number"
                            min="0"
                            max={task.estimatedHours}
                            value={task.completedHours}
                            onChange={(e) => handleUpdateProgress(task.id, parseFloat(e.target.value))}
                            className="w-20 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-violet-500"
                          />
                          <span className="text-slate-400 text-sm">/ {task.estimatedHours} hours</span>
                        </div>
                      </div>
                    </div>

                    {task.notes && (
                      <div>
                        <h4 className="font-semibold text-white mb-2">Notes</h4>
                        <p className="text-slate-300 text-sm">{task.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      {task.status !== 'Completed' && (
                        <button
                          onClick={() => handleCompleteTask(task.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark Complete
                        </button>
                      )}
                      <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors text-sm">
                        Add Note
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <CheckSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No tasks found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
