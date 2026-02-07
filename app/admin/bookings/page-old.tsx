'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  User,
  Users,
  Plus,
  X,
  Filter,
  Download,
  CheckCircle,
  AlertCircle,
  Trash2
} from 'lucide-react'

// Aapka firebase.ts file se import
import { db } from '@/lib/firebase'
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore'

interface Booking {
  id: string;
  bookingId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
  bookingNumber: string;
  duration: number;
  estimatedPrice: number;
  status: 'pending' | 'accepted' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'rejected';
  employeeId?: string;
  employeeName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
}

// Updated status icons with rejected and accepted
const statusIcons = {
  pending: AlertCircle,
  accepted: CheckCircle,
  confirmed: CheckCircle,
  'in-progress': Clock,
  completed: CheckCircle,
  cancelled: X,
  rejected: AlertCircle
}

// Updated status colors
const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  accepted: 'bg-teal-100 text-teal-700',
  confirmed: 'bg-zinc-100 text-zinc-950',
  'in-progress': 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  rejected: 'bg-rose-100 text-rose-700'
}

export default function BookingCalendar() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [slotDuration, setSlotDuration] = useState(30) // in minutes
  const [selectedSlot, setSelectedSlot] = useState<{time: string; employeeId: string} | null>(null)
  const [showNewBookingModal, setShowNewBookingModal] = useState(false)
  const [newBooking, setNewBooking] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    serviceName: '',
    employeeId: '',
    duration: 1
  })

  // Fetch bookings and employees
  useEffect(() => {
    fetchBookingsAndEmployees()
  }, [])

  const fetchBookingsAndEmployees = async () => {
    try {
      // Fetch bookings
      const bookingsRef = collection(db, 'bookings')
      const bookingsQuery = query(bookingsRef, orderBy('createdAt', 'desc'))
      const bookingsSnapshot = await getDocs(bookingsQuery)
      
      const bookingsData: Booking[] = []
      bookingsSnapshot.forEach((doc) => {
        const data = doc.data()
        bookingsData.push({
          id: doc.id,
          bookingId: data.bookingId || `BK${Date.now()}`,
          clientName: data.name || data.clientName || 'N/A',
          clientEmail: data.email || 'N/A',
          clientPhone: data.phone || 'N/A',
          clientAddress: data.area || data.clientAddress || 'N/A',
          serviceName: data.service || 'N/A',
          bookingDate: data.date || new Date().toISOString().split('T')[0],
          bookingTime: data.time || '00:00',
          bookingNumber: data.bookingId || `BK${Date.now()}`,
          duration: data.duration || 1,
          estimatedPrice: data.estimatedPrice || 0,
          status: (data.status || 'pending') as Booking['status'],
          employeeId: data.employeeId || '',
          employeeName: data.employeeName || '',
          notes: data.message || data.notes || '',
          createdAt: data.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || new Date().toISOString()
        })
      })
      setBookings(bookingsData)

      // Fetch employees
      const employeesRef = collection(db, 'employees')
      const employeesSnapshot = await getDocs(employeesRef)
      
      const employeesData: Employee[] = []
      employeesSnapshot.forEach((doc) => {
        const data = doc.data()
        employeesData.push({
          id: doc.id,
          name: data.name || 'N/A',
          email: data.email || 'N/A',
          phone: data.phone || 'N/A'
        })
      })
      setEmployees(employeesData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // Generate time slots based on slot duration
  const generateTimeSlots = () => {
    const slots: string[] = []
    for (let hour = 6; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`)
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  // Get bookings for a specific employee and time slot
  const getBookingForSlot = (employeeId: string, time: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return bookings.find(
      b => b.employeeId === employeeId && 
           b.bookingDate === dateStr && 
           b.bookingTime === time &&
           b.status !== 'cancelled'
    )
  }

  const handleCreateBooking = async () => {
    if (!selectedSlot || !newBooking.clientName) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const bookingDate = currentDate.toISOString().split('T')[0]
      const newBookingData = {
        name: newBooking.clientName,
        email: newBooking.clientEmail,
        phone: newBooking.clientPhone,
        area: newBooking.clientAddress,
        service: newBooking.serviceName,
        date: bookingDate,
        time: selectedSlot.time,
        employeeId: selectedSlot.employeeId,
        employeeName: employees.find(e => e.id === selectedSlot.employeeId)?.name || '',
        duration: newBooking.duration,
        status: 'confirmed',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      const docRef = await addDoc(collection(db, 'bookings'), newBookingData)
      
      // Refresh bookings
      await fetchBookingsAndEmployees()
      
      // Reset form
      setNewBooking({ clientName: '', clientEmail: '', clientPhone: '', clientAddress: '', serviceName: '', employeeId: '', duration: 1 })
      setSelectedSlot(null)
      setShowNewBookingModal(false)
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Failed to create booking')
    }
  }

  const handleDeleteBooking = async (bookingId: string) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteDoc(doc(db, 'bookings', bookingId))
        setBookings(bookings.filter(b => b.id !== bookingId))
      } catch (error) {
        console.error('Error deleting booking:', error)
        alert('Failed to delete booking')
      }
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-950 tracking-tighter uppercase italic">
            Booking <span className="text-zinc-400">Calendar</span>
          </h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-1">
            Real-time Employee Scheduling & Slot Management
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-100 rounded-xl">
            <Clock className="h-4 w-4 text-zinc-400" />
            <select
              value={slotDuration}
              onChange={(e) => setSlotDuration(Number(e.target.value))}
              className="text-[10px] font-black uppercase tracking-widest text-zinc-950 bg-transparent outline-none"
            >
              <option value={15}>15 Min Slots</option>
              <option value={30}>30 Min Slots</option>
              <option value={60}>1 Hour Slots</option>
              <option value={120}>2 Hour Slots</option>
            </select>
          </div>
          <button
            onClick={() => setShowNewBookingModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 transition-all shadow-lg"
          >
            <Plus className="h-4 w-4" />
            New Booking
          </button>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between bg-white border border-zinc-100 rounded-2xl p-4">
        <button
          onClick={() => setCurrentDate(new Date(currentDate.getTime() - 86400000))}
          className="p-2 hover:bg-zinc-50 rounded-xl transition-all"
        >
          <ChevronLeft className="h-5 w-5 text-zinc-600" />
        </button>
        <div className="text-center">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
          </p>
          <p className="text-lg font-black text-zinc-950 tracking-tighter">
            {currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => setCurrentDate(new Date(currentDate.getTime() + 86400000))}
          className="p-2 hover:bg-zinc-50 rounded-xl transition-all"
        >
          <ChevronRight className="h-5 w-5 text-zinc-600" />
        </button>
      </div>

  // Price calculation
  const calculatePrice = (service: string = '', propertyType: string = ''): number => {
    const serviceLower = service.toLowerCase()
    const propertyLower = propertyType.toLowerCase()
    
    if (serviceLower.includes('deep') && propertyLower.includes('villa')) return 500
    if (serviceLower.includes('deep') && propertyLower.includes('office')) return 250
    if (serviceLower.includes('deep') && propertyLower.includes('apartment')) return 350
    if (serviceLower.includes('normal') && propertyLower.includes('villa')) return 300
    if (serviceLower.includes('normal') && propertyLower.includes('office')) return 150
    if (serviceLower.includes('normal') && propertyLower.includes('apartment')) return 200
    
    return 200 // Default price
  }

  const filteredAndSortedBookings = useMemo(() => {
    let filtered = bookings.filter(booking => {
      const matchesSearch = 
        booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus
      
      return matchesSearch && matchesStatus
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
        case 'date-asc':
          return new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime()
        case 'price-desc':
          return b.estimatedPrice - a.estimatedPrice
        case 'price-asc':
          return a.estimatedPrice - b.estimatedPrice
        case 'name-asc':
          return a.clientName.localeCompare(b.clientName)
        case 'name-desc':
          return b.clientName.localeCompare(a.clientName)
        default:
          return 0
      }
    })

    return filtered
  }, [bookings, searchTerm, selectedStatus, sortBy])

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    accepted: bookings.filter(b => b.status === 'accepted').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    inProgress: bookings.filter(b => b.status === 'in-progress').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
    revenue: bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + b.estimatedPrice, 0)
  }

  const handleStatusChange = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      // Firebase mein update
      const bookingRef = doc(db, 'bookings', bookingId)
      await updateDoc(bookingRef, {
        status: newStatus,
        updatedAt: new Date()
      })
      
      // Local state update
      setBookings(bookings.map(b =>
        b.id === bookingId
          ? { 
              ...b, 
              status: newStatus, 
              updatedAt: new Date().toISOString().split('T')[0] 
            }
          : b
      ))
      
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: newStatus })
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Status update failed!')
    }
  }

  const handleDeleteBooking = async (bookingId: string) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      try {
        // Firebase se delete
        await deleteDoc(doc(db, 'bookings', bookingId))
        
        // Local state se remove
        setBookings(bookings.filter(b => b.id !== bookingId))
        setShowDetailsModal(false)
        setSelectedBooking(null)
      } catch (error) {
        console.error('Error deleting booking:', error)
        alert('Delete failed!')
      }
    }
  }

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setEditFormData({ ...booking })
    setShowDetailsModal(true)
    setIsEditingDetails(false)
  }

  const handleSaveEdits = async () => {
    if (!editFormData) return
    
    try {
      // Firebase mein update
      const bookingRef = doc(db, 'bookings', editFormData.id)
      await updateDoc(bookingRef, {
        name: editFormData.clientName,
        email: editFormData.clientEmail,
        phone: editFormData.clientPhone,
        area: editFormData.clientAddress,
        service: editFormData.serviceName,
        date: editFormData.bookingDate,
        time: editFormData.bookingTime,
        status: editFormData.status,
        message: editFormData.notes || '',
        updatedAt: new Date()
      })
      
      // Local state update
      setBookings(bookings.map(b => b.id === editFormData.id ? editFormData : b))
      setSelectedBooking(editFormData)
      setIsEditingDetails(false)
      
      // Refresh data
      await fetchBookings()
    } catch (error) {
      console.error('Error updating booking:', error)
      alert('Update failed!')
    }
  }

  const statuses = ['all', 'pending', 'accepted', 'confirmed', 'in-progress', 'completed', 'cancelled', 'rejected']
  const statusLabels = {
    all: 'All Bookings',
    pending: 'Pending',
    accepted: 'Accepted',
    confirmed: 'Confirmed',
    'in-progress': 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    rejected: 'Rejected'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Bookings Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real data from Firebase - {bookings.length} bookings found
          </p>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20"
          onClick={fetchBookings}
        >
          <Download className="h-4 w-4" />
          Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-card border rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Total</p>
              <p className="text-2xl font-black text-foreground mt-1">{stats.total}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-950/30 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-slate-600" />
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Pending</p>
              <p className="text-2xl font-black text-amber-600 mt-1">{stats.pending}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Accepted</p>
              <p className="text-2xl font-black text-teal-600 mt-1">{stats.accepted}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-teal-100 dark:bg-teal-950/30 flex items-center justify-center shrink-0">
              <ThumbsUp className="h-5 w-5 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Confirmed</p>
              <p className="text-2xl font-black text-zinc-950 mt-1">{stats.confirmed}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-blue-950/30 flex items-center justify-center shrink-0">
              <CheckCircle className="h-5 w-5 text-zinc-950" />
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">In Progress</p>
              <p className="text-2xl font-black text-zinc-800 mt-1">{stats.inProgress}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-purple-950/30 flex items-center justify-center shrink-0">
              <ClockIcon className="h-5 w-5 text-zinc-800" />
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Completed</p>
              <p className="text-2xl font-black text-green-600 mt-1">{stats.completed}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-950/30 flex items-center justify-center shrink-0">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Cancelled</p>
              <p className="text-2xl font-black text-red-600 mt-1">{stats.cancelled}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-950/30 flex items-center justify-center shrink-0">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Rejected</p>
              <p className="text-2xl font-black text-rose-600 mt-1">{stats.rejected}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-rose-100 dark:bg-rose-950/30 flex items-center justify-center shrink-0">
              <ThumbsDown className="h-5 w-5 text-rose-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by booking number, client name, email, or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border rounded-xl text-sm focus:ring-2 focus:ring-zinc-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 bg-muted/50 border rounded-xl text-sm focus:ring-2 focus:ring-zinc-500 outline-none transition-all"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {statusLabels[status as keyof typeof statusLabels]}
              </option>
            ))}
          </select>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2.5 bg-muted/50 border rounded-xl text-sm focus:ring-2 focus:ring-zinc-500 outline-none transition-all"
        >
          <option value="date-desc">Latest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
        </select>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredAndSortedBookings.length > 0 ? (
          filteredAndSortedBookings.map((booking) => {
            const StatusIcon = statusIcons[booking.status]
            return (
              <div
                key={booking.id}
                className="bg-card border rounded-2xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap md:flex-nowrap">
                  {/* Left Section */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${statusColors[booking.status]}`}>
                        <StatusIcon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-black text-foreground truncate">{booking.serviceName}</p>
                        <p className="text-xs text-muted-foreground">{booking.bookingNumber}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      {/* Client Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground shrink-0" />
                          <p className="text-foreground font-bold">{booking.clientName}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MailIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                          <p className="text-muted-foreground truncate">{booking.clientEmail}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <PhoneIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                          <p className="text-muted-foreground">{booking.clientPhone}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <LocationIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                          <p className="text-muted-foreground truncate">{booking.clientAddress}</p>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                          <p className="text-muted-foreground">{booking.bookingDate}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                          <p className="text-muted-foreground">{booking.bookingTime} ({booking.duration}h)</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
                          <p className="text-foreground font-bold">AED {booking.estimatedPrice.toLocaleString()}</p>
                        </div>
                        <div>
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatusChange(booking.id, e.target.value as Booking['status'])}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border-none outline-none transition-all cursor-pointer ${statusColors[booking.status]}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-lg border-l-2 border-amber-500">
                        <p className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-1">Notes</p>
                        <p className="text-sm text-muted-foreground">{booking.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleViewDetails(booking)}
                      className="p-2 hover:bg-zinc-100 dark:hover:bg-blue-950/30 rounded-lg text-zinc-950 transition-colors"
                      title="View & edit details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 hover:bg-green-100 dark:hover:bg-green-950/30 rounded-lg text-green-600 transition-colors"
                      title="Send message"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBooking(booking.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-950/30 rounded-lg text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="bg-card border rounded-2xl p-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-bold">No bookings found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedBooking && editFormData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-card border-b p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">Booking Details</h2>
                <p className="text-sm text-muted-foreground mt-1">{selectedBooking.bookingNumber}</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Service Info */}
              <div className="bg-muted/50 rounded-xl p-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Service</p>
                <p className="text-lg font-black">{editFormData.serviceName}</p>
              </div>

              {/* Client Information */}
              <div>
                <h3 className="text-sm font-black mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Client Information
                </h3>
                <div className="space-y-3">
                  {isEditingDetails ? (
                    <>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Full Name</label>
                        <input
                          type="text"
                          value={editFormData.clientName}
                          onChange={(e) => setEditFormData({ ...editFormData, clientName: e.target.value })}
                          className="w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-zinc-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Email</label>
                        <input
                          type="email"
                          value={editFormData.clientEmail}
                          onChange={(e) => setEditFormData({ ...editFormData, clientEmail: e.target.value })}
                          className="w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-zinc-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Phone</label>
                        <input
                          type="tel"
                          value={editFormData.clientPhone}
                          onChange={(e) => setEditFormData({ ...editFormData, clientPhone: e.target.value })}
                          className="w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-zinc-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Address</label>
                        <input
                          type="text"
                          value={editFormData.clientAddress}
                          onChange={(e) => setEditFormData({ ...editFormData, clientAddress: e.target.value })}
                          className="w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-zinc-500 outline-none transition-all"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Name</p>
                          <p className="font-bold">{editFormData.clientName}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Phone</p>
                          <p className="font-bold">{editFormData.clientPhone}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Email</p>
                        <p className="font-bold">{editFormData.clientEmail}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Service Address</p>
                        <p className="font-bold">{editFormData.clientAddress}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Booking Schedule */}
              <div>
                <h3 className="text-sm font-black mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule
                </h3>
                <div className="space-y-3">
                  {isEditingDetails ? (
                    <>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Date</label>
                        <input
                          type="date"
                          value={editFormData.bookingDate}
                          onChange={(e) => setEditFormData({ ...editFormData, bookingDate: e.target.value })}
                          className="w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-zinc-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Time</label>
                        <input
                          type="time"
                          value={editFormData.bookingTime}
                          onChange={(e) => setEditFormData({ ...editFormData, bookingTime: e.target.value })}
                          className="w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-zinc-500 outline-none transition-all"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Date</p>
                          <p className="font-bold">{editFormData.bookingDate}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Time</p>
                          <p className="font-bold">{editFormData.bookingTime}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Duration</p>
                        <p className="font-bold">{editFormData.duration} hours</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="text-sm font-black mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Pricing
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-xl p-3">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Estimated Price</p>
                    <p className="text-xl font-black">AED {editFormData.estimatedPrice.toLocaleString()}</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                    <select
                      value={editFormData.status}
                      onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as Booking['status'] })}
                      className={`w-full px-2 py-1 rounded-lg text-xs font-bold border-none outline-none cursor-pointer ${statusColors[editFormData.status]}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-sm font-black mb-3">Special Notes</h3>
                {isEditingDetails ? (
                  <textarea
                    value={editFormData.notes || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                    placeholder="Add any special notes or requests..."
                    className="w-full px-3 py-2 bg-muted/50 border rounded-lg text-sm focus:ring-2 focus:ring-zinc-500 outline-none transition-all resize-none h-24"
                  />
                ) : (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">{editFormData.notes || 'No notes added'}</p>
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
                <p>Created: {editFormData.createdAt}</p>
                <p>Updated: {editFormData.updatedAt}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-muted/50 border-t p-4 flex items-center justify-between gap-3">
              <button
                onClick={() => handleDeleteBooking(selectedBooking.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700 transition-colors"
              >
                Delete Booking
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 border rounded-lg font-bold text-sm hover:bg-muted transition-colors"
                >
                  Close
                </button>
                {isEditingDetails ? (
                  <button
                    onClick={handleSaveEdits}
                    className="px-4 py-2 bg-zinc-950 text-white rounded-lg font-bold text-sm hover:bg-zinc-950 transition-colors flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingDetails(true)}
                    className="px-4 py-2 bg-zinc-950 text-white rounded-lg font-bold text-sm hover:bg-zinc-950 transition-colors flex items-center gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Details
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}