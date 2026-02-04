'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SupervisorSidebar } from '../_components/sidebar';
import {
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Download,
  Plus,
  ChevronRight,
  UserCheck,
  Calendar,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { getSession, type SessionData } from '@/lib/auth';

const teamMembers = [
  { id: '1', name: 'Ahmed Hassan', role: 'Senior Technician', status: 'present', checkIn: '07:55 AM', job: 'JOB-2024-001', phone: '+971501234567', email: 'ahmed@homeware.com', rating: 4.8 },
  { id: '2', name: 'Mohammed Ali', role: 'Technician', status: 'present', checkIn: '08:02 AM', job: 'JOB-2024-001', phone: '+971501234568', email: 'mohammed@homeware.com', rating: 4.6 },
  { id: '3', name: 'Sara Al Maktoum', role: 'Technician', status: 'present', checkIn: '07:58 AM', job: 'Office', phone: '+971501234569', email: 'sara@homeware.com', rating: 4.7 },
  { id: '4', name: 'Omar Rashid', role: 'Technician', status: 'late', checkIn: '08:15 AM', job: 'JOB-2024-004', phone: '+971501234570', email: 'omar@homeware.com', rating: 4.5 },
  { id: '5', name: 'Fatima Khalid', role: 'Technician', status: 'on-leave', checkIn: null, job: null, phone: '+971501234571', email: 'fatima@homeware.com', rating: 4.9 },
  { id: '6', name: 'Hassan Ahmad', role: 'Technician', status: 'present', checkIn: '08:00 AM', job: 'JOB-2024-002', phone: '+971501234572', email: 'hassan@homeware.com', rating: 4.7 },
  { id: '7', name: 'Layla Noor', role: 'Senior Technician', status: 'present', checkIn: '07:50 AM', job: 'JOB-2024-003', phone: '+971501234573', email: 'layla@homeware.com', rating: 4.8 },
  { id: '8', name: 'Yusuf Kareem', role: 'Technician', status: 'absent', checkIn: null, job: null, phone: '+971501234574', email: 'yusuf@homeware.com', rating: 4.4 },
];

export default function TeamPage() {
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

  const filteredTeam = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.job?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || member.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: teamMembers.length,
    present: teamMembers.filter(m => m.status === 'present').length,
    late: teamMembers.filter(m => m.status === 'late').length,
    absent: teamMembers.filter(m => m.status === 'absent').length,
    onLeave: teamMembers.filter(m => m.status === 'on-leave').length,
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-white">Team Management</h1>
              <p className="text-slate-400 mt-1">Monitor and manage your team members</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20">
              <Plus className="h-4 w-4" />
              Add Member
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <p className="text-slate-400 text-xs font-bold">Total</p>
              <p className="text-2xl font-black text-white mt-1">{stats.total}</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <p className="text-emerald-400 text-xs font-bold">Present</p>
              <p className="text-2xl font-black text-white mt-1">{stats.present}</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <p className="text-yellow-400 text-xs font-bold">Late</p>
              <p className="text-2xl font-black text-white mt-1">{stats.late}</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <p className="text-red-400 text-xs font-bold">Absent</p>
              <p className="text-2xl font-black text-white mt-1">{stats.absent}</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <p className="text-blue-400 text-xs font-bold">On Leave</p>
              <p className="text-2xl font-black text-white mt-1">{stats.onLeave}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by name, role, or job..."
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
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="absent">Absent</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>

          {/* Team List */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Check In</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Current Job</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredTeam.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-white">{member.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{member.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">{member.role}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          member.status === 'present' ? 'bg-emerald-500/20 text-emerald-400' :
                          member.status === 'late' ? 'bg-yellow-500/20 text-yellow-400' :
                          member.status === 'absent' ? 'bg-red-500/20 text-red-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {member.status === 'present' ? '✓' : member.status === 'late' ? '⚠' : member.status === 'absent' ? '✕' : '○'} {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">{member.checkIn || '-'}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{member.job || '-'}</td>
                      <td className="px-6 py-4 text-sm text-yellow-400 font-bold">★ {member.rating}</td>
                      <td className="px-6 py-4">
                        <button className="p-2 rounded hover:bg-slate-600 transition-colors text-slate-400 hover:text-emerald-400">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredTeam.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3 opacity-50" />
              <p className="text-slate-400">No team members found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
