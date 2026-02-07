'use client'

import { ReactNode, useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {  
  LayoutDashboard, 
  Users, 
  FileText, 
  Briefcase, 
  UserCircle, 
  Calendar, 
  Wallet, 
  Settings as SettingsIcon,
  Globe,
  LogOut,
  Bell,
  Search,
  Menu,
  ChevronDown,
  TrendingUp,
  MessageSquare,
  UserCheck,
  Ruler,
  Map,
  DollarSign,
  Eye,
  CheckCircle,
  Clock,
  Archive,
  BarChart3,
  Zap,
  Wrench,
  Navigation,
  AlertTriangle,
  Zap as Zap2,
  Star,
  CreditCard,
  AlertTriangle as AlertTriangleIcon,
  BarChart3 as BarChartIcon,
  Shield,
  Lock,
  Activity,
  Brain,
  Lightbulb,
  Package,
  X,
  ExternalLink,
  Sparkles
} from 'lucide-react'
import { getSession, logout } from '@/lib/auth'

type Notification = {
  id: string
  type: 'reminder' | 'alert' | 'info' | 'success'
  title: string
  message: string
  time: string
  read: boolean
  link?: string
}

// Define all possible pages with their labels and icons
const ALL_PAGES_CONFIG = {
  'Dashboard': { icon: LayoutDashboard, href: '/admin/dashboard' },
  'CRM': { icon: Users, href: '/admin/crm' },
  'Lead Dashboard': { icon: Users, href: '/admin/crm' },
  'Communications': { icon: MessageSquare, href: '/admin/crm/communications' },
  'Clients': { icon: UserCheck, href: '/admin/crm/clients' },
  'Surveys': { icon: Ruler, href: '/admin/surveys' },
  'Quotations': { icon: FileText, href: '/admin/quotations/complete' },
  'Inventory & Services': { icon: Wrench, href: '/admin/products' },
  'Jobs': { icon: Briefcase, href: '/admin/jobs' },
  'Equipment & Permits': { icon: Wrench, href: '/admin/equipment-permits' },
  'Job Profitability': { icon: TrendingUp, href: '/admin/job-profitability' },
  'Bookings': { icon: Calendar, href: '/admin/bookings' },
  'HR Management': { icon: UserCircle, href: '/admin/hr' },
  'Employee Directory': { icon: Users, href: '/admin/hr/employee-directory' },
  'Attendance': { icon: Clock, href: '/admin/hr/attendance' },
  'Leave Management': { icon: Calendar, href: '/admin/hr/leave-management' },
  'Payroll': { icon: DollarSign, href: '/admin/hr/payroll' },
  'Performance Dashboard': { icon: BarChart3, href: '/admin/hr/performance-dashboard' },
  'Feedback & Complaints': { icon: MessageSquare, href: '/admin/employee-feedback' },
  'Meetings': { icon: Calendar, href: '/admin/meetings' },
  'Meeting Calendar': { icon: Calendar, href: '/admin/meetings/calendar' },
  'Meeting Detail': { icon: FileText, href: '/admin/meetings/detail' },
  'Notes & Decisions': { icon: FileText, href: '/admin/meetings/notes-decisions' },
  'Follow-Up Tracker': { icon: CheckCircle, href: '/admin/meetings/follow-up-tracker' },
  'Finance': { icon: Wallet, href: '/admin/finance' },
  'Marketing': { icon: TrendingUp, href: '/admin/marketing' },
  'Admin Management': { icon: Shield, href: '/admin/admin-management' },
  'Role Manager': { icon: UserCheck, href: '/admin/admin-management/role-manager' },
  'Permission Matrix': { icon: Lock, href: '/admin/admin-management/permission-matrix' },
  'User Accounts': { icon: Users, href: '/admin/admin-management/user-accounts' },
  'Audit Logs': { icon: Activity, href: '/admin/admin-management/audit-logs' },
  'AI Command Center': { icon: Brain, href: '/admin/ai-command-center' },
  'AI Recommendations': { icon: Lightbulb, href: '/admin/ai-command-center/recommendations' },
  'CMS': { icon: Globe, href: '/admin/cms' },
  'Settings': { icon: SettingsIcon, href: '/admin/settings' }
}

// Define menu structure with parent-child relationships
const MENU_STRUCTURE = [
  { 
    type: 'single',
    label: 'Dashboard',
    key: 'Dashboard'
  },
  { 
    type: 'group',
    label: 'CRM',
    key: 'CRM',
    submenu: [
      { label: 'Lead Dashboard', key: 'Lead Dashboard' },
      { label: 'Communications', key: 'Communications' },
      { label: 'Clients', key: 'Clients' }
    ]
  },
  { 
    type: 'single',
    label: 'Surveys',
    key: 'Surveys'
  },
  { 
    type: 'single',
    label: 'Quotations',
    key: 'Quotations'
  },
  { 
    type: 'single',
    label: 'Inventory & Services',
    key: 'Inventory & Services'
  },
  { 
    type: 'single',
    label: 'Jobs',
    key: 'Jobs'
  },
  { 
    type: 'single',
    label: 'Equipment & Permits',
    key: 'Equipment & Permits'
  },
  { 
    type: 'single',
    label: 'Job Profitability',
    key: 'Job Profitability'
  },
  { 
    type: 'single',
    label: 'Bookings',
    key: 'Bookings'
  },
  { 
    type: 'group',
    label: 'HR Management',
    key: 'HR Management',
    submenu: [
      { label: 'Employee Directory', key: 'Employee Directory' },
      { label: 'Attendance', key: 'Attendance' },
      { label: 'Leave Management', key: 'Leave Management' },
      { label: 'Payroll', key: 'Payroll' },
      { label: 'Performance Dashboard', key: 'Performance Dashboard' },
      { label: 'Feedback & Complaints', key: 'Feedback & Complaints' }
    ]
  },
  { 
    type: 'group',
    label: 'Meetings',
    key: 'Meetings',
    submenu: [
      { label: 'Meeting Calendar', key: 'Meeting Calendar' },
      { label: 'Meeting Detail', key: 'Meeting Detail' },
      { label: 'Notes & Decisions', key: 'Notes & Decisions' },
      { label: 'Follow-Up Tracker', key: 'Follow-Up Tracker' }
    ]
  },
  { 
    type: 'single',
    label: 'Finance',
    key: 'Finance'
  },
  { 
    type: 'single',
    label: 'Marketing',
    key: 'Marketing'
  },
  { 
    type: 'group',
    label: 'Admin Management',
    key: 'Admin Management',
    submenu: [
      { label: 'Role Manager', key: 'Role Manager' },
      { label: 'Permission Matrix', key: 'Permission Matrix' },
     
      { label: 'Audit Logs', key: 'Audit Logs' }
    ]
  },
  { 
    type: 'single',
    label: 'AI Command Center',
    key: 'AI Command Center'
  },
  { 
    type: 'single',
    label: 'CMS',
    key: 'CMS'
  },
  { 
    type: 'single',
    label: 'Settings',
    key: 'Settings'
  }
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'n1',
      type: 'reminder',
      title: 'Equipment Maintenance Due',
      message: 'High-Pressure Washer maintenance is due on 2025-01-15',
      time: '5 min ago',
      read: false,
      link: '/admin/equipment-permits'
    },
    {
      id: 'n2',
      type: 'alert',
      title: 'Permit Expiring Soon',
      message: 'Safety Compliance Certificate expires in 3 days',
      time: '1 hour ago',
      read: false,
      link: '/admin/equipment-permits'
    }
  ])
  
  // State for open submenus
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})
  
  // User session state
  const [userSession, setSessionData] = useState<{
    name: string;
    email: string;
    allowedPages: string[];
    roleName: string;
  } | null>(null)

  // Initialize on mount
  useEffect(() => {
    const session = getSession()
    if (session) {
      setSessionData({
        name: session.user.name || 'User',
        email: session.user.email || '',
        allowedPages: session.allowedPages || [],
        roleName: session.roleName || 'User'
      })
      
      // Set initially open menus based on current path
      const currentMenu = MENU_STRUCTURE.find(menu => 
        menu.type === 'group' && 
        menu.submenu?.some(sub => 
          ALL_PAGES_CONFIG[sub.key as keyof typeof ALL_PAGES_CONFIG]?.href === pathname
        )
      )
      if (currentMenu) {
        setOpenMenus(prev => ({ ...prev, [currentMenu.key]: true }))
      }
    } else {
      // No session found, redirect to login
      router.push('/login')
    }
  }, [router])

  const handleSignOut = async () => {
    setIsSigningOut(true)
    
    try {
      await logout()
      router.push('/login')
    } catch (err) {
      console.error('Sign out failed:', err)
      setIsSigningOut(false)
    }
  }

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'reminder': return <Clock className="w-5 h-5" />
      case 'alert': return <AlertTriangle className="w-5 h-5" />
      case 'success': return <CheckCircle className="w-5 h-5" />
      default: return <Bell className="w-5 h-5" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch(type) {
      case 'reminder': return 'bg-amber-100 text-amber-700'
      case 'alert': return 'bg-red-100 text-red-700'
      case 'success': return 'bg-green-100 text-green-700'
      default: return 'bg-zinc-100 text-zinc-950'
    }
  }

  // Filter menu items based on user's allowed pages
  const getFilteredMenuItems = () => {
    if (!userSession) return []
    
    return MENU_STRUCTURE.filter(menuItem => {
      if (menuItem.type === 'single') {
        // Check if user has access to this page
        return userSession.allowedPages.includes(menuItem.key)
      } else if (menuItem.type === 'group') {
        // Check if user has access to any submenu item
        const hasAccessToAnySubmenu = menuItem.submenu?.some(sub => 
          userSession.allowedPages.includes(sub.key)
        )
        return hasAccessToAnySubmenu
      }
      return false
    })
  }

  const toggleMenu = (menuKey: string) => {
    setOpenMenus(prev => ({ ...prev, [menuKey]: !prev[menuKey] }))
  }

  // Get filtered menu items
  const filteredMenuItems = getFilteredMenuItems()

  // If no user session or no allowed pages, show minimal sidebar
  if (!userSession) {
    return (
      <div className="min-h-screen bg-background text-foreground flex">
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} border-r border-zinc-100 bg-white hidden lg:flex flex-col sticky top-0 h-screen shadow-[1px_0_10px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-500`}>
        <div className={`p-5 border-b border-zinc-100 flex items-center ${!sidebarOpen && 'justify-center'} ${sidebarOpen && 'justify-between'}`}>
          {sidebarOpen && (
            <>
              <div className="flex items-center gap-2.5 group cursor-pointer">
                <div className="h-9 w-9 rounded-xl bg-zinc-950 flex items-center justify-center text-white font-black text-xl shadow-[0_8px_16px_-4px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-105">
                  S
                </div>
                <div className="transition-all duration-300">
                  <span className="font-black text-lg tracking-tighter block leading-none text-zinc-950">SILVER MAID</span>
                  <span className="text-[8px] font-black text-zinc-400 tracking-[0.2em] mt-0.5 block">INTELLIGENCE</span>
                </div>
              </div>
            </>
          )}
          {!sidebarOpen && (
            <div className="h-9 w-9 rounded-xl bg-zinc-950 flex items-center justify-center text-white font-black text-xl shadow-[0_8px_16px_-4px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-300 cursor-pointer">
              S
            </div>
          )}
        </div>
        
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {sidebarOpen && <p className="px-4 text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">Operations Center</p>}
          
          {filteredMenuItems.map((menuItem) => {
            const pageConfig = ALL_PAGES_CONFIG[menuItem.key as keyof typeof ALL_PAGES_CONFIG]
            const isActive = pathname === pageConfig?.href
            const isGroup = menuItem.type === 'group'
            const isOpen = openMenus[menuItem.key] || false
            
            // For groups, check if any submenu item is active
            const isGroupActive = isGroup && menuItem.submenu?.some(sub => {
              const subConfig = ALL_PAGES_CONFIG[sub.key as keyof typeof ALL_PAGES_CONFIG]
              return pathname === subConfig?.href
            })
            
            const IconComponent = pageConfig?.icon

            return (
              <div key={menuItem.key} className="px-1">
                {isGroup ? (
                  <>
                    <button
                      onClick={() => toggleMenu(menuItem.key)}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[12px] font-bold transition-all duration-300 group ${
                        isGroupActive 
                          ? 'bg-zinc-950 text-white shadow-[0_8px_20px_-5px_rgba(0,0,0,0.15)]' 
                          : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950'
                      } ${!sidebarOpen && 'justify-center'}`}
                      title={!sidebarOpen ? menuItem.label : undefined}
                    >
                      {IconComponent && (
                        <IconComponent className={`h-4.5 w-4.5 transition-transform duration-300 ${
                          isGroupActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-950 group-hover:scale-105'
                        }`} />
                      )}
                      {sidebarOpen && (
                        <>
                          <span className="flex-1 text-left tracking-tight">{menuItem.label}</span>
                          <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${
                            isOpen ? 'rotate-180 text-white' : 'text-zinc-400'
                          }`} />
                        </>
                      )}
                    </button>
                    
                    {sidebarOpen && isOpen && menuItem.submenu && (
                      <div className="mt-1 ml-4 space-y-0.5 border-l border-zinc-100 pl-4 animate-in fade-in slide-in-from-left-2 duration-300">
                        {menuItem.submenu
                          .filter(sub => userSession.allowedPages.includes(sub.key))
                          .map((sub) => {
                            const subConfig = ALL_PAGES_CONFIG[sub.key as keyof typeof ALL_PAGES_CONFIG]
                            const isSubActive = pathname === subConfig?.href
                            const SubIcon = subConfig?.icon
                            
                            return (
                              <Link
                                key={sub.key}
                                href={subConfig?.href || '#'}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-bold transition-all duration-200 group ${
                                  isSubActive 
                                    ? 'text-zinc-950 bg-zinc-50' 
                                    : 'text-zinc-400 hover:text-zinc-900 hover:translate-x-1'
                                }`}
                              >
                                <span className={`h-1 w-1 rounded-full transition-all duration-300 ${isSubActive ? 'bg-zinc-950 w-2.5' : 'bg-zinc-200 group-hover:bg-zinc-400'}`}></span>
                                <span className="flex-1">{sub.label}</span>
                              </Link>
                            )
                          })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={pageConfig?.href || '#'}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[12px] font-bold transition-all duration-300 group ${
                      isActive 
                        ? 'bg-zinc-950 text-white shadow-[0_8px_20px_-5px_rgba(0,0,0,0.15)]' 
                        : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950'
                    } ${!sidebarOpen && 'justify-center'}`}
                    title={!sidebarOpen ? menuItem.label : undefined}
                  >
                    {IconComponent && (
                      <IconComponent className={`h-4.5 w-4.5 transition-transform duration-300 ${
                        isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-950 group-hover:scale-105'
                      }`} />
                    )}
                    {sidebarOpen && (
                      <>
                        <span className="flex-1 text-left tracking-tight">{menuItem.label}</span>
                        {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>}
                      </>
                    )}
                  </Link>
                )}
              </div>
            )
          })}
        </nav>

        <div className="p-5 border-t border-zinc-100">
          {sidebarOpen && (
            <div className="bg-zinc-50/50 rounded-2xl p-4 border border-zinc-100 group transition-all duration-500 hover:bg-white hover:shadow-lg hover:shadow-black/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-[12px] bg-zinc-950 flex items-center justify-center text-white font-black text-lg shadow-[0_6px_12px_-3px_rgba(0,0,0,0.2)] shrink-0 transition-transform group-hover:rotate-3">
                  {userSession.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-black text-zinc-950 truncate tracking-tight">{userSession.name}</p>
                  <p className="text-[8px] font-black text-zinc-400 tracking-widest uppercase mt-0.5">{userSession.roleName}</p>
                </div>
              </div>
              <button 
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="flex w-full items-center justify-center gap-2 px-3 py-2 rounded-lg text-[10px] font-black text-zinc-400 transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:border-red-100 border border-transparent disabled:opacity-50 uppercase tracking-widest"
              >
                <LogOut className="h-3 w-3" />
                {isSigningOut ? 'Wait...' : 'Exit'}
              </button>
            </div>
          )}
          {!sidebarOpen && (
            <button 
              onClick={handleSignOut}
              className="w-full flex justify-center p-2.5 rounded-xl text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
            >
              <LogOut className="h-5 w-5" />
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar - Slide-out menu */}
      {sidebarOpen && (
        <div className="fixed top-24 left-0 w-72 h-[calc(100vh-6rem)] bg-white border-r border-zinc-100 z-50 overflow-y-auto lg:hidden animate-in slide-in-from-left duration-300">
          <div className="p-6 space-y-2">
            <p className="px-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-6">Operations Center</p>
            {filteredMenuItems.map((menuItem) => {
              const pageConfig = ALL_PAGES_CONFIG[menuItem.key as keyof typeof ALL_PAGES_CONFIG]
              const isActive = pathname === pageConfig?.href
              const isGroup = menuItem.type === 'group'
              const isOpen = openMenus[menuItem.key] || false
              const isGroupActive = isGroup && menuItem.submenu?.some(sub => {
                const subConfig = ALL_PAGES_CONFIG[sub.key as keyof typeof ALL_PAGES_CONFIG]
                return pathname === subConfig?.href
              })
              
              const IconComponent = pageConfig?.icon

              return (
                <div key={menuItem.key}>
                  {isGroup ? (
                    <>
                      <button
                        onClick={() => toggleMenu(menuItem.key)}
                        className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-[14px] font-black transition-all duration-300 group ${
                          isGroupActive 
                            ? 'bg-zinc-950 text-white shadow-xl' 
                            : 'text-zinc-500 hover:bg-zinc-50'
                        }`}
                      >
                        {IconComponent && (
                          <IconComponent className={`h-5 w-5 ${
                            isGroupActive ? 'text-white' : 'text-zinc-400'
                          }`} />
                        )}
                        <span className="flex-1 text-left tracking-tight">{menuItem.label}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`} />
                      </button>
                      
                      {isOpen && menuItem.submenu && (
                        <div className="mt-2 ml-4 space-y-1 border-l border-zinc-100 pl-4">
                          {menuItem.submenu
                            .filter(sub => userSession.allowedPages.includes(sub.key))
                            .map((sub) => {
                              const subConfig = ALL_PAGES_CONFIG[sub.key as keyof typeof ALL_PAGES_CONFIG]
                              const isSubActive = pathname === subConfig?.href
                              const SubIcon = subConfig?.icon
                              
                              return (
                                <Link
                                  key={sub.key}
                                  href={subConfig?.href || '#'}
                                  onClick={() => setSidebarOpen(false)}
                                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-all duration-200 ${
                                    isSubActive 
                                      ? 'text-zinc-950 bg-zinc-50' 
                                      : 'text-zinc-400'
                                  }`}
                                >
                                  <span className={`h-1.5 w-1.5 rounded-full ${isSubActive ? 'bg-zinc-950' : 'bg-zinc-200'}`}></span>
                                  <span className="flex-1">{sub.label}</span>
                                </Link>
                              )
                            })}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={pageConfig?.href || '#'}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-[14px] font-black transition-all duration-300 group ${
                        isActive 
                          ? 'bg-zinc-950 text-white shadow-xl' 
                          : 'text-zinc-500 hover:bg-zinc-50'
                      }`}
                    >
                      {IconComponent && (
                        <IconComponent className={`h-5 w-5 ${
                          isActive ? 'text-white' : 'text-zinc-400'
                        }`} />
                      )}
                      <span className="flex-1 text-left tracking-tight">{menuItem.label}</span>
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <header className="h-20 border-b border-zinc-100 bg-white/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-8">
          <div className="flex items-center gap-6 flex-1">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-2.5 hover:bg-zinc-50 rounded-xl transition-all duration-300 group"
              title={sidebarOpen ? 'Collapse Intelligence Sidebar' : 'Expand Intelligence Sidebar'}
            >
              {sidebarOpen ? <X className="h-5 w-5 text-zinc-950 group-hover:rotate-90 transition-transform" /> : <Menu className="h-5 w-5 text-zinc-950" />}
            </button>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2.5 hover:bg-zinc-50 rounded-xl">
              <Menu className="h-5 w-5 text-zinc-950" />
            </button>
            <div className="relative max-w-lg w-full hidden md:block group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-950 transition-colors" />
              <input 
                type="text" 
                placeholder="Search intelligence..." 
                className="w-full pl-11 pr-5 py-2.5 bg-zinc-50 border-none rounded-xl text-[12px] font-bold text-zinc-950 focus:ring-2 focus:ring-zinc-950/5 placeholder:text-zinc-400 outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="hidden lg:flex items-center gap-2 pr-5 border-r border-zinc-100">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active</span>
            </div>
            
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[9px] font-black text-zinc-400 tracking-widest uppercase">System Op</span>
              <span className="text-[12px] font-black text-zinc-950 tracking-tight">{userSession.name}</span>
            </div>
            
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-3 rounded-xl hover:bg-zinc-50 relative transition-all duration-300 group"
            >
              <Bell className="h-4.5 w-4.5 text-zinc-400 group-hover:text-zinc-950 transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 h-4.5 w-4.5 bg-zinc-950 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black text-white shadow-lg shadow-black/20">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Notification Panel */}
          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-10 top-24 w-[420px] bg-white border border-zinc-100 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] z-50 max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-zinc-50 flex items-center justify-between bg-zinc-50/50">
                  <div>
                    <h3 className="font-black text-xl text-zinc-950 tracking-tight">Intelligence Feed</h3>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">{unreadCount} actionable alerts</p>
                  </div>
                  <div className="flex gap-3">
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllAsRead}
                        className="text-[10px] font-black text-zinc-950 hover:bg-white uppercase tracking-widest px-4 py-2 bg-white border border-zinc-100 rounded-xl transition-all shadow-sm"
                      >
                        Clear Feed
                      </button>
                    )}
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-zinc-100 transition-all"
                    >
                      <X className="w-5 h-5 text-zinc-400 hover:text-zinc-950" />
                    </button>
                  </div>
                </div>

                <div className="overflow-y-auto flex-1 custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-20 text-center">
                      <div className="h-20 w-20 bg-zinc-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                        <Bell className="w-10 h-10 text-zinc-200" />
                      </div>
                      <p className="text-zinc-950 font-black text-lg tracking-tight">Zero Alerts</p>
                      <p className="text-zinc-400 text-sm mt-1 font-bold">System integrity nominal.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-zinc-50">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className={`p-6 hover:bg-zinc-50/80 transition-all duration-300 group ${!notification.read ? 'bg-zinc-50/30 border-l-4 border-l-zinc-950' : ''}`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-2xl shrink-0 transition-transform group-hover:scale-110 ${getNotificationColor(notification.type)}`}>
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3 mb-1.5">
                                <h4 className="font-black text-[14px] text-zinc-950 tracking-tight leading-tight">{notification.title}</h4>
                                {!notification.read && (
                                  <span className="h-2 w-2 bg-zinc-950 rounded-full shrink-0 animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.4)] mt-1.5"></span>
                                )}
                              </div>
                              <p className="text-sm text-zinc-500 font-semibold leading-relaxed mb-4">{notification.message}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                  <Clock className="w-3.5 h-3.5 text-zinc-300" />
                                  {notification.time}
                                </div>
                                <div className="flex gap-4">
                                  {notification.link && (
                                    <Link
                                      href={notification.link}
                                      onClick={() => {
                                        handleMarkAsRead(notification.id)
                                        setShowNotifications(false)
                                      }}
                                      className="text-[10px] font-black text-zinc-950 hover:underline uppercase tracking-widest flex items-center gap-1.5"
                                    >
                                      Inquire <ExternalLink className="w-3 h-3" />
                                    </Link>
                                  )}
                                  <button
                                    onClick={() => handleDeleteNotification(notification.id)}
                                    className="text-[10px] font-black text-red-500 hover:text-red-700 uppercase tracking-widest"
                                  >
                                    Retract
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-6 border-t border-zinc-50 bg-zinc-50/50">
                  <button 
                    onClick={() => {
                      setShowNotifications(false)
                      router.push('/admin/equipment-permits')
                    }}
                    className="w-full text-[11px] font-black text-zinc-950 uppercase tracking-[0.2em] py-4 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:shadow-md transition-all"
                  >
                    All Intelligence Logs
                  </button>
                </div>
              </div>
            </>
          )}
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-white custom-scrollbar">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}