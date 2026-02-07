'use client'

import { useState } from 'react'
import { 
  Plus, FileText, Settings, TrendingUp, Bell, CheckSquare, 
  Search, Filter, Download, ArrowLeft, History
} from 'lucide-react'
import { MOCK_QUOTATIONS, MOCK_HISTORY, MOCK_REMINDERS, Quotation } from './lib/quotations-data'

import QuotationDashboard from './components/QuotationDashboard'
import QuotationList from './components/QuotationList'
import QuotationBuilder from './components/QuotationBuilder'
import QuotationApproval from './components/QuotationApproval'
import QuotationReminders from './components/QuotationReminders'

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>(MOCK_QUOTATIONS)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'builder' | 'approval' | 'reminders'>('dashboard')
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null)

  const handleEdit = (q: Quotation) => {
    setEditingQuotation(q)
    setActiveTab('builder')
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this quotation?')) {
      setQuotations(quotations.filter(q => q.id !== id))
    }
  }

  const handleSave = (data: any) => {
    if (editingQuotation) {
      setQuotations(quotations.map(q => q.id === editingQuotation.id ? { ...q, ...data } : q))
    } else {
      const newId = Math.max(...quotations.map(q => q.id), 0) + 1
      setQuotations([{ ...data, id: newId }, ...quotations])
    }
    setEditingQuotation(null)
    setActiveTab('list')
  }

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: TrendingUp },
    { id: 'list', label: 'Quotation List', icon: FileText },
    { id: 'builder', label: editingQuotation ? 'Edit Quotation' : 'Create New', icon: Plus },
    { id: 'approval', label: 'Approval Queue', icon: CheckSquare },
    { id: 'reminders', label: 'Notifications', icon: Bell },
  ] as const

  return (
    <div className="w-full bg-white min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-zinc-950 tracking-tighter uppercase italic">
            Quotation <span className="text-zinc-400">Intelligence</span>
          </h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-1">
            Professional Proposal & Approval Management
          </p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:bg-zinc-50 transition-all shadow-sm">
              <Download className="w-3.5 h-3.5" />
              Export
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:bg-zinc-50 transition-all shadow-sm">
              <History className="w-3.5 h-3.5" />
              Audit Registry
           </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-zinc-50/50 border border-zinc-100 p-1.5 mb-8 flex gap-1 overflow-x-auto no-scrollbar rounded-2xl">
        {tabs.map((tab) => {
          const TabIcon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                if (tab.id !== 'builder') setEditingQuotation(null)
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap text-[10px] uppercase font-black tracking-widest ${
                activeTab === tab.id
                  ? 'bg-zinc-950 text-white shadow-lg'
                  : 'text-zinc-400 hover:text-zinc-950 hover:bg-white'
              }`}
            >
              <TabIcon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content Area */}
      <div className="min-h-150">
        {activeTab === 'dashboard' && <QuotationDashboard quotations={quotations} />}
        {activeTab === 'list' && (
          <QuotationList 
            onEdit={(q: any) => {
              setEditingQuotation({
                ...q,
                version: 1,
                lastModified: new Date().toISOString()
              } as Quotation)
              setActiveTab('builder')
            }}
          />
        )}
        {activeTab === 'builder' && (
          <QuotationBuilder 
            initialData={editingQuotation}
            onSave={handleSave}
            onCancel={() => {
              setEditingQuotation(null)
              setActiveTab('list')
            }}
          />
        )}
        {activeTab === 'approval' && (
          <QuotationApproval />
        )}
        {activeTab === 'reminders' && <QuotationReminders />}
      </div>
    </div>
  )
}
