'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SupervisorSidebar } from '../_components/sidebar';
import {
  CheckCircle2,
  Clock,
  Users,
  AlertCircle,
  ChevronRight,
  Filter,
  X
} from 'lucide-react';
import { getSession, type SessionData } from '@/lib/auth';

const initialApprovals = [
  { id: 'APR-001', type: 'Overtime', requester: 'Ahmed Hassan', details: '3 hours for JOB-2024-001', requestDate: '2024-01-29', icon: Clock, color: 'bg-orange-100', textColor: 'text-orange-600' },
  { id: 'APR-002', type: 'Leave Request', requester: 'Omar Rashid', details: 'Half day off - Medical appointment', requestDate: '2024-01-29', icon: Users, color: 'bg-blue-100', textColor: 'text-blue-600' },
  { id: 'APR-003', type: 'Material Request', requester: 'Layla Noor', details: '5 boxes of supplies for JOB-2024-003', requestDate: '2024-01-29', icon: AlertCircle, color: 'bg-purple-100', textColor: 'text-purple-600' },
];

export default function ApprovalsPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [approvals, setApprovals] = useState(initialApprovals);
  const [processingApproval, setProcessingApproval] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    const storedSession = getSession();
    if (!storedSession || storedSession.portal !== 'supervisor') {
      router.push('/login/supervisor');
      return;
    }
    setSession(storedSession);
  }, [router]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = useCallback((approvalId: string) => {
    setProcessingApproval(approvalId);
    setTimeout(() => {
      const approval = approvals.find(a => a.id === approvalId);
      if (approval) {
        setApprovals(prev => prev.filter(a => a.id !== approvalId));
        showToast(`${approval.type} from ${approval.requester} approved!`, 'success');
      }
      setProcessingApproval(null);
    }, 600);
  }, [approvals]);

  const handleReject = useCallback((approvalId: string) => {
    setProcessingApproval(approvalId);
    setTimeout(() => {
      const approval = approvals.find(a => a.id === approvalId);
      if (approval) {
        setApprovals(prev => prev.filter(a => a.id !== approvalId));
        showToast(`${approval.type} from ${approval.requester} rejected.`, 'error');
      }
      setProcessingApproval(null);
    }, 600);
  }, [approvals]);

  const filteredApprovals = approvals.filter(a => !selectedType || a.type === selectedType);

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
          <div>
            <h1 className="text-4xl font-black text-white">Pending Approvals</h1>
            <p className="text-slate-400 mt-1">{approvals.length} requests awaiting your action</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType(null)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                !selectedType
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All ({approvals.length})
            </button>
            <button
              onClick={() => setSelectedType('Overtime')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                selectedType === 'Overtime'
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Overtime ({approvals.filter(a => a.type === 'Overtime').length})
            </button>
            <button
              onClick={() => setSelectedType('Leave Request')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                selectedType === 'Leave Request'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Leave ({approvals.filter(a => a.type === 'Leave Request').length})
            </button>
            <button
              onClick={() => setSelectedType('Material Request')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                selectedType === 'Material Request'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Material ({approvals.filter(a => a.type === 'Material Request').length})
            </button>
          </div>

          {/* Approvals List */}
          {approvals.length === 0 ? (
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-50" />
              <p className="text-slate-400 text-lg">All approvals processed!</p>
              <p className="text-slate-500 text-sm mt-1">Great job keeping your team on track.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApprovals.map((approval) => (
                <div key={approval.id} className="bg-slate-800 rounded-2xl border border-slate-700 p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-lg ${approval.color}`}>
                      <approval.icon className={`w-6 h-6 ${approval.textColor}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-white text-lg">{approval.type}</h3>
                          <p className="text-sm text-slate-400 mt-1">From: <span className="text-white font-semibold">{approval.requester}</span></p>
                        </div>
                        <span className="text-xs text-slate-500">{approval.requestDate}</span>
                      </div>
                      <p className="text-sm text-slate-400 mt-2">{approval.details}</p>

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-4 pt-4 border-t border-slate-700">
                        <button
                          onClick={() => handleApprove(approval.id)}
                          disabled={processingApproval === approval.id}
                          className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                          {processingApproval === approval.id ? (
                            <>
                              <span className="inline-block w-3 h-3 rounded-full border-2 border-transparent border-t-emerald-300 animate-spin"></span>
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              Approve
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(approval.id)}
                          disabled={processingApproval === approval.id}
                          className="flex-1 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 disabled:bg-slate-700 disabled:text-slate-500 text-red-400 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 border border-red-600/30 hover:border-red-600/50"
                        >
                          {processingApproval === approval.id ? (
                            <>
                              <span className="inline-block w-3 h-3 rounded-full border-2 border-transparent border-t-red-300 animate-spin"></span>
                              Processing...
                            </>
                          ) : (
                            <>
                              <X className="w-4 h-4" />
                              Reject
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
