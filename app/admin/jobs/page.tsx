'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  Users,
  Trash2,
  CheckCircle,
  Clock,
  X,
  Briefcase,
  DollarSign,
  Camera,
  Play,
  Eye,
  Bell,
  BellOff,
  ShoppingCart,
  Edit,
  Zap,
  AlertTriangle,
  Check,
  TrendingUp,
  UserPlus,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, where, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

interface Job {
  id: string
  title: string
  client: string
  clientId: string
  status: 'Pending' | 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled'
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  scheduledDate: string | null
  scheduledTime?: string
  endTime?: string
  location: string
  teamRequired: number
  budget: number
  actualCost: number
  description: string
  riskLevel: 'Low' | 'Medium' | 'High'
  slaDeadline?: string
  estimatedDuration: string
  requiredSkills: string[]
  permits: string[]
  tags: string[]
  specialInstructions?: string
  recurring: boolean
  createdAt: string
  updatedAt: string
  completedAt?: string
  executionLogs: any[]
  assignedTo: string[]
  assignedEmployees: { id: string; name: string; email: string }[]
  reminderEnabled?: boolean
  reminderDate?: string
  reminderSent?: boolean
  services?: JobService[]
  overtimeRequired?: boolean
  overtimeHours?: number
  overtimeReason?: string
  overtimeApproved?: boolean
}

interface JobService {
  id: string
  name: string
  quantity: number
  unitPrice: number
  total: number
  description?: string
}

interface Employee {
  id: string
  name: string
  email: string
  department: string
  position: string
  status: string
}

interface NewJobForm {
  title: string
  client: string
  clientId: string | null
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  scheduledDate: string
  scheduledTime: string
  endTime: string
  location: string
  teamRequired: number
  budget: number
  description: string
  riskLevel: 'Low' | 'Medium' | 'High'
  slaDeadline: string
  estimatedDuration: string
  requiredSkills: string
  permits: string
  tags: string
  specialInstructions: string
  recurring: boolean
  selectedEmployees: string[]
  services?: JobService[]
}

export default function JobsPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [showNewJobModal, setShowNewJobModal] = useState(false)
  const [showExecutionModal, setShowExecutionModal] = useState(false)
  const [selectedJobForExecution, setSelectedJobForExecution] = useState<Job | null>(null)
  const [executionChecklist, setExecutionChecklist] = useState<string[]>([])
  const [executionNotes, setExecutionNotes] = useState('')
  const [editingJobId, setEditingJobId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [newJobForm, setNewJobForm] = useState<NewJobForm>({
    title: '',
    client: '',
    clientId: null,
    priority: 'Medium',
    scheduledDate: '',
    scheduledTime: '',
    endTime: '',
    location: '',
    teamRequired: 1,
    budget: 0,
    description: '',
    riskLevel: 'Low',
    slaDeadline: '',
    estimatedDuration: '',
    requiredSkills: '',
    permits: '',
    tags: '',
    specialInstructions: '',
    recurring: false,
    selectedEmployees: [],
    services: []
  })

  // Fetch jobs, employees, and clients from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch jobs
        const jobsQuery = query(collection(db, 'jobs'))
        const jobsSnapshot = await getDocs(jobsQuery)
        
        const jobsData = jobsSnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            title: data.title || '',
            client: data.client || '',
            clientId: data.clientId || '',
            status: data.status || 'Pending',
            priority: data.priority || 'Medium',
            scheduledDate: data.scheduledDate || null,
            scheduledTime: data.scheduledTime || '',
            endTime: data.endTime || '',
            location: data.location || '',
            teamRequired: data.teamRequired || 1,
            budget: data.budget || 0,
            actualCost: data.actualCost || 0,
            description: data.description || '',
            riskLevel: data.riskLevel || 'Low',
            slaDeadline: data.slaDeadline || '',
            estimatedDuration: data.estimatedDuration || '',
            requiredSkills: data.requiredSkills || [],
            permits: data.permits || [],
            tags: data.tags || [],
            specialInstructions: data.specialInstructions || '',
            recurring: data.recurring || false,
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString(),
            completedAt: data.completedAt || '',
            executionLogs: data.executionLogs || [],
            assignedTo: data.assignedTo || [],
            assignedEmployees: data.assignedEmployees || [],
            reminderEnabled: data.reminderEnabled || false,
            reminderDate: data.reminderDate || '',
            reminderSent: data.reminderSent || false,
            services: data.services || [],
            overtimeRequired: data.overtimeRequired || false,
            overtimeHours: data.overtimeHours || 0,
            overtimeReason: data.overtimeReason || '',
            overtimeApproved: data.overtimeApproved || false
          } as Job
        })
        
        setJobs(jobsData)

        // Fetch employees
        const employeesQuery = query(collection(db, 'employees'), where('status', '==', 'Active'))
        const employeesSnapshot = await getDocs(employeesQuery)
        
        const employeesData = employeesSnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            name: data.name || '',
            email: data.email || '',
            department: data.department || '',
            position: data.position || '',
            status: data.status || 'Active'
          } as Employee
        })
        
        setEmployees(employeesData)

        // Fetch clients
        const clientsQuery = query(collection(db, 'clients'))
        const clientsSnapshot = await getDocs(clientsQuery)
        
        const clientsData = clientsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        setClients(clientsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  // ========== EDIT FUNCTION ==========
  const handleEditJob = async (jobId: string) => {
    try {
      setLoading(true)
      const jobDoc = doc(db, 'jobs', jobId)
      const jobSnapshot = await getDoc(jobDoc)
      
      if (jobSnapshot.exists()) {
        const jobData = jobSnapshot.data()
        
        setNewJobForm({
          title: jobData.title || '',
          client: jobData.client || '',
          clientId: jobData.clientId || null,
          priority: jobData.priority || 'Medium',
          scheduledDate: jobData.scheduledDate || '',
          scheduledTime: jobData.scheduledTime || '',
          endTime: jobData.endTime || '',
          location: jobData.location || '',
          teamRequired: jobData.teamRequired || 1,
          budget: jobData.budget || 0,
          description: jobData.description || '',
          riskLevel: jobData.riskLevel || 'Low',
          slaDeadline: jobData.slaDeadline || '',
          estimatedDuration: jobData.estimatedDuration || '',
          requiredSkills: jobData.requiredSkills?.join(', ') || '',
          permits: jobData.permits?.join(', ') || '',
          tags: jobData.tags?.join(', ') || '',
          specialInstructions: jobData.specialInstructions || '',
          recurring: jobData.recurring || false,
          selectedEmployees: jobData.assignedEmployees?.map((emp: any) => emp.id) || [],
          services: jobData.services || []
        })
        
        setEditingJobId(jobId)
        setShowNewJobModal(true)
      }
    } catch (error) {
      console.error('Error fetching job for edit:', error)
      alert('Error loading job details')
    } finally {
      setLoading(false)
    }
  }

  // ========== VIEW FUNCTION ==========
  const handleViewJob = (jobId: string) => {
    router.push(`/admin/jobs/${jobId}`)
  }

  // ========== DELETE FUNCTION ==========
  const handleDeleteJob = async (jobId: string) => {
    try {
      setLoading(true)
      
      // Delete from Firebase
      const jobRef = doc(db, 'jobs', jobId)
      await deleteDoc(jobRef)
      
      // Update local state
      setJobs(jobs.filter(j => j.id !== jobId))
      setShowDeleteConfirm(null)
      alert('Job deleted successfully!')
    } catch (error) {
      console.error('Error deleting job:', error)
      alert('Error deleting job. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ========== SAVE/UPDATE FUNCTION ==========
  const handleSaveJob = useCallback(async () => {
    if (!newJobForm.title || !newJobForm.client || !newJobForm.location) {
      alert('Please fill in all required fields: Title, Client, and Location')
      return
    }

    try {
      setLoading(true)
      
      // Get selected employees details
      const selectedEmployeesDetails = employees
        .filter(emp => newJobForm.selectedEmployees.includes(emp.id))
        .map(emp => ({
          id: emp.id,
          name: emp.name,
          email: emp.email
        }))

      const jobData = {
        title: newJobForm.title,
        client: newJobForm.client,
        clientId: newJobForm.clientId || '',
        priority: newJobForm.priority,
        scheduledDate: newJobForm.scheduledDate || null,
        scheduledTime: newJobForm.scheduledTime,
        endTime: newJobForm.endTime,
        location: newJobForm.location,
        teamRequired: newJobForm.teamRequired,
        budget: newJobForm.budget,
        description: newJobForm.description,
        riskLevel: newJobForm.riskLevel,
        slaDeadline: newJobForm.slaDeadline,
        estimatedDuration: newJobForm.estimatedDuration,
        requiredSkills: newJobForm.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
        permits: newJobForm.permits.split(',').map(s => s.trim()).filter(s => s),
        tags: newJobForm.tags.split(',').map(s => s.trim()).filter(s => s),
        specialInstructions: newJobForm.specialInstructions,
        recurring: newJobForm.recurring,
        services: newJobForm.services || [],
        updatedAt: new Date().toISOString(),
        assignedTo: selectedEmployeesDetails.map(emp => emp.name),
        assignedEmployees: selectedEmployeesDetails,
        actualCost: 0,
        reminderEnabled: false
      }

      if (editingJobId) {
        // Update existing job in Firebase
        const jobRef = doc(db, 'jobs', editingJobId)
        await updateDoc(jobRef, jobData)
        
        // Update local state
        setJobs(jobs.map(j =>
          j.id === editingJobId
            ? { ...j, ...jobData, id: editingJobId }
            : j
        ))
        alert('Job updated successfully!')
      } else {
        // Create new job in Firebase
        const newJobData = {
          ...jobData,
          status: 'Pending',
          createdAt: new Date().toISOString(),
          completedAt: '',
          executionLogs: [],
          reminderSent: false,
          overtimeRequired: false,
          overtimeHours: 0,
          overtimeReason: '',
          overtimeApproved: false
        }

        const docRef = await addDoc(collection(db, 'jobs'), newJobData)
        
        // Add to local state with Firestore ID
        const newJob: Job = {
          id: docRef.id,
          ...newJobData
        } as Job
        
        setJobs([...jobs, newJob])
        alert('Job created successfully!')
      }
      
      setShowNewJobModal(false)
      setEditingJobId(null)
    } catch (error) {
      console.error('Error saving job:', error)
      alert('Error saving job. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [newJobForm, jobs, editingJobId, employees])

  // Calculate statistics
  const stats = useMemo(() => ({
    total: jobs.length,
    pending: jobs.filter(j => j.status === 'Pending').length,
    scheduled: jobs.filter(j => j.status === 'Scheduled').length,
    inProgress: jobs.filter(j => j.status === 'In Progress').length,
    completed: jobs.filter(j => j.status === 'Completed').length,
    totalBudget: jobs.reduce((sum, j) => sum + j.budget, 0),
    totalActualCost: jobs.reduce((sum, j) => sum + j.actualCost, 0),
    critical: jobs.filter(j => j.priority === 'Critical').length
  }), [jobs])

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.location.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || job.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || job.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [jobs, searchTerm, statusFilter, priorityFilter])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-zinc-950 text-white border-zinc-950'
      case 'High': return 'bg-white text-zinc-950 border-zinc-200'
      case 'Medium': return 'bg-zinc-50 text-zinc-600 border-zinc-100'
      default: return 'bg-zinc-50 text-zinc-400 border-zinc-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100'
      case 'In Progress': return 'bg-zinc-950 text-white border-zinc-950'
      case 'Scheduled': return 'bg-zinc-50 text-zinc-900 border-zinc-200'
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-100'
      case 'Cancelled': return 'bg-zinc-100 text-zinc-400 border-zinc-200'
      default: return 'bg-zinc-50 text-zinc-400 border-zinc-100'
    }
  }

  const handleAddJob = () => {
    setEditingJobId(null)
    setNewJobForm({
      title: '',
      client: '',
      clientId: null,
      priority: 'Medium',
      scheduledDate: '',
      scheduledTime: '',
      endTime: '',
      location: '',
      teamRequired: 1,
      budget: 0,
      description: '',
      riskLevel: 'Low',
      slaDeadline: '',
      estimatedDuration: '',
      requiredSkills: '',
      permits: '',
      tags: '',
      specialInstructions: '',
      recurring: false,
      selectedEmployees: [],
      services: []
    })
    setShowNewJobModal(true)
  }

  const handleToggleReminder = useCallback(async (jobId: string) => {
    try {
      const job = jobs.find(j => j.id === jobId)
      if (!job) return

      const newReminderEnabled = !job.reminderEnabled
      let reminderDate = job.reminderDate
      
      if (newReminderEnabled && job.scheduledDate) {
        const reminder = new Date(job.scheduledDate + 'T00:00:00')
        reminder.setDate(reminder.getDate() - 1)
        reminderDate = reminder.toISOString().split('T')[0]
      }

      // Update in Firebase
      const jobRef = doc(db, 'jobs', jobId)
      await updateDoc(jobRef, {
        reminderEnabled: newReminderEnabled,
        reminderDate: reminderDate
      })

      // Update local state
      setJobs(jobs.map(j => {
        if (j.id === jobId) {
          return {
            ...j,
            reminderEnabled: newReminderEnabled,
            reminderDate: reminderDate
          }
        }
        return j
      }))
    } catch (error) {
      console.error('Error updating reminder:', error)
      alert('Error updating reminder')
    }
  }, [jobs])

  const handleUpdateJobStatus = useCallback(async (jobId: string, newStatus: Job['status']) => {
    try {
      // Update in Firebase
      const jobRef = doc(db, 'jobs', jobId)
      await updateDoc(jobRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      })

      // Update local state
      setJobs(jobs.map(j =>
        j.id === jobId
          ? { ...j, status: newStatus, updatedAt: new Date().toISOString() }
          : j
      ))
      alert(`Job status updated to ${newStatus}`)
    } catch (error) {
      console.error('Error updating job status:', error)
      alert('Error updating job status')
    }
  }, [jobs])

  const handleStartExecution = (job: Job) => {
    setSelectedJobForExecution(job)
    setExecutionChecklist([])
    setExecutionNotes('')
    setShowExecutionModal(true)
  }

  const handleLogExecution = async () => {
    if (!selectedJobForExecution) return
    
    try {
      // Update job status in Firebase
      const jobRef = doc(db, 'jobs', selectedJobForExecution.id)
      await updateDoc(jobRef, {
        status: 'In Progress',
        updatedAt: new Date().toISOString()
      })

      // Add execution log
      const executionLog = {
        timestamp: new Date().toISOString(),
        checklist: executionChecklist,
        notes: executionNotes,
        type: 'execution_started'
      }

      await updateDoc(jobRef, {
        executionLogs: [...selectedJobForExecution.executionLogs, executionLog]
      })

      // Update local state
      handleUpdateJobStatus(selectedJobForExecution.id, 'In Progress')
      setShowExecutionModal(false)
    } catch (error) {
      console.error('Error logging execution:', error)
      alert('Error logging execution')
    }
  }

  const toggleEmployeeSelection = (employeeId: string) => {
    setNewJobForm(prev => {
      if (prev.selectedEmployees.includes(employeeId)) {
        return {
          ...prev,
          selectedEmployees: prev.selectedEmployees.filter(id => id !== employeeId)
        }
      } else {
        // Check if we can add more employees based on teamRequired
        if (prev.selectedEmployees.length >= prev.teamRequired) {
          alert(`Maximum ${prev.teamRequired} employees can be assigned to this job. Please increase team size or remove existing selections.`)
          return prev
        }
        return {
          ...prev,
          selectedEmployees: [...prev.selectedEmployees, employeeId]
        }
      }
    })
  }

  // Get selected employee names for display
  const getSelectedEmployeeNames = () => {
    return newJobForm.selectedEmployees.map(empId => {
      const emp = employees.find(e => e.id === empId)
      return emp ? emp.name : ''
    }).filter(name => name)
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Management</h1>
        <p className="text-gray-600">Manage, track, and execute cleaning jobs in real-time</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Registry', val: stats.total, icon: Briefcase, color: 'text-zinc-600', bg: 'bg-zinc-100' },
          { label: 'Active Tasks', val: stats.inProgress, icon: Clock, color: 'text-zinc-950', bg: 'bg-zinc-100' },
          { label: 'Completed', val: stats.completed, icon: CheckCircle, color: 'text-zinc-950', bg: 'bg-zinc-100' },
          { label: 'Budget Utilization', val: `${stats.totalBudget > 0 ? ((stats.totalActualCost / stats.totalBudget) * 100).toFixed(0) : '0'}%`, icon: DollarSign, color: 'text-zinc-950', bg: 'bg-zinc-100' }
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-zinc-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-zinc-950 mt-1 tracking-tighter">{stat.val}</p>
              </div>
              <div className={`h-10 w-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-3 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search registry..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:ring-1 focus:ring-zinc-950 focus:border-transparent outline-none transition-all placeholder:text-zinc-400 font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-600 focus:ring-1 focus:ring-zinc-950 outline-none transition-all cursor-pointer"
            >
              <option value="all">Status: All</option>
              <option value="Pending">Pending</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-600 focus:ring-1 focus:ring-zinc-950 outline-none transition-all cursor-pointer"
            >
              <option value="all">Priority: All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>

            <button
              onClick={handleAddJob}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-950 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              New Job
            </button>

            <Link href="/admin/jobs/expense-manager">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-50 transition-all active:scale-95">
                <DollarSign className="w-3.5 h-3.5" />
                Expenses
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-2">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job.id} className="bg-white border border-zinc-100 rounded-xl p-3 hover:shadow-lg transition-all group overflow-hidden relative">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Link href={`/admin/jobs/${job.id}`} className="block">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0 pr-4">
                        <h3 className="font-black text-zinc-950 tracking-tight text-base truncate group-hover:text-zinc-600 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-0.5">{job.client}</p>
                      </div>
                      <div className="flex gap-1.5 flex-wrap justify-end shrink-0">
                        <span className={`text-[9px] font-black px-2.5 py-1 uppercase tracking-wider border rounded-lg shadow-sm ${getPriorityColor(job.priority)}`}>
                          {job.priority}
                        </span>
                        <span className={`text-[9px] font-black px-2.5 py-1 uppercase tracking-wider border rounded-lg shadow-sm ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                        {job.overtimeRequired && (
                          <span className={`text-[9px] font-black px-2.5 py-1 uppercase tracking-wider border rounded-lg shadow-sm flex items-center gap-1 ${job.overtimeApproved ? 'bg-zinc-950 text-white border-zinc-900' : 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}>
                            <Zap className="h-2.5 w-2.5" /> OT {job.overtimeHours}H
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-zinc-50 rounded-lg border border-zinc-100">
                           <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                        </div>
                        <div className="min-w-0">
                           <p className="text-[8px] font-black text-zinc-400 uppercase tracking-tighter leading-none mb-1">Schedule</p>
                           <p className="text-[10px] font-bold text-zinc-900 truncate">
                             {job.scheduledDate ? new Date(job.scheduledDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Pending'}
                           </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-zinc-50 rounded-lg border border-zinc-100">
                           <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                        </div>
                        <div className="min-w-0">
                           <p className="text-[8px] font-black text-zinc-400 uppercase tracking-tighter leading-none mb-1">Location</p>
                           <p className="text-[10px] font-bold text-zinc-900 truncate">{job.location}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-zinc-50 rounded-lg border border-zinc-100">
                           <Users className="h-3.5 w-3.5 text-zinc-400" />
                        </div>
                        <div className="min-w-0">
                           <p className="text-[8px] font-black text-zinc-400 uppercase tracking-tighter leading-none mb-1">Team</p>
                           <p className="text-[10px] font-bold text-zinc-900">{job.teamRequired}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-zinc-50 rounded-lg border border-zinc-100">
                           <DollarSign className="h-3.5 w-3.5 text-zinc-400" />
                        </div>
                        <div className="min-w-0">
                           <p className="text-[8px] font-black text-zinc-400 uppercase tracking-tighter leading-none mb-1">Budget</p>
                           <p className="text-[10px] font-bold text-zinc-900 truncate">AED {job.budget.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Footer Section */}
                  <div className="mt-4 pt-3 border-t border-zinc-50 flex items-center justify-between">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {job.assignedEmployees?.map((employee, idx) => (
                        <div 
                          key={employee.id} 
                          className="h-6 w-6 rounded-full bg-zinc-950 border-2 border-white flex items-center justify-center text-[9px] font-black text-white"
                          title={employee.name}
                        >
                          {employee.name.charAt(0)}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                       <button 
                         onClick={() => {
                           setSelectedJobForExecution(job)
                           setShowExecutionModal(true)
                         }}
                         className="text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors"
                       >
                         Sync Status
                       </button>
                       <Link 
                         href={`/admin/jobs/${job.id}/edit`}
                         className="text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors"
                       >
                         Edit
                       </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))

                  {/* Action Buttons - INCLUDING EDIT, VIEW, DELETE */}
                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
                    {/* EDIT BUTTON */}
                    <button
                      onClick={() => handleEditJob(job.id)}
                      className="text-xs px-3 py-1.5 bg-zinc-100 text-zinc-950 rounded-lg hover:bg-blue-200 transition-colors font-medium flex items-center gap-1"
                      disabled={loading}
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </button>

                    {/* VIEW BUTTON */}
                    <button
                      onClick={() => handleViewJob(job.id)}
                      className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium flex items-center gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      View Details
                    </button>

                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => setShowDeleteConfirm(job.id)}
                      className="text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium flex items-center gap-1"
                      disabled={loading}
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>

                    {/* Existing Action Buttons */}
                    {job.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateJobStatus(job.id, 'Scheduled')}
                          className="text-xs px-3 py-1.5 bg-zinc-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium"
                        >
                          Schedule
                        </button>
                      </>
                    )}

                    {(job.status === 'Scheduled' || job.status === 'In Progress') && (
                      <>
                        <button
                          onClick={() => handleToggleReminder(job.id)}
                          className={`text-xs px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1 ${
                            job.reminderEnabled
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {job.reminderEnabled ? (
                            <>
                              <Bell className="h-3 w-3" />
                              Reminder Set
                            </>
                          ) : (
                            <>
                              <BellOff className="h-3 w-3" />
                              Set Reminder
                            </>
                          )}
                        </button>
                      </>
                    )}

                    {job.reminderEnabled && job.reminderDate && (
                      <div className="text-xs px-2 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Reminder: {new Date(job.reminderDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    )}

                    {job.status === 'Scheduled' && (
                      <>
                        <button
                          onClick={() => handleStartExecution(job)}
                          className="text-xs px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors font-medium flex items-center gap-1"
                        >
                          <Play className="h-3 w-3" />
                          Execute
                        </button>
                        <button
                          onClick={() => handleUpdateJobStatus(job.id, 'In Progress')}
                          className="text-xs px-3 py-1.5 bg-zinc-100 text-zinc-950 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                        >
                          Start
                        </button>
                      </>
                    )}

                    {job.status === 'In Progress' && (
                      <>
                        <button
                          onClick={() => handleStartExecution(job)}
                          className="text-xs px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors font-medium flex items-center gap-1"
                        >
                          <Camera className="h-3 w-3" />
                          On Site
                        </button>
                        <button
                          onClick={() => handleUpdateJobStatus(job.id, 'Completed')}
                          className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium flex items-center gap-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Complete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-900">No jobs found</p>
            <p className="text-sm text-gray-600">Try adjusting your filters or create a new job</p>
          </div>
        )}
      </div>

      {/* New Job/Edit Modal */}
      {showNewJobModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-40" onClick={() => { setShowNewJobModal(false); setEditingJobId(null) }}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-zinc-950 to-zinc-950 text-white px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{editingJobId ? 'Edit Job' : 'Create New Job'}</h2>
                <p className="text-zinc-100 text-sm mt-1">Complete all job details</p>
              </div>
              <button onClick={() => { setShowNewJobModal(false); setEditingJobId(null) }} className="text-zinc-100 hover:text-white transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4 border-b pb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-zinc-950" />
                  Basic Information
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Job Title *</label>
                    <input
                      type="text"
                      value={newJobForm.title}
                      onChange={(e) => setNewJobForm({...newJobForm, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-500 outline-none"
                      placeholder="e.g., Office Deep Cleaning"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Client *</label>
                    <select
                      value={newJobForm.clientId || ''}
                      onChange={(e) => {
                        const selected = clients.find(c => c.id === e.target.value)
                        setNewJobForm({
                          ...newJobForm,
                          clientId: selected?.id || null,
                          client: selected?.name || ''
                        })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-500 outline-none"
                    >
                      <option value="">Select a client</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                    {newJobForm.clientId === null && newJobForm.client && (
                      <p className="text-sm text-gray-500 mt-1">Client will be saved as: {newJobForm.client}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Description *</label>
                  <textarea
                    value={newJobForm.description}
                    onChange={(e) => setNewJobForm({...newJobForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-500 outline-none"
                    rows={3}
                    placeholder="Detailed job description..."
                  />
                </div>
              </div>

              {/* Team Assignment Section */}
              <div className="space-y-4 border-b pb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-zinc-950" />
                    Assign Team Members
                  </h3>
                  <span className="text-sm font-medium text-gray-600">
                    Selected: {newJobForm.selectedEmployees.length} of {newJobForm.teamRequired}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Team Size Required *</label>
                    <input
                      type="number"
                      value={newJobForm.teamRequired}
                      onChange={(e) => {
                        const newSize = parseInt(e.target.value) || 1
                        setNewJobForm({
                          ...newJobForm,
                          teamRequired: newSize,
                          selectedEmployees: newJobForm.selectedEmployees.slice(0, newSize)
                        })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-500 outline-none"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Selected Members</label>
                    <div className="p-2 bg-gray-50 rounded-lg border border-gray-300 min-h-[42px]">
                      {getSelectedEmployeeNames().length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {getSelectedEmployeeNames().map((name, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-100 text-blue-800 text-xs rounded-md">
                              {name}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const empId = newJobForm.selectedEmployees[idx]
                                  toggleEmployeeSelection(empId)
                                }}
                                className="hover:text-blue-900"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No employees selected</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Employees List */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">Select Employees</label>
                  <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg">
                    {employees.length > 0 ? (
                      employees.map(employee => (
                        <label
                          key={employee.id}
                          className={`flex items-center gap-3 p-3 border-b cursor-pointer hover:bg-gray-50 ${
                            newJobForm.selectedEmployees.includes(employee.id) ? 'bg-zinc-50' : ''
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={newJobForm.selectedEmployees.includes(employee.id)}
                            onChange={() => toggleEmployeeSelection(employee.id)}
                            className="w-4 h-4 rounded text-zinc-950"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{employee.name}</p>
                            <p className="text-xs text-gray-500">{employee.position} • {employee.department}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            employee.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {employee.status}
                          </span>
                        </label>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p>No active employees found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Location & Priority */}
              <div className="space-y-4 border-b pb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-zinc-950" />
                  Location & Priority
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Location *</label>
                  <input
                    type="text"
                    value={newJobForm.location}
                    onChange={(e) => setNewJobForm({...newJobForm, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-500 outline-none"
                    placeholder="Enter job location"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Priority *</label>
                    <select
                      value={newJobForm.priority}
                      onChange={(e) => setNewJobForm({...newJobForm, priority: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-500 outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Risk Level *</label>
                    <select
                      value={newJobForm.riskLevel}
                      onChange={(e) => setNewJobForm({...newJobForm, riskLevel: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-500 outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Scheduling */}
              <div className="space-y-4 border-b pb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-zinc-950" />
                  Scheduling
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Scheduled Date</label>
                  <input
                    type="date"
                    value={newJobForm.scheduledDate}
                    onChange={(e) => setNewJobForm({...newJobForm, scheduledDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={newJobForm.scheduledTime}
                      onChange={(e) => setNewJobForm({...newJobForm, scheduledTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">End Time</label>
                    <input
                      type="time"
                      value={newJobForm.endTime}
                      onChange={(e) => setNewJobForm({...newJobForm, endTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Estimated Duration</label>
                    <input
                      type="text"
                      value={newJobForm.estimatedDuration}
                      onChange={(e) => setNewJobForm({...newJobForm, estimatedDuration: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-500 outline-none"
                      placeholder="e.g., 8 hours"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">SLA Deadline</label>
                    <input
                      type="date"
                      value={newJobForm.slaDeadline}
                      onChange={(e) => setNewJobForm({...newJobForm, slaDeadline: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Resources & Budget */}
              <div className="space-y-4 border-b pb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-zinc-950" />
                  Resources & Budget
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Budget (AED) *</label>
                  <input
                    type="number"
                    value={newJobForm.budget}
                    onChange={(e) => setNewJobForm({...newJobForm, budget: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-500 outline-none"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Required Skills</label>
                  <textarea
                    value={newJobForm.requiredSkills}
                    onChange={(e) => setNewJobForm({...newJobForm, requiredSkills: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-500 outline-none"
                    rows={2}
                    placeholder="Enter skills separated by comma. e.g., General Cleaning, Floor Care"
                  />
                </div>
              </div>

              {/* Permits & Compliance */}
              <div className="space-y-4 border-b pb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-zinc-950" />
                  Permits & Compliance
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Required Permits</label>
                  <textarea
                    value={newJobForm.permits}
                    onChange={(e) => setNewJobForm({...newJobForm, permits: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-500 outline-none"
                    rows={2}
                    placeholder="Enter permits separated by comma. e.g., Building Access, Safety Certificate"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Job Tags</label>
                  <textarea
                    value={newJobForm.tags}
                    onChange={(e) => setNewJobForm({...newJobForm, tags: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-500 outline-none"
                    rows={2}
                    placeholder="Enter tags separated by comma. e.g., Office, Commercial, Urgent"
                  />
                </div>
              </div>

              {/* Services */}
              <div className="space-y-4 border-b pb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-zinc-950" />
                  Job Services
                </h3>
                <p className="text-sm text-gray-600">Add services to this job that can be charged to the client</p>
                
                <button
                  onClick={() => {
                    const newService: JobService = {
                      id: Math.random().toString(36).substr(2, 9),
                      name: '',
                      quantity: 1,
                      unitPrice: 0,
                      total: 0
                    }
                    setNewJobForm({
                      ...newJobForm,
                      services: [...(newJobForm.services || []), newService]
                    })
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Service
                </button>

                <div className="space-y-3">
                  {(newJobForm.services || []).map((service, idx) => (
                    <div key={service.id} className="p-4 border border-gray-300 rounded-lg space-y-3 bg-gray-50">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-900 mb-1">Service Name</label>
                          <input
                            type="text"
                            placeholder="e.g., Window Cleaning"
                            value={service.name}
                            onChange={(e) => {
                              const updated = [...(newJobForm.services || [])]
                              updated[idx].name = e.target.value
                              setNewJobForm({ ...newJobForm, services: updated })
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-1">Quantity</label>
                          <input
                            type="number"
                            placeholder="1"
                            value={service.quantity}
                            onChange={(e) => {
                              const updated = [...(newJobForm.services || [])]
                              updated[idx].quantity = parseInt(e.target.value) || 0
                              updated[idx].total = updated[idx].quantity * updated[idx].unitPrice
                              setNewJobForm({ ...newJobForm, services: updated })
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-1">Unit Price (AED)</label>
                          <input
                            type="number"
                            placeholder="0"
                            value={service.unitPrice}
                            onChange={(e) => {
                              const updated = [...(newJobForm.services || [])]
                              updated[idx].unitPrice = parseInt(e.target.value) || 0
                              updated[idx].total = updated[idx].quantity * updated[idx].unitPrice
                              setNewJobForm({ ...newJobForm, services: updated })
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-1">Total (AED)</label>
                          <input
                            type="number"
                            placeholder="0"
                            value={service.total}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                          />
                        </div>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-900 mb-1">Description (Optional)</label>
                        <textarea
                          placeholder="Service description..."
                          value={service.description || ''}
                          onChange={(e) => {
                            const updated = [...(newJobForm.services || [])]
                            updated[idx].description = e.target.value
                            setNewJobForm({ ...newJobForm, services: updated })
                          }}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const updated = (newJobForm.services || []).filter((_, i) => i !== idx)
                          setNewJobForm({ ...newJobForm, services: updated })
                        }}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove Service
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Instructions */}
              <div className="space-y-4 border-b pb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-zinc-950" />
                  Special Instructions
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Special Instructions</label>
                  <textarea
                    value={newJobForm.specialInstructions}
                    onChange={(e) => setNewJobForm({...newJobForm, specialInstructions: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-500 outline-none"
                    rows={3}
                    placeholder="Any special instructions or notes for this job..."
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-lg border border-blue-200">
                  <input
                    type="checkbox"
                    checked={newJobForm.recurring}
                    onChange={(e) => setNewJobForm({...newJobForm, recurring: e.target.checked})}
                    className="w-4 h-4 rounded"
                    id="recurring"
                  />
                  <label htmlFor="recurring" className="text-sm font-medium text-gray-900 cursor-pointer">
                    This is a recurring job
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons - Fixed Bottom */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => { setShowNewJobModal(false); setEditingJobId(null) }}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveJob}
                className="px-6 py-2 bg-zinc-950 text-white rounded-lg hover:bg-zinc-950 font-semibold transition-colors flex items-center gap-2"
                disabled={loading}
              >
                {loading ? 'Saving...' : editingJobId ? 'Update Job' : 'Create Job'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Delete Job</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this job? All associated data will be permanently removed from Firebase.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteJob(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete Job'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Execution Modal */}
      {showExecutionModal && selectedJobForExecution && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Execute: {selectedJobForExecution.title}</h2>
              <button onClick={() => setShowExecutionModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Job Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-600">Client: </span><span className="font-semibold">{selectedJobForExecution.client}</span></div>
                  <div><span className="text-gray-600">Location: </span><span className="font-semibold">{selectedJobForExecution.location}</span></div>
                  <div><span className="text-gray-600">Team Size: </span><span className="font-semibold">{selectedJobForExecution.teamRequired}</span></div>
                  <div><span className="text-gray-600">Budget: </span><span className="font-semibold">AED {selectedJobForExecution.budget.toLocaleString()}</span></div>
                </div>
              </div>

              {/* Assigned Team */}
              {selectedJobForExecution.assignedEmployees && selectedJobForExecution.assignedEmployees.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Assigned Team</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedJobForExecution.assignedEmployees.map(employee => (
                      <div key={employee.id} className="p-3 border rounded-lg bg-gray-50">
                        <p className="font-medium text-gray-900">{employee.name}</p>
                        <p className="text-xs text-gray-600">{employee.email}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Checklist */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Pre-Execution Checklist</h3>
                {['Team arrived on site', 'Equipment setup', 'Safety review', 'Client briefing', 'Work area secured', 'Permits verified'].map(item => (
                  <label key={item} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={executionChecklist.includes(item)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setExecutionChecklist([...executionChecklist, item])
                        } else {
                          setExecutionChecklist(executionChecklist.filter(i => i !== item))
                        }
                      }}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm">{item}</span>
                  </label>
                ))}
              </div>

              {/* Photos */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Documentation</h3>
                <div className="grid grid-cols-3 gap-4">
                  {['Before', 'During', 'After'].map(label => (
                    <div key={label} className="aspect-square bg-gray-100 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-zinc-500">
                      <Camera className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-600">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Notes</h3>
                <textarea
                  value={executionNotes}
                  onChange={(e) => setExecutionNotes(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-zinc-500 outline-none"
                  rows={4}
                  placeholder="Add notes..."
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <button onClick={() => setShowExecutionModal(false)} className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleLogExecution} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Log Execution
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}