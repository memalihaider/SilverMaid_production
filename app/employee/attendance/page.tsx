'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Clock,
  LogIn,
  LogOut,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { getSession, type SessionData } from '@/lib/auth';
import { EmployeeSidebar } from '../_components/sidebar';

interface AttendanceRecord {
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  totalHours: number;
  status: 'Present' | 'Late' | 'Absent' | 'On Leave';
}

const mockAttendanceData: AttendanceRecord[] = [
  { date: '2024-01-29', checkIn: '08:15 AM', checkOut: '05:30 PM', totalHours: 9.25, status: 'Present' },
  { date: '2024-01-28', checkIn: '08:00 AM', checkOut: '05:00 PM', totalHours: 9, status: 'Present' },
  { date: '2024-01-27', checkIn: '08:30 AM', checkOut: '05:15 PM', totalHours: 8.75, status: 'Late' },
  { date: '2024-01-26', checkIn: null, checkOut: null, totalHours: 0, status: 'On Leave' },
  { date: '2024-01-25', checkIn: '08:05 AM', checkOut: '05:10 PM', totalHours: 9.08, status: 'Present' },
  { date: '2024-01-24', checkIn: '10:30 AM', checkOut: '06:00 PM', totalHours: 7.5, status: 'Late' },
  { date: '2024-01-23', checkIn: '08:00 AM', checkOut: '05:00 PM', totalHours: 9, status: 'Present' },
  { date: '2024-01-22', checkIn: null, checkOut: null, totalHours: 0, status: 'Absent' }
];

export default function EmployeeAttendancePage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendanceData);
  const [checkedInToday, setCheckedInToday] = useState(true);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(attendance[0]);

  useEffect(() => {
    const storedSession = getSession();
    if (!storedSession || storedSession.portal !== 'employee') {
      router.push('/login/employee');
      return;
    }
    setSession(storedSession);
  }, [router]);

  const handleCheckIn = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    setTodayRecord({
      date: new Date().toLocaleDateString(),
      checkIn: timeString,
      checkOut: null,
      totalHours: 0,
      status: 'Present'
    });
    setCheckedInToday(true);
  };

  const handleCheckOut = () => {
    if (todayRecord) {
      const checkInTime = new Date(`2024-01-29 ${todayRecord.checkIn}`);
      const checkOutTime = new Date();
      const hours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
      
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      
      setTodayRecord({
        ...todayRecord,
        checkOut: timeString,
        totalHours: Math.round(hours * 100) / 100
      });
    }
  };

  const stats = {
    present: attendance.filter(a => a.status === 'Present').length,
    late: attendance.filter(a => a.status === 'Late').length,
    absent: attendance.filter(a => a.status === 'Absent').length,
    onLeave: attendance.filter(a => a.status === 'On Leave').length,
    totalHours: attendance.reduce((sum, a) => sum + a.totalHours, 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return 'bg-green-900/20 text-green-400 border-green-800';
      case 'Late': return 'bg-amber-900/20 text-amber-400 border-amber-800';
      case 'Absent': return 'bg-red-900/20 text-red-400 border-red-800';
      case 'On Leave': return 'bg-blue-900/20 text-blue-400 border-blue-800';
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
                <h1 className="text-2xl font-bold text-white">Attendance</h1>
                <p className="text-sm text-slate-400">Track your check-in and check-out</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-w-7xl mx-auto space-y-6">

          {/* Today's Status */}
          {todayRecord && (
            <div className="bg-gradient-to-r from-violet-900 to-violet-800 border border-violet-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Today's Status</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-violet-300 text-sm">Check In</p>
                  <p className="text-2xl font-bold text-white mt-1">{todayRecord.checkIn || 'Not checked in'}</p>
                </div>
                <div>
                  <p className="text-violet-300 text-sm">Check Out</p>
                  <p className="text-2xl font-bold text-white mt-1">{todayRecord.checkOut || 'Not checked out'}</p>
                </div>
                <div>
                  <p className="text-violet-300 text-sm">Total Hours</p>
                  <p className="text-2xl font-bold text-white mt-1">{todayRecord.totalHours.toFixed(2)} hrs</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCheckIn}
                  disabled={checkedInToday}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Check In
                </button>
                <button
                  onClick={handleCheckOut}
                  disabled={!checkedInToday || todayRecord.checkOut !== undefined}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Check Out
                </button>
              </div>
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm font-medium">Present</p>
              <p className="text-3xl font-bold text-green-400 mt-2">{stats.present}</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm font-medium">Late</p>
              <p className="text-3xl font-bold text-amber-400 mt-2">{stats.late}</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm font-medium">Absent</p>
              <p className="text-3xl font-bold text-red-400 mt-2">{stats.absent}</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm font-medium">On Leave</p>
              <p className="text-3xl font-bold text-blue-400 mt-2">{stats.onLeave}</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm font-medium">Total Hours</p>
              <p className="text-3xl font-bold text-violet-400 mt-2">{stats.totalHours.toFixed(0)}</p>
            </div>
          </div>

          {/* Attendance History */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white">Attendance History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-700/50">
                    <th className="text-left py-3 px-4 font-semibold text-slate-300">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-300">Check In</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-300">Check Out</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-300">Hours</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record, idx) => (
                    <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                      <td className="py-3 px-4 text-white">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-slate-300">{record.checkIn || '-'}</td>
                      <td className="py-3 px-4 text-slate-300">{record.checkOut || '-'}</td>
                      <td className="py-3 px-4 text-slate-300">{record.totalHours.toFixed(2)} hrs</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
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
