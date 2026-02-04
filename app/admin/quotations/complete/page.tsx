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
    <div className="w-full bg-white min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black mb-1">Quotation Management</h1>
          <p className="text-sm text-gray-500 font-medium">Generate professional quotes, track approvals, and manage client follow-ups</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded text-[11px] font-bold uppercase tracking-tight text-gray-600 hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
           </button>
           <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded text-[11px] font-bold uppercase tracking-tight text-gray-600 hover:bg-gray-50 transition-colors">
              <History className="w-4 h-4" />
              Audit Log
           </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded border border-gray-300 p-1 mb-6 flex gap-1 overflow-x-auto shadow-none">
        {tabs.map((tab) => {
          const TabIcon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                if (tab.id !== 'builder') setEditingQuotation(null)
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors whitespace-nowrap text-[12px] uppercase font-bold tracking-tight ${
                activeTab === tab.id
                  ? 'bg-black text-white'
                  : 'text-gray-500 hover:bg-gray-100 border border-transparent'
              }`}
            >
              <TabIcon className="w-4 h-4" />
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
