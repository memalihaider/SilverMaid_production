'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { getSession, type SessionData } from '@/lib/auth';
import { EmployeeSidebar } from '../_components/sidebar';

interface Request {
  id: string;
  type: 'Overtime' | 'Expense' | 'Equipment' | 'Leave';
  title: string;
  description: string;
  amount?: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
}

const mockRequests: Request[] = [
  { id: 'REQ-001', type: 'Overtime', title: '3 Hours Overtime', description: 'Emergency job completion', amount: undefined, status: 'Pending', date: '2024-01-29' },
  { id: 'REQ-002', type: 'Expense', title: 'Transport Cost', description: 'Fuel and parking for site visit', amount: 150, status: 'Pending', date: '2024-01-28' },
  { id: 'REQ-003', type: 'Equipment', title: 'Power Drill Replacement', description: 'Current drill broken during job', amount: 450, status: 'Approved', date: '2024-01-25' },
  { id: 'REQ-004', type: 'Leave', title: 'Medical Leave - 1 Day', description: 'Doctor appointment scheduled', amount: undefined, status: 'Approved', date: '2024-01-22' },
];

export default function EmployeeRequestsPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requests] = useState<Request[]>(mockRequests);

  useEffect(() => {
    const storedSession = getSession();
    if (!storedSession || storedSession.portal !== 'employee') {
      router.push('/login/employee');
      return;
    }
    setSession(storedSession);
  }, [router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-900/20 text-green-400 border-green-800';
      case 'Pending': return 'bg-amber-900/20 text-amber-400 border-amber-800';
      case 'Rejected': return 'bg-red-900/20 text-red-400 border-red-800';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Overtime': return 'bg-blue-900/20 text-blue-300';
      case 'Expense': return 'bg-purple-900/20 text-purple-300';
      case 'Equipment': return 'bg-orange-900/20 text-orange-300';
      case 'Leave': return 'bg-green-900/20 text-green-300';
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
        <div className="sticky top-0 z-40 bg-slate-800/95 backdrop-blur border-b border-slate-700">
          <div className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-slate-700 rounded-lg">
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">My Requests</h1>
                <p className="text-sm text-slate-400">Submit and track your requests</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium">
              New Request
            </button>
          </div>
        </div>

        <div className="p-6 max-w-7xl mx-auto space-y-6">

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm font-medium">Total Requests</p>
              <p className="text-3xl font-bold text-white mt-2">{requests.length}</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold text-amber-400 mt-2">{requests.filter(r => r.status === 'Pending').length}</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm font-medium">Approved</p>
              <p className="text-3xl font-bold text-green-400 mt-2">{requests.filter(r => r.status === 'Approved').length}</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm font-medium">Rejected</p>
              <p className="text-3xl font-bold text-red-400 mt-2">{requests.filter(r => r.status === 'Rejected').length}</p>
            </div>
          </div>

          {/* Requests List */}
          <div className="space-y-3">
            {requests.map(request => (
              <div key={request.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Send className="w-5 h-5 text-violet-400" />
                      <h3 className="text-lg font-semibold text-white">{request.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${getTypeColor(request.type)}`}>
                        {request.type}
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">{request.description}</p>
                    <p className="text-xs text-slate-500 mt-2">{new Date(request.date).toLocaleDateString()}</p>
                  </div>
                  {request.amount && (
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-violet-400">AED {request.amount.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
