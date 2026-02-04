'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { getSession, type SessionData } from '@/lib/auth';
import { EmployeeSidebar } from '../_components/sidebar';

interface LeaveRecord {
  id: string;
  type: 'Annual' | 'Sick' | 'Personal' | 'Unpaid';
  startDate: string;
  endDate: string;
  days: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  reason: string;
}

const mockLeaveData: LeaveRecord[] = [
  { id: 'LV-001', type: 'Annual', startDate: '2024-02-15', endDate: '2024-02-17', days: 3, status: 'Approved', reason: 'Vacation' },
  { id: 'LV-002', type: 'Sick', startDate: '2024-01-25', endDate: '2024-01-25', days: 1, status: 'Approved', reason: 'Medical appointment' },
  { id: 'LV-003', type: 'Personal', startDate: '2024-02-05', endDate: '2024-02-05', days: 1, status: 'Pending', reason: 'Personal business' },
];

const leaveBalance = {
  annual: { used: 10, total: 21 },
  sick: { used: 2, total: 10 },
  personal: { used: 1, total: 3 },
  unpaid: { used: 0, total: 0 }
};

export default function EmployeeLeavePage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leaves, setLeaves] = useState<LeaveRecord[]>(mockLeaveData);
  const [showForm, setShowForm] = useState(false);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'Pending': return <Clock className="w-5 h-5 text-amber-400" />;
      case 'Rejected': return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return null;
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
                <h1 className="text-2xl font-bold text-white">Leave Management</h1>
                <p className="text-sm text-slate-400">Request and track your leave</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium"
            >
              {showForm ? 'Cancel' : 'Request Leave'}
            </button>
          </div>
        </div>

        <div className="p-6 max-w-7xl mx-auto space-y-6">

          {/* Leave Balance */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { name: 'Annual', data: leaveBalance.annual, color: 'blue' },
              { name: 'Sick', data: leaveBalance.sick, color: 'green' },
              { name: 'Personal', data: leaveBalance.personal, color: 'amber' },
              { name: 'Unpaid', data: leaveBalance.unpaid, color: 'red' },
            ].map((type) => (
              <div key={type.name} className={`bg-slate-800 border border-slate-700 rounded-xl p-4`}>
                <p className="text-slate-400 text-sm font-medium">{type.name} Leave</p>
                <p className={`text-3xl font-bold mt-2 text-${type.color}-400`}>{type.data.total - type.data.used}</p>
                <p className="text-xs text-slate-400 mt-2">{type.data.used}/{type.data.total} used</p>
              </div>
            ))}
          </div>

          {/* Leave Requests */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-700 bg-slate-700/50">
              <h3 className="text-lg font-semibold text-white">Leave Requests</h3>
            </div>
            <div className="divide-y divide-slate-700">
              {leaves.map(leave => (
                <div key={leave.id} className="p-6 hover:bg-slate-700/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-5 h-5 text-violet-400" />
                        <h4 className="font-semibold text-white">{leave.type} Leave</h4>
                        <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(leave.status)}`}>
                          {leave.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm">{leave.reason}</p>
                      <p className="text-slate-400 text-sm mt-1">
                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()} ({leave.days} days)
                      </p>
                    </div>
                    {getStatusIcon(leave.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
