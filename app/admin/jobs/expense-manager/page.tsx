'use client'

import { useState, useMemo } from 'react'
import {
  Plus,
  Search,
  Trash2,
  Edit,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  PieChart,
  Filter,
  Download,
  X,
  Save,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface JobExpense {
  id: number
  jobId: number
  jobTitle: string
  expenseType: string
  category: 'Labor' | 'Materials' | 'Equipment' | 'Transport' | 'Other'
  amount: number
  date: string
  description: string
  approvedBy?: string
  receipt?: string
  notes: string
}

interface Job {
  id: number
  title: string
  budget: number
  status: 'Pending' | 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled'
  revenue?: number
}

const EXPENSE_CATEGORIES = ['Labor', 'Materials', 'Equipment', 'Transport', 'Other']

const SAMPLE_JOBS: Job[] = [
  { id: 1, title: 'Office Deep Cleaning - Downtown Tower', budget: 5000, status: 'In Progress', revenue: 5500 },
  { id: 2, title: 'Residential House Cleaning', budget: 3500, status: 'Scheduled', revenue: 4000 },
  { id: 3, title: 'Commercial Building Maintenance', budget: 12000, status: 'In Progress', revenue: 13000 },
  { id: 4, title: 'Garden Landscaping Project', budget: 6500, status: 'Pending', revenue: 7200 },
  { id: 5, title: 'Carpet & Upholstery Cleaning', budget: 2500, status: 'Completed', revenue: 3000 },
]

const SAMPLE_EXPENSES: JobExpense[] = [
  { id: 1, jobId: 1, jobTitle: 'Office Deep Cleaning', expenseType: 'Staff Labor', category: 'Labor', amount: 800, date: '2025-01-13', description: 'Day 1 Cleaning Staff', approvedBy: 'Ahmed Al-Mazrouei', notes: '4 workers × 8 hours' },
  { id: 2, jobId: 1, jobTitle: 'Office Deep Cleaning', expenseType: 'Cleaning Supplies', category: 'Materials', amount: 450, date: '2025-01-13', description: 'Detergents, disinfectants, paper towels', approvedBy: 'Ahmed Al-Mazrouei', notes: 'Bulk purchase' },
  { id: 3, jobId: 1, jobTitle: 'Office Deep Cleaning', expenseType: 'Equipment Rental', category: 'Equipment', amount: 300, date: '2025-01-12', description: 'Industrial vacuum rental', approvedBy: 'Ahmed Al-Mazrouei', notes: '2-day rental' },
  { id: 4, jobId: 1, jobTitle: 'Office Deep Cleaning', expenseType: 'Transport', category: 'Transport', amount: 150, date: '2025-01-13', description: 'Vehicle fuel and parking', approvedBy: 'Ahmed Al-Mazrouei', notes: 'Downtown parking fee included' },
  { id: 5, jobId: 2, jobTitle: 'Residential House Cleaning', expenseType: 'Staff Labor', category: 'Labor', amount: 600, date: '2025-01-14', description: 'Cleaning Staff', approvedBy: 'Fatima Al-Ketbi', notes: '2 workers × 8 hours' },
  { id: 6, jobId: 2, jobTitle: 'Residential House Cleaning', expenseType: 'Cleaning Supplies', category: 'Materials', amount: 200, date: '2025-01-14', description: 'Residential cleaning products', approvedBy: 'Fatima Al-Ketbi', notes: 'Eco-friendly products' },
  { id: 7, jobId: 3, jobTitle: 'Commercial Building Maintenance', expenseType: 'Staff Labor', category: 'Labor', amount: 1200, date: '2025-01-13', description: 'Maintenance Technicians', approvedBy: 'Hassan Al-Mazrouei', notes: '3 technicians × 8 hours' },
  { id: 8, jobId: 3, jobTitle: 'Commercial Building Maintenance', expenseType: 'Replacement Parts', category: 'Materials', amount: 2500, date: '2025-01-12', description: 'HVAC components replacement', approvedBy: 'Hassan Al-Mazrouei', notes: 'High-efficiency parts' },
  { id: 9, jobId: 3, jobTitle: 'Commercial Building Maintenance', expenseType: 'Permits & Licenses', category: 'Other', amount: 500, date: '2025-01-11', description: 'Work permit for building maintenance', approvedBy: 'Hassan Al-Mazrouei', notes: '' },
  { id: 10, jobId: 4, jobTitle: 'Garden Landscaping Project', expenseType: 'Materials', category: 'Materials', amount: 1800, date: '2025-01-10', description: 'Plants, soil, fertilizer', approvedBy: 'Omar Khan', notes: 'Bulk landscaping supplies' },
]

export default function ExpenseManager() {
  const [activeTab, setActiveTab] = useState<'add' | 'view' | 'analytics'>('view')
  const [expenses, setExpenses] = useState<JobExpense[]>(SAMPLE_EXPENSES)
  const [filterJobId, setFilterJobId] = useState<number | null>(null)
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterDateRange, setFilterDateRange] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingExpense, setEditingExpense] = useState<JobExpense | null>(null)

  const [formData, setFormData] = useState({
    jobId: '',
    expenseType: '',
    category: 'Materials' as 'Labor' | 'Materials' | 'Equipment' | 'Transport' | 'Other',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    approvedBy: 'Ahmed Al-Mazrouei',
    notes: ''
  })

  // Filter expenses based on all criteria
  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const matchesJob = filterJobId === null || exp.jobId === filterJobId
      const matchesCategory = filterCategory === 'all' || exp.category === filterCategory
      const matchesSearch = searchTerm === '' || 
        exp.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.expenseType.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Date range filtering
      let matchesDate = true
      if (filterDateRange !== 'all') {
        const today = new Date()
        const expenseDate = new Date(exp.date)
        const daysDiff = Math.floor((today.getTime() - expenseDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (filterDateRange === 'daily') matchesDate = daysDiff === 0
        else if (filterDateRange === 'weekly') matchesDate = daysDiff <= 7
        else if (filterDateRange === 'monthly') matchesDate = daysDiff <= 30
      }
      
      return matchesJob && matchesCategory && matchesSearch && matchesDate
    })
  }, [expenses, filterJobId, filterCategory, searchTerm, filterDateRange])

  // Calculate statistics for filtered expenses
  const stats = useMemo(() => {
    const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    const byCategory = EXPENSE_CATEGORIES.map(cat => ({
      name: cat,
      value: filteredExpenses.filter(exp => exp.category === cat).reduce((sum, exp) => sum + exp.amount, 0)
    })).filter(item => item.value > 0)
    
    const expensesByDate: { [key: string]: number } = {}
    filteredExpenses.forEach(exp => {
      const dateKey = exp.date
      expensesByDate[dateKey] = (expensesByDate[dateKey] || 0) + exp.amount
    })
    
    const chartData = Object.entries(expensesByDate)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, amount]) => ({ date, amount }))
    
    return { totalExpenses, byCategory, chartData }
  }, [filteredExpenses])

  // Calculate job-wise budget vs actual
  const jobWiseSummary = useMemo(() => {
    return SAMPLE_JOBS.map(job => {
      const jobExpenses = expenses.filter(exp => exp.jobId === job.id)
      const totalExpense = jobExpenses.reduce((sum, exp) => sum + exp.amount, 0)
      const remaining = job.budget - totalExpense
      const revenue = job.revenue || 0
      const profit = revenue - totalExpense
      const profitMargin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : 0
      
      return {
        ...job,
        totalExpense,
        remaining,
        profit,
        profitMargin: parseFloat(profitMargin as string),
        expenseCount: jobExpenses.length
      }
    })
  }, [expenses])

  const handleAddExpense = () => {
    if (!formData.jobId || !formData.expenseType || !formData.amount) {
      alert('Please fill in all required fields')
      return
    }

    if (editingExpense) {
      setExpenses(expenses.map(exp =>
        exp.id === editingExpense.id
          ? {
              ...exp,
              jobId: parseInt(formData.jobId),
              jobTitle: SAMPLE_JOBS.find(j => j.id === parseInt(formData.jobId))?.title || '',
              expenseType: formData.expenseType,
              category: formData.category,
              amount: parseFloat(formData.amount),
              date: formData.date,
              description: formData.description,
              approvedBy: formData.approvedBy,
              notes: formData.notes
            }
          : exp
      ))
      setEditingExpense(null)
    } else {
      const newExpense: JobExpense = {
        id: Math.max(...expenses.map(e => e.id), 0) + 1,
        jobId: parseInt(formData.jobId),
        jobTitle: SAMPLE_JOBS.find(j => j.id === parseInt(formData.jobId))?.title || '',
        expenseType: formData.expenseType,
        category: formData.category,
        amount: parseFloat(formData.amount),
        date: formData.date,
        description: formData.description,
        approvedBy: formData.approvedBy,
        notes: formData.notes
      }
      setExpenses([...expenses, newExpense])
    }

    setFormData({
      jobId: '',
      expenseType: '',
      category: 'Materials',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      approvedBy: 'Ahmed Al-Mazrouei',
      notes: ''
    })
    alert('Expense ' + (editingExpense ? 'updated' : 'added') + ' successfully!')
  }

  const handleEditExpense = (expense: JobExpense) => {
    setEditingExpense(expense)
    setFormData({
      jobId: expense.jobId.toString(),
      expenseType: expense.expenseType,
      category: expense.category,
      amount: expense.amount.toString(),
      date: expense.date,
      description: expense.description,
      approvedBy: expense.approvedBy || 'Ahmed Al-Mazrouei',
      notes: expense.notes
    })
    setActiveTab('add')
  }

  const handleDeleteExpense = (id: number) => {
    if (confirm('Delete this expense record?')) {
      setExpenses(expenses.filter(exp => exp.id !== id))
    }
  }

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#111111']

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-500 to-teal-600 p-8 md:p-12 text-white shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
            <span className="text-white/80 font-bold text-sm uppercase tracking-wider">Job Management</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Job Expense Manager</h1>
          <p className="text-white/90 mt-3 text-lg font-medium max-w-2xl">
            Track all job-related expenses by category and date. Calculate profit, loss, and budget utilization
          </p>
        </div>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-white/10 blur-[100px]"></div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 bg-white p-4 rounded-2xl border border-gray-200 shadow-md">
        {[
          { id: 'add' as const, label: '➕ Add Expense' },
          { id: 'view' as const, label: '📋 View Expenses' },
          { id: 'analytics' as const, label: '📊 Analytics' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ==================== ADD EXPENSE TAB ==================== */}
      {activeTab === 'add' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <Plus className="h-6 w-6 text-emerald-600" />
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Job *</label>
              <select
                value={formData.jobId}
                onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select a Job...</option>
                {SAMPLE_JOBS.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.title} (Budget: AED {job.budget.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Expense Type *</label>
              <input
                type="text"
                value={formData.expenseType}
                onChange={(e) => setFormData({ ...formData, expenseType: e.target.value })}
                placeholder="e.g., Labor, Supplies, Equipment"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as 'Labor' | 'Materials' | 'Equipment' | 'Transport' | 'Other' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {EXPENSE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Amount (AED) *</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Approved By</label>
              <input
                type="text"
                value={formData.approvedBy}
                onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })}
                placeholder="Manager name"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the expense"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={handleAddExpense}
              className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Save className="h-5 w-5" />
              {editingExpense ? 'Update Expense' : 'Add Expense'}
            </button>
            {editingExpense && (
              <button
                onClick={() => {
                  setEditingExpense(null)
                  setFormData({
                    jobId: '',
                    expenseType: '',
                    category: 'Materials',
                    amount: '',
                    date: new Date().toISOString().split('T')[0],
                    description: '',
                    approvedBy: 'Ahmed Al-Mazrouei',
                    notes: ''
                  })
                }}
                className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <X className="h-5 w-5" />
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* ==================== VIEW EXPENSES TAB ==================== */}
      {activeTab === 'view' && (
        <>
          {/* Filters */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Filter by Job</label>
                <select
                  value={filterJobId || ''}
                  onChange={(e) => setFilterJobId(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">All Jobs</option>
                  {SAMPLE_JOBS.map(job => (
                    <option key={job.id} value={job.id}>{job.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Filter by Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Categories</option>
                  {EXPENSE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Time Range</label>
                <select
                  value={filterDateRange}
                  onChange={(e) => setFilterDateRange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Time</option>
                  <option value="daily">Today</option>
                  <option value="weekly">This Week</option>
                  <option value="monthly">This Month</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search expenses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Total Expenses</p>
                  <p className="text-3xl font-black text-emerald-600 mt-2">AED {stats.totalExpenses.toLocaleString()}</p>
                </div>
                <DollarSign className="h-10 w-10 text-emerald-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Expense Count</p>
                  <p className="text-3xl font-black text-zinc-950 mt-2">{filteredExpenses.length}</p>
                </div>
                <AlertCircle className="h-10 w-10 text-zinc-950 opacity-20" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Average Expense</p>
                  <p className="text-3xl font-black text-amber-600 mt-2">
                    AED {filteredExpenses.length > 0 ? (stats.totalExpenses / filteredExpenses.length).toFixed(0) : 0}
                  </p>
                </div>
                <BarChart3 className="h-10 w-10 text-amber-600 opacity-20" />
              </div>
            </div>
          </div>

          {/* Expenses Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Job</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Approved By</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map(expense => (
                      <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-700">{expense.date}</td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900 text-sm">{expense.jobTitle}</div>
                          <div className="text-xs text-gray-500">{expense.description}</div>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-700">{expense.expenseType}</td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold bg-zinc-100 text-zinc-950 border border-blue-300">
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-black text-emerald-600">AED {expense.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{expense.approvedBy || '—'}</td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => handleEditExpense(expense)}
                            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-950"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500 font-semibold">
                        No expenses found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ==================== ANALYTICS TAB ==================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Expenses by Category Chart */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-md">
            <h3 className="text-xl font-black text-gray-900 mb-6">📊 Expenses by Category</h3>
            {stats.byCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={stats.byCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: AED ${value.toLocaleString()}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.byCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `AED ${value.toLocaleString()}`} />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-8">No data available</p>
            )}
          </div>

          {/* Expenses Over Time Chart */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-md">
            <h3 className="text-xl font-black text-gray-900 mb-6">📈 Expenses Over Time</h3>
            {stats.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => `AED ${value.toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#10b981" name="Expense Amount" strokeWidth={2} dot={{ fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-8">No data available</p>
            )}
          </div>

          {/* Job-wise Budget vs Actual */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
            <div className="p-8 border-b border-gray-200">
              <h3 className="text-xl font-black text-gray-900">💼 Job-wise Budget Analysis</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Job Title</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Budget</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Total Expenses</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Remaining</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Revenue</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Profit/Loss</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Margin %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {jobWiseSummary.map(job => (
                    <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 text-sm">{job.title}</div>
                        <div className="text-xs text-gray-500">{job.expenseCount} expenses</div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-700">AED {job.budget.toLocaleString()}</td>
                      <td className="px-6 py-4 font-semibold text-amber-600">AED {job.totalExpense.toLocaleString()}</td>
                      <td className="px-6 py-4 font-semibold text-gray-700">AED {job.remaining.toLocaleString()}</td>
                      <td className="px-6 py-4 font-semibold text-gray-700">AED {(job.revenue || 0).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`font-black text-sm ${job.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          AED {job.profit >= 0 ? '+' : ''}{job.profit.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border ${
                          job.profitMargin >= 20 ? 'bg-emerald-100 text-emerald-700 border-emerald-300' :
                          job.profitMargin >= 10 ? 'bg-zinc-100 text-zinc-950 border-blue-300' :
                          job.profitMargin >= 0 ? 'bg-amber-100 text-amber-700 border-amber-300' :
                          'bg-red-100 text-red-700 border-red-300'
                        }`}>
                          {job.profitMargin}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Category Breakdown Bar Chart */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-md">
            <h3 className="text-xl font-black text-gray-900 mb-6">📊 Expense Distribution</h3>
            {stats.byCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.byCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => `AED ${value.toLocaleString()}`} />
                  <Bar dataKey="value" fill="#10b981" name="Amount (AED)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-8">No data available</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
