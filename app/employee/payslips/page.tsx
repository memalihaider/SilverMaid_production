'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, FileText, Download, Calendar, DollarSign } from 'lucide-react';
import { getSession, type SessionData } from '@/lib/auth';
import { EmployeeSidebar } from '../_components/sidebar';

interface Payslip {
  id: string;
  month: string;
  year: number;
  salary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  status: 'Paid' | 'Pending';
  date: string;
}

const mockPayslips: Payslip[] = [
  { id: 'PAY-2024-01', month: 'January', year: 2024, salary: 12500, bonus: 1000, deductions: 2500, netSalary: 11000, status: 'Paid', date: '2024-01-28' },
  { id: 'PAY-2023-12', month: 'December', year: 2023, salary: 12500, bonus: 2000, deductions: 2500, netSalary: 12000, status: 'Paid', date: '2023-12-28' },
  { id: 'PAY-2023-11', month: 'November', year: 2023, salary: 12500, bonus: 0, deductions: 2500, netSalary: 10000, status: 'Paid', date: '2023-11-28' },
  { id: 'PAY-2023-10', month: 'October', year: 2023, salary: 12500, bonus: 1500, deductions: 2500, netSalary: 11500, status: 'Paid', date: '2023-10-28' },
];

export default function EmployeePayslipsPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [payslips] = useState<Payslip[]>(mockPayslips);

  useEffect(() => {
    const storedSession = getSession();
    if (!storedSession || storedSession.portal !== 'employee') {
      router.push('/login/employee');
      return;
    }
    setSession(storedSession);
  }, [router]);

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
                <h1 className="text-2xl font-bold text-white">Payslips</h1>
                <p className="text-sm text-slate-400">View and download your payslips</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-7xl mx-auto space-y-6">

          {/* Payslips List */}
          <div className="space-y-4">
            {payslips.map(payslip => (
              <div key={payslip.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="w-6 h-6 text-violet-400" />
                      <div>
                        <h3 className="text-lg font-semibold text-white">{payslip.month} {payslip.year}</h3>
                        <p className="text-sm text-slate-400">Status: {payslip.status}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-violet-400">AED {payslip.netSalary.toLocaleString()}</p>
                    <p className="text-sm text-slate-400">Net Salary</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-xs text-slate-400">Base Salary</p>
                    <p className="text-lg font-semibold text-white mt-1">AED {payslip.salary.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-xs text-slate-400">Bonus</p>
                    <p className="text-lg font-semibold text-green-400 mt-1">+AED {payslip.bonus.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-xs text-slate-400">Deductions</p>
                    <p className="text-lg font-semibold text-red-400 mt-1">-AED {payslip.deductions.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center justify-end">
                    <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
