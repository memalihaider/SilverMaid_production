'use client'

import { useState, useEffect } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  User,
  Plus,
  X,
  Trash2
} from 'lucide-react'

import { db } from '@/lib/firebase'
import { collection, getDocs, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore'

interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  employeeId?: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
}

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700'
}

export default function BookingCalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [slotDuration, setSlotDuration] = useState(30)
  const [showNewBookingModal, setShowNewBookingModal] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{time: string; employeeId: string} | null>(null)
  const [newBooking, setNewBooking] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    serviceName: '',
    duration: 1
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const bookingsSnapshot = await getDocs(collection(db, 'bookings'))
      const bookingsData: Booking[] = []
      bookingsSnapshot.forEach((doc) => {
        const data = doc.data()
        bookingsData.push({
          id: doc.id,
          clientName: data.name || data.clientName || 'N/A',
          clientEmail: data.email || 'N/A',
          clientPhone: data.phone || 'N/A',
          clientAddress: data.area || data.clientAddress || 'N/A',
          serviceName: data.service || 'N/A',
          bookingDate: data.date || new Date().toISOString().split('T')[0],
          bookingTime: data.time || '00:00',
          duration: data.duration || 1,
          status: data.status || 'confirmed',
          employeeId: data.employeeId || ''
        })
      })
      setBookings(bookingsData)

      const employeesSnapshot = await getDocs(collection(db, 'employees'))
      const employeesData: Employee[] = []
      employeesSnapshot.forEach((doc) => {
        const data = doc.data()
        employeesData.push({
          id: doc.id,
          name: data.name || 'N/A',
          email: data.email || 'N/A'
        })
      })
      setEmployees(employeesData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

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

  const getBookingForSlot = (employeeId: string, time: string) => {
    const dateStr = currentDate.toISOString().split('T')[0]
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
      await addDoc(collection(db, 'bookings'), {
        name: newBooking.clientName,
        email: newBooking.clientEmail,
        phone: newBooking.clientPhone,
        area: newBooking.clientAddress,
        service: newBooking.serviceName,
        date: bookingDate,
        time: selectedSlot.time,
        employeeId: selectedSlot.employeeId,
        duration: newBooking.duration,
        status: 'confirmed',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      await fetchData()
      setNewBooking({ clientName: '', clientEmail: '', clientPhone: '', clientAddress: '', serviceName: '', duration: 1 })
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
            Employee Scheduling & Slot Management
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

      {/* Calendar Grid */}
      <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-sm">
        {/* Grid Header */}
        <div className="flex border-b border-zinc-100 sticky top-0 bg-zinc-50">
          <div className="w-24 p-4 border-r border-zinc-100 flex items-center justify-center">
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Time</span>
          </div>

          <div className="flex flex-1 divide-x divide-zinc-100">
            {employees.length > 0 ? (
              employees.map((employee) => (
                <div key={employee.id} className="flex-1 p-4 border-r border-zinc-100 last:border-r-0 text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <User className="h-3.5 w-3.5 text-zinc-400" />
                  </div>
                  <p className="text-[10px] font-black text-zinc-950 truncate">{employee.name}</p>
                  <p className="text-[8px] text-zinc-400 font-black uppercase tracking-widest mt-0.5 truncate">{employee.email}</p>
                </div>
              ))
            ) : (
              <div className="flex-1 p-4 text-center text-zinc-400">
                <p className="text-[10px] font-black">No employees found</p>
              </div>
            )}
          </div>
        </div>

        {/* Calendar Grid Body */}
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {timeSlots.map((time) => (
              <div key={time} className="flex border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50/50 transition-colors">
                <div className="w-24 p-3 border-r border-zinc-100 flex items-center justify-center sticky left-0 bg-white z-10">
                  <span className="text-[11px] font-black text-zinc-950 tracking-tighter">{time}</span>
                </div>

                <div className="flex flex-1 divide-x divide-zinc-100">
                  {employees.map((employee) => {
                    const booking = getBookingForSlot(employee.id, time)
                    return (
                      <div
                        key={`${employee.id}-${time}`}
                        className="flex-1 p-2 border-r border-zinc-100 last:border-r-0 min-h-[80px] flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-zinc-100/50 transition-all group relative"
                        onClick={() => {
                          setSelectedSlot({ time, employeeId: employee.id })
                          setShowNewBookingModal(true)
                        }}
                      >
                        {booking ? (
                          <div className={`w-full h-full rounded-lg p-2 flex flex-col items-center justify-center text-center gap-1 ${statusColors[booking.status]} relative group/slot`}>
                            <p className="text-[8px] font-black uppercase tracking-widest line-clamp-1">{booking.clientName}</p>
                            <p className="text-[7px] font-bold opacity-75 line-clamp-1">{booking.serviceName}</p>
                            <div className="flex gap-1 mt-auto">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteBooking(booking.id)
                                }}
                                className="p-1 hover:bg-black/10 rounded opacity-0 group-hover/slot:opacity-100 transition-opacity"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus className="h-4 w-4 text-zinc-400" />
                            <span className="text-[8px] text-zinc-400 font-black uppercase">Add Booking</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Booking Modal */}
      {showNewBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-zinc-950 tracking-tighter uppercase">Create Booking</h2>
              <button
                onClick={() => setShowNewBookingModal(false)}
                className="p-2 hover:bg-zinc-50 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {selectedSlot && (
              <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3 mb-4">
                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">Selected Slot</p>
                <p className="text-sm font-black text-zinc-950">
                  {currentDate.toLocaleDateString()} at {selectedSlot.time}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Client Name *</label>
                <input
                  type="text"
                  value={newBooking.clientName}
                  onChange={(e) => setNewBooking({...newBooking, clientName: e.target.value})}
                  className="w-full px-3 py-2 border border-zinc-100 rounded-lg text-sm focus:ring-2 focus:ring-zinc-200 outline-none"
                  placeholder="Enter client name"
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Email</label>
                <input
                  type="email"
                  value={newBooking.clientEmail}
                  onChange={(e) => setNewBooking({...newBooking, clientEmail: e.target.value})}
                  className="w-full px-3 py-2 border border-zinc-100 rounded-lg text-sm focus:ring-2 focus:ring-zinc-200 outline-none"
                  placeholder="client@example.com"
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Phone</label>
                <input
                  type="tel"
                  value={newBooking.clientPhone}
                  onChange={(e) => setNewBooking({...newBooking, clientPhone: e.target.value})}
                  className="w-full px-3 py-2 border border-zinc-100 rounded-lg text-sm focus:ring-2 focus:ring-zinc-200 outline-none"
                  placeholder="+971 50 123 4567"
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Address</label>
                <input
                  type="text"
                  value={newBooking.clientAddress}
                  onChange={(e) => setNewBooking({...newBooking, clientAddress: e.target.value})}
                  className="w-full px-3 py-2 border border-zinc-100 rounded-lg text-sm focus:ring-2 focus:ring-zinc-200 outline-none"
                  placeholder="Service address"
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Service *</label>
                <input
                  type="text"
                  value={newBooking.serviceName}
                  onChange={(e) => setNewBooking({...newBooking, serviceName: e.target.value})}
                  className="w-full px-3 py-2 border border-zinc-100 rounded-lg text-sm focus:ring-2 focus:ring-zinc-200 outline-none"
                  placeholder="e.g., Office Cleaning"
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Duration (hours)</label>
                <input
                  type="number"
                  value={newBooking.duration}
                  onChange={(e) => setNewBooking({...newBooking, duration: parseInt(e.target.value) || 1})}
                  min="1"
                  className="w-full px-3 py-2 border border-zinc-100 rounded-lg text-sm focus:ring-2 focus:ring-zinc-200 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewBookingModal(false)}
                className="flex-1 px-4 py-2 border border-zinc-100 rounded-xl text-sm font-black text-zinc-600 hover:bg-zinc-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBooking}
                className="flex-1 px-4 py-2 bg-zinc-950 text-white rounded-xl text-sm font-black hover:bg-zinc-900 transition-all"
              >
                Create Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
