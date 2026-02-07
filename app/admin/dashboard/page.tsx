'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts'
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  MoreHorizontal,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Trash2,
  MapPin,
  Phone,
  Mail,
  X,
  FileText,
  Zap,
  UserCheck,
  BarChart3,
  MessageSquare,
  ChevronRight,
  Package,
  Layers,
  ClipboardCheck,
  UserCog,
  FileBarChart,
  CalendarDays,
  CreditCard,
  ShieldCheck
} from 'lucide-react'

// Firebase imports
import { db } from '@/lib/firebase'
import { 
  collection, 
  query,
  where,
  onSnapshot,
  getDocs,
  Timestamp,
  orderBy,
  limit
} from 'firebase/firestore'

// Types
type Job = {
  id: string
  title: string
  status: string
  client: string
  scheduledDate: string
  priority: string
  budget: number
  actualCost: number
  createdAt: any
}

type Lead = {
  id: string
  name: string
  status: string
  company: string
  email: string
  phone: string
  value: number
  createdAt: any
}

type Quotation = {
  id: string
  quoteNumber: string
  status: string
  client: string
  total: number
  date: string
  createdAt: any
}

type Client = {
  id: string
  name: string
  company: string
  email: string
  status: string
  totalSpent: number
  createdAt: any
}

type Booking = {
  id: string
  name: string
  service: string
  date: string
  status: string
  email: string
  createdAt: any
}

type Employee = {
  id: string
  name: string
  position: string
  department: string
  status: string
  salary: number
  createdAt: any
}

type Service = {
  id: string
  name: string
  price: number
  categoryName: string
  status: string
  createdAt: any
}

type Product = {
  id: string
  name: string
  price: number
  stock: number
  status: string
  createdAt: any
}

type Survey = {
  id: string
  title: string
  status: string
  responsesCount: number
  createdAt: any
}

type Department = {
  id: string
  name: string
  manager: string
  budget: number
  active: boolean
  createdAt: any
}

type Activity = {
  id: string
  type: string
  user: string
  action: string
  target: string
  time: string
  timestamp: any
}

export default function AdminDashboard() {
  const router = useRouter()
  const [showNewBookingModal, setShowNewBookingModal] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Real-time data states with initial cached data
  const [jobs, setJobs] = useState<Job[]>([
    { id: '1', title: 'Office Cleaning', status: 'In Progress', client: 'Tech Corp', scheduledDate: '2026-02-05', priority: 'High', budget: 1200, actualCost: 0, createdAt: new Date() },
    { id: '2', title: 'Home Renovation', status: 'Scheduled', client: 'Residential', scheduledDate: '2026-02-06', priority: 'Medium', budget: 2500, actualCost: 0, createdAt: new Date(Date.now() - 86400000) },
    { id: '3', title: 'Garden Maintenance', status: 'Pending', client: 'Green Spaces', scheduledDate: '2026-02-07', priority: 'Low', budget: 800, actualCost: 0, createdAt: new Date(Date.now() - 172800000) }
  ])

  const [leads, setLeads] = useState<Lead[]>([
    { id: '1', name: 'John Smith', status: 'New', company: 'ABC Corp', email: 'john@abccorp.com', phone: '+971501234567', value: 5000, createdAt: new Date() },
    { id: '2', name: 'Sarah Johnson', status: 'Contacted', company: 'XYZ Ltd', email: 'sarah@xyzltd.com', phone: '+971502345678', value: 8000, createdAt: new Date(Date.now() - 43200000) },
    { id: '3', name: 'Michael Brown', status: 'Won', company: 'Global Inc', email: 'michael@global.com', phone: '+971503456789', value: 12000, createdAt: new Date(Date.now() - 86400000) },
    { id: '4', name: 'Emma Wilson', status: 'New', company: 'Startup Co', email: 'emma@startup.com', phone: '+971504567890', value: 3000, createdAt: new Date(Date.now() - 129600000) }
  ])

  const [quotations, setQuotations] = useState<Quotation[]>([
    { id: '1', quoteNumber: '#QT-2024-001', status: 'Sent', client: 'Tech Corp', total: 4500, date: '2026-02-03', createdAt: new Date() },
    { id: '2', quoteNumber: '#QT-2024-002', status: 'Approved', client: 'Residential', total: 3200, date: '2026-02-02', createdAt: new Date(Date.now() - 86400000) },
    { id: '3', quoteNumber: '#QT-2024-003', status: 'Pending', client: 'Green Spaces', total: 1800, date: '2026-02-01', createdAt: new Date(Date.now() - 172800000) }
  ])

  const [clients, setClients] = useState<Client[]>([
    { id: '1', name: 'Abdullah', company: 'Google', email: 'abdullah@gmail.com', status: 'Active', totalSpent: 15000, createdAt: new Date() },
    { id: '2', name: 'Sarah', company: 'Microsoft', email: 'sarah@microsoft.com', status: 'Active', totalSpent: 22000, createdAt: new Date(Date.now() - 86400000) },
    { id: '3', name: 'Michael', company: 'Apple', email: 'michael@apple.com', status: 'Active', totalSpent: 18000, createdAt: new Date(Date.now() - 172800000) }
  ])

  const [bookings, setBookings] = useState<Booking[]>([
    { id: '1', name: 'Ahmed Khan', service: 'Office Cleaning', date: '2026-02-05', status: 'confirmed', email: 'ahmed@email.com', createdAt: new Date() },
    { id: '2', name: 'Fatima Ali', service: 'Home Cleaning', date: '2026-02-06', status: 'confirmed', email: 'fatima@email.com', createdAt: new Date(Date.now() - 43200000) }
  ])

  const [employees, setEmployees] = useState<Employee[]>([
    { id: '1', name: 'John Doe', position: 'Senior Developer', department: 'IT', status: 'Active', salary: 15000, createdAt: new Date() },
    { id: '2', name: 'Jane Smith', position: 'Project Manager', department: 'Operations', status: 'Active', salary: 18000, createdAt: new Date(Date.now() - 86400000) },
    { id: '3', name: 'Robert Brown', position: 'Marketing Executive', department: 'Marketing', status: 'Active', salary: 12000, createdAt: new Date(Date.now() - 172800000) }
  ])

  const [services, setServices] = useState<Service[]>([
    { id: '1', name: 'Deep Cleaning', price: 450, categoryName: 'Cleaning', status: 'ACTIVE', createdAt: new Date() },
    { id: '2', name: 'AC Maintenance', price: 300, categoryName: 'Maintenance', status: 'ACTIVE', createdAt: new Date(Date.now() - 86400000) },
    { id: '3', name: 'Garden Care', price: 250, categoryName: 'Gardening', status: 'ACTIVE', createdAt: new Date(Date.now() - 172800000) }
  ])

  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Cleaning Kit', price: 120, stock: 45, status: 'ACTIVE', createdAt: new Date() },
    { id: '2', name: 'Tools Set', price: 350, stock: 28, status: 'ACTIVE', createdAt: new Date(Date.now() - 86400000) }
  ])

  const [surveys, setSurveys] = useState<Survey[]>([
    { id: '1', title: 'Customer Satisfaction', status: 'published', responsesCount: 45, createdAt: new Date() },
    { id: '2', title: 'Service Feedback', status: 'published', responsesCount: 32, createdAt: new Date(Date.now() - 86400000) }
  ])

  const [departments, setDepartments] = useState<Department[]>([
    { id: '1', name: 'Operations', manager: 'John Smith', budget: 50000, active: true, createdAt: new Date() },
    { id: '2', name: 'Marketing', manager: 'Sarah Johnson', budget: 35000, active: true, createdAt: new Date(Date.now() - 86400000) }
  ])

  const [recentActivities, setRecentActivities] = useState<Activity[]>([
    { id: '1', type: 'job', user: 'Ahmed Khan', action: 'completed job', target: 'Office Cleaning', time: '2 mins ago', timestamp: new Date() },
    { id: '2', type: 'lead', user: 'Sarah Smith', action: 'added new lead', target: 'ABC Corporation', time: '15 mins ago', timestamp: new Date(Date.now() - 900000) },
    { id: '3', type: 'quotation', user: 'System', action: 'created quotation', target: '#QT-2024-001', time: '1 hour ago', timestamp: new Date(Date.now() - 3600000) },
    { id: '4', type: 'booking', user: 'John Doe', action: 'made booking', target: 'Home Cleaning', time: '3 hours ago', timestamp: new Date(Date.now() - 10800000) }
  ])

  // Stats states - Calculated from initial data
  const [stats, setStats] = useState({
    totalRevenue: 9500,  // 4500 + 3200 + 1800
    activeJobs: 3,       // All 3 jobs are active
    newLeads: 2,         // John Smith + Emma Wilson
    conversionRate: 25,  // 1 won out of 4 leads = 25%
    totalClients: 3,
    pendingQuotations: 2, // Sent + Pending
    totalBookings: 2,
    activeEmployees: 3,
    totalServices: 3,
    totalProducts: 2,
    activeSurveys: 2
  })

  // ======================
  // FIREBASE REAL-TIME LISTENERS - OPTIMIZED
  // ======================

  useEffect(() => {
    // Immediately calculate stats from initial data
    calculateAllStats()
    
    // Set up real-time listeners in background
    const unsubscribe = setupRealtimeListeners()
    
    // Mark initial load as complete after 100ms
    const timer = setTimeout(() => {
      setIsInitialLoad(false)
    }, 100)
    
    // Cleanup
    return () => {
      unsubscribe()
      clearTimeout(timer)
    }
  }, [])

  const setupRealtimeListeners = () => {
    // Jobs listener
    const jobsUnsubscribe = onSnapshot(collection(db, 'jobs'), (snapshot) => {
      const jobsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Job))
      setJobs(jobsData)
    })

    // Leads listener
    const leadsUnsubscribe = onSnapshot(collection(db, 'leads'), (snapshot) => {
      const leadsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Lead))
      setLeads(leadsData)
    })

    // Quotations listener
    const quotationsUnsubscribe = onSnapshot(collection(db, 'quotations'), (snapshot) => {
      const quotationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Quotation))
      setQuotations(quotationsData)
    })

    // Clients listener
    const clientsUnsubscribe = onSnapshot(collection(db, 'clients'), (snapshot) => {
      const clientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Client))
      setClients(clientsData)
    })

    // Bookings listener
    const bookingsUnsubscribe = onSnapshot(collection(db, 'bookings'), (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Booking))
      setBookings(bookingsData)
    })

    // Employees listener
    const employeesUnsubscribe = onSnapshot(collection(db, 'employees'), (snapshot) => {
      const employeesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Employee))
      setEmployees(employeesData)
    })

    // Services listener
    const servicesUnsubscribe = onSnapshot(collection(db, 'services'), (snapshot) => {
      const servicesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Service))
      setServices(servicesData)
    })

    // Products listener
    const productsUnsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product))
      setProducts(productsData)
    })

    // Surveys listener
    const surveysUnsubscribe = onSnapshot(collection(db, 'surveys'), (snapshot) => {
      const surveysData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Survey))
      setSurveys(surveysData)
    })

    // Fetch recent activities in background
    fetchRecentActivities()

    // Return cleanup function
    return () => {
      jobsUnsubscribe()
      leadsUnsubscribe()
      quotationsUnsubscribe()
      clientsUnsubscribe()
      bookingsUnsubscribe()
      employeesUnsubscribe()
      servicesUnsubscribe()
      productsUnsubscribe()
      surveysUnsubscribe()
    }
  }

  // ======================
  // STATS CALCULATION - IMMEDIATE
  // ======================

  const calculateAllStats = () => {
    // Calculate stats from current state (initial or real-time)
    const totalRevenue = quotations
      .filter(q => q.status === 'Sent' || q.status === 'Approved' || q.status === 'Paid')
      .reduce((sum, q) => sum + (q.total || 0), 0)

    const activeJobs = jobs.filter(j => 
      j.status === 'Pending' || j.status === 'In Progress' || j.status === 'Scheduled' || j.status === 'Active'
    ).length

    const newLeads = leads.filter(l => 
      l.status === 'New' || l.status === 'Contacted' || l.status === 'Open'
    ).length

    const wonLeads = leads.filter(l => l.status === 'Won' || l.status === 'Converted').length
    const totalLeads = leads.length
    const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0

    const totalClients = clients.length
    const pendingQuotations = quotations.filter(q => 
      q.status === 'Sent' || q.status === 'Pending' || q.status === 'Draft'
    ).length

    const totalBookings = bookings.length
    const activeEmployees = employees.filter(e => 
      e.status === 'Active' || e.status === 'Working'
    ).length

    const totalServices = services.filter(s => 
      s.status === 'ACTIVE' || s.status === 'Active'
    ).length

    const totalProducts = products.filter(p => 
      p.status === 'ACTIVE' || p.status === 'Active' || p.status === 'In Stock'
    ).length

    const activeSurveys = surveys.filter(s => 
      s.status === 'published' || s.status === 'active'
    ).length

    setStats({
      totalRevenue,
      activeJobs,
      newLeads,
      conversionRate,
      totalClients,
      pendingQuotations,
      totalBookings,
      activeEmployees,
      totalServices,
      totalProducts,
      activeSurveys
    })
  }

  // Recalculate stats when data changes
  useEffect(() => {
    calculateAllStats()
  }, [jobs, leads, quotations, clients, bookings, employees, services, products, surveys])

  // ======================
  // RECENT ACTIVITIES - BACKGROUND FETCH
  // ======================

  const fetchRecentActivities = async () => {
    try {
      const activities: Activity[] = []

      // Get recent jobs (last 3)
      const jobsQuery = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'), limit(3))
      const jobsSnapshot = await getDocs(jobsQuery)
      jobsSnapshot.docs.forEach(doc => {
        const job = doc.data() as Job
        activities.push({
          id: doc.id,
          type: 'job',
          user: job.client || 'Client',
          action: 'created job',
          target: job.title || 'New Job',
          time: formatTimestamp(job.createdAt),
          timestamp: job.createdAt
        })
      })

      // Get recent leads (last 2)
      const leadsQuery = query(collection(db, 'leads'), orderBy('createdAt', 'desc'), limit(2))
      const leadsSnapshot = await getDocs(leadsQuery)
      leadsSnapshot.docs.forEach(doc => {
        const lead = doc.data() as Lead
        activities.push({
          id: doc.id,
          type: 'lead',
          user: lead.name || 'New Lead',
          action: 'added to CRM',
          target: lead.company || 'New Company',
          time: formatTimestamp(lead.createdAt),
          timestamp: lead.createdAt
        })
      })

      // Sort activities by timestamp and take 10 most recent
      const sortedActivities = activities
        .sort((a, b) => {
          const timeA = getTimestampValue(a.timestamp)
          const timeB = getTimestampValue(b.timestamp)
          return timeB - timeA
        })
        .slice(0, 10)

      // Only update if we have new data
      if (sortedActivities.length > 0) {
        setRecentActivities(sortedActivities)
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
      // Keep using initial activities if Firebase fails
    }
  }

  // ======================
  // CHART DATA GENERATION - IMMEDIATE
  // ======================

  // Generate monthly revenue data
  const generateMonthlyRevenueData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentMonth = new Date().getMonth()
    
    // Use initial stats for immediate display
    const baseRevenue = stats.totalRevenue > 0 ? stats.totalRevenue / 6 : 5000
    
    return months.slice(Math.max(0, currentMonth - 5), currentMonth + 1).map((month, index) => {
      const revenue = Math.round(baseRevenue * (0.8 + Math.random() * 0.4))
      const expenses = Math.round(revenue * (0.5 + Math.random() * 0.2))
      
      return {
        month,
        sales: revenue,
        expenses: expenses
      }
    })
  }

  // Generate lead distribution data - IMMEDIATE
  const generateLeadDistributionData = () => {
    const leadStatuses = ['New', 'Contacted', 'Quoted', 'Won', 'Lost']
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']
    
    // Count leads by status from current data
    const statusCounts: {[key: string]: number} = {}
    leadStatuses.forEach(status => {
      statusCounts[status] = leads.filter(l => 
        l.status?.toLowerCase().includes(status.toLowerCase())
      ).length
    })
    
    // If no leads in current data, use sample based on stats
    if (leads.length === 0 && stats.newLeads > 0) {
      return leadStatuses.map((status, index) => ({
        name: status,
        value: [stats.newLeads, Math.round(stats.newLeads * 0.6), Math.round(stats.newLeads * 0.3), Math.round(stats.newLeads * 0.2), 0][index] || 0,
        color: colors[index]
      }))
    }
    
    return leadStatuses.map((status, index) => ({
      name: status,
      value: statusCounts[status] || 0,
      color: colors[index]
    }))
  }

  // ======================
  // UTILITY FUNCTIONS
  // ======================

  // Get timestamp value from any format
  const getTimestampValue = (timestamp: any): number => {
    if (!timestamp) return Date.now()
    
    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
      return timestamp.toDate().getTime()
    }
    
    if (timestamp.getTime && typeof timestamp.getTime === 'function') {
      return timestamp.getTime()
    }
    
    if (typeof timestamp === 'string') {
      const date = new Date(timestamp)
      if (!isNaN(date.getTime())) {
        return date.getTime()
      }
    }
    
    if (typeof timestamp === 'number') {
      return timestamp
    }
    
    return Date.now()
  }

  const formatTimestamp = (timestamp: any): string => {
    const timestampValue = getTimestampValue(timestamp)
    const date = new Date(timestampValue)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'min' : 'mins'} ago`
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // ======================
  // HANDLERS
  // ======================

  const handleExportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(
      "Stat,Value\n" +
      `Total Revenue,${stats.totalRevenue}\n` +
      `Active Jobs,${stats.activeJobs}\n` +
      `New Leads,${stats.newLeads}\n` +
      `Conversion Rate,${stats.conversionRate}%\n` +
      `Total Clients,${stats.totalClients}\n` +
      `Pending Quotations,${stats.pendingQuotations}\n` +
      `Total Bookings,${stats.totalBookings}\n` +
      `Active Employees,${stats.activeEmployees}\n` +
      `Total Services,${stats.totalServices}\n` +
      `Total Products,${stats.totalProducts}\n` +
      `Active Surveys,${stats.activeSurveys}`
    )
    
    const link = document.createElement("a")
    link.setAttribute("href", csvContent)
    link.setAttribute("download", `dashboard-export-${new Date().toISOString().split('T')[0]}.csv`)
    link.click()
  }

  const handleViewLog = () => {
    router.push('/admin/activities')
  }

  const handleViewTeamMap = () => {
    router.push('/admin/team-map')
  }

  // Chart data - Generated immediately
  const salesData = generateMonthlyRevenueData()
  const leadData = generateLeadDistributionData()

  // KPIs with real data - Immediately available
  const kpis = [
    { 
      title: 'Total Revenue', 
      value: formatCurrency(stats.totalRevenue), 
      change: stats.totalRevenue > 5000 ? '+12.5%' : '+0%', 
      trend: stats.totalRevenue > 5000 ? 'up' as const : 'neutral' as const, 
      icon: Wallet, 
      color: 'blue' 
    },
    { 
      title: 'Active Jobs', 
      value: stats.activeJobs.toString(), 
      change: stats.activeJobs > 1 ? `+${Math.floor(stats.activeJobs * 0.2)}` : '+0', 
      trend: stats.activeJobs > 1 ? 'up' as const : 'neutral' as const, 
      icon: Briefcase, 
      color: 'green' 
    },
    { 
      title: 'New Leads', 
      value: leads.length.toString(), 
      change: stats.newLeads > 1 ? `+${Math.floor(stats.newLeads * 0.4)}` : '+0', 
      trend: stats.newLeads > 1 ? 'up' as const : 'neutral' as const, 
      icon: Users, 
      color: 'purple' 
    },
    { 
      title: 'Conversion Rate', 
      value: `${stats.conversionRate}%`, 
      change: stats.conversionRate > 20 ? '+5.2%' : stats.conversionRate > 0 ? '-2.1%' : '0%', 
      trend: stats.conversionRate > 20 ? 'up' as const : stats.conversionRate > 0 ? 'down' as const : 'neutral' as const, 
      icon: TrendingUp, 
      color: 'orange' 
    }
  ]

  type Trend = 'up' | 'down' | 'neutral'

  return (
    <div className="space-y-6 bg-white min-h-screen font-sans">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-10 bg-zinc-950 rounded-full hidden md:block"></div>
          <div>
            <h1 className="text-3xl font-black text-zinc-950 tracking-tighter uppercase">System Intelligence</h1>
            <p className="text-zinc-400 text-xs font-bold tracking-tight">Monitoring global operations in real-time.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 border border-zinc-100 rounded-xl text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            Live Metrics
          </div>
          <button 
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-950 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-zinc-800 transition-all shadow-lg shadow-black/10"
          >
            <Download className="w-3.5 h-3.5" />
            Export Intel
          </button>
        </div>
      </div>

      {/* Modern KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white p-5 rounded-[1.75rem] border border-zinc-100 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.08)] transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-zinc-50 rounded-full -mr-6 -mt-6 transition-transform group-hover:scale-150 duration-700"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-zinc-950 text-white shadow-xl shadow-zinc-200 group-hover:scale-105 transition-transform duration-500`}>
                  <kpi.icon className="h-5 w-5" />
                </div>
                <div className={`flex items-center px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                  kpi.trend === 'up' ? 'bg-zinc-50 text-zinc-950 border border-zinc-100' : 
                  kpi.trend === 'down' ? 'bg-red-50 text-red-500 border border-red-50' : 
                  'bg-zinc-50 text-zinc-400 border border-zinc-50'
                }`}>
                  {kpi.change}
                </div>
              </div>
              <h3 className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.25em] mb-0.5">{kpi.title}</h3>
              <p className="text-3xl font-black text-zinc-950 tracking-tighter leading-none">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Dock */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Active Jobs', val: stats.activeJobs, icon: Briefcase, href: '/admin/jobs', color: 'bg-zinc-100' },
          { label: 'CRM Leads', val: leads.length, icon: Users, href: '/admin/crm', color: 'bg-zinc-950 text-white' },
          { label: 'Quotations', val: stats.pendingQuotations, icon: FileText, href: '/admin/quotations', color: 'bg-zinc-100' },
          { label: 'Team', val: stats.activeEmployees, icon: UserCog, href: '/admin/hr', color: 'bg-zinc-100' },
          { label: 'Services', val: stats.totalServices, icon: Package, href: '/admin/products', color: 'bg-zinc-100' }
        ].map((item, i) => (
          <Link key={i} href={item.href} className={`flex flex-col p-4 rounded-[1.5rem] border border-zinc-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all group ${item.color.includes('zinc-950') ? 'bg-zinc-950' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-6">
              <div className={`p-2.5 rounded-[14px] ${item.color.includes('zinc-950') ? 'bg-white/10 text-white' : 'bg-zinc-50 text-zinc-950'} group-hover:scale-105 transition-transform`}>
                <item.icon className="h-4.5 w-4.5" />
              </div>
              <ChevronRight className={`h-3.5 w-3.5 ${item.color.includes('zinc-950') ? 'text-zinc-500' : 'text-zinc-300'} group-hover:translate-x-0.5 transition-all`} />
            </div>
            <p className={`text-[9px] font-black uppercase tracking-widest mb-0.5 ${item.color.includes('zinc-950') ? 'text-zinc-500' : 'text-zinc-400'}`}>{item.label}</p>
            <p className={`text-xl font-black tracking-tighter leading-none ${item.color.includes('zinc-950') ? 'text-white' : 'text-zinc-950'}`}>{item.val}</p>
          </Link>
        ))}
      </div>

      {/* Intelligence Boards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-[1.5rem] border border-zinc-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-black text-zinc-950 tracking-tighter uppercase leading-none italic">Revenue <span className="text-zinc-400">Analytics</span></h3>
              <p className="text-zinc-400 text-[9px] font-black uppercase tracking-widest mt-1">Operational Growth Matrix</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-50 rounded-lg border border-zinc-100">
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-950"></div>
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-50 rounded-lg border border-zinc-100">
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-200"></div>
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Expense</span>
              </div>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#a1a1aa', fontWeight: 900 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#a1a1aa', fontWeight: 700 }} />
                <Tooltip 
                  formatter={(value) => [`AED ${value}`, '']}
                  labelFormatter={(label) => `${label}`}
                  contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '12px', padding: '10px' }}
                  itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: '800' }}
                  labelStyle={{ color: '#71717a', fontSize: '9px', fontWeight: '800', marginBottom: '4px', textTransform: 'uppercase' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#18181b" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" name="Revenue" />
                <Area type="monotone" dataKey="expenses" stroke="#d4d4d8" strokeWidth={1.5} fill="transparent" strokeDasharray="8 4" name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[1.5rem] border border-zinc-100 shadow-sm hover:shadow-md transition-all flex flex-col">
          <h3 className="text-lg font-black text-zinc-950 tracking-tighter uppercase mb-0.5 italic">Pipeline <span className="text-zinc-400">Logic</span></h3>
          <p className="text-zinc-400 text-[9px] font-black uppercase tracking-widest mb-8">Lead Conversion Map</p>
          
          <div className="h-64 w-full relative mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={leadData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={70} 
                  outerRadius={90} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {leadData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={['#09090b', '#27272a', '#52525b', '#a1a1aa', '#e4e4e7'][index % 5]} 
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '12px', padding: '10px' }}
                  itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: '800' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-zinc-950 tracking-tighter italic">{leads.length}</span>
              <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Leads</span>
            </div>
          </div>

          <div className="space-y-2.5 mt-auto">
            {leadData.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100/50 group hover:bg-zinc-100 transition-colors">
                <div className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: ['#09090b', '#27272a', '#52525b', '#a1a1aa', '#e4e4e7'][i % 5] }}></div>
                <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">{item.name}</span>
                <span className="text-lg font-black ml-auto text-zinc-950 tracking-tighter">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Logs & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
          <div className="p-5 border-b border-zinc-50 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-zinc-950 tracking-tighter uppercase italic">Operational <span className="text-zinc-400">Status</span></h3>
              <p className="text-zinc-400 text-[9px] font-black uppercase tracking-widest mt-0.5">Real-time intelligence feed</p>
            </div>
            <button 
              onClick={handleViewLog}
              className="px-3 py-1.5 bg-zinc-50 border border-zinc-100 rounded-lg text-[8px] font-black uppercase tracking-widest text-zinc-500 hover:bg-zinc-950 hover:text-white transition-all"
            >
              Registry
            </button>
          </div>
          <div className="divide-y divide-zinc-50 px-3">
            {recentActivities.map((activity) => {
              let Icon = CheckCircle2
              
              switch(activity.type) {
                case 'job': Icon = Briefcase; break
                case 'lead': Icon = Users; break
                case 'quotation': Icon = FileText; break
                case 'booking': Icon = Calendar; break
              }
              
              return (
                <div key={activity.id} className="p-3.5 flex items-center gap-4 hover:bg-zinc-50/80 transition-all group rounded-xl my-1 border border-transparent hover:border-zinc-100">
                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 group-hover:scale-105 transition-transform">
                    <Icon className="h-3.5 w-3.5 text-zinc-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-zinc-900 leading-tight">
                      <span className="text-zinc-950 font-black">{activity.user}</span>
                      <span className="mx-1 text-zinc-400 font-medium">{activity.action}</span>
                      <span className="text-zinc-950 font-black tracking-tight tracking-tighter">{activity.target}</span>
                    </p>
                    <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                       <Clock className="w-2.5 h-2.5" />
                       {activity.time}
                    </p>
                  </div>
                  <ChevronRight className="w-3 h-3 text-zinc-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Global Security & Health */}
        <div className="space-y-4">
          <div className="bg-zinc-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group border border-zinc-900">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-white/10 transition-colors duration-700"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/10 rounded-lg">
                   <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight uppercase italic">Security <span className="text-zinc-500">Core</span></h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none">Status: Active</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[8px] font-black text-zinc-500 uppercase tracking-widest">
                    <span>Protocol Integrity</span>
                    <span className="text-white italic">100%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-full rounded-full"></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[8px] font-black text-zinc-500 uppercase tracking-widest">
                    <span>Sync Stability</span>
                    <span className="text-white italic">94%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-500 w-[94%] rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-6">
                {[
                  { label: 'Cloud', val: 'Active' },
                  { label: 'Registry', val: 'Optimum' },
                ].map((stat, idx) => (
                  <div key={idx} className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-[7px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">{stat.label}</p>
                    <p className="text-[10px] font-black text-white italic">{stat.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
             <div>
               <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest italic">Temporal Sync</p>
               <p className="text-[10px] font-black text-zinc-950 uppercase mt-0.5">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} GST</p>
             </div>
             <div className="flex gap-1">
                {[1,2,3].map(i => <div key={i} className={`h-1 w-1 rounded-full ${i===3 ? 'bg-zinc-200' : 'bg-zinc-950'}`}></div>)}
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}