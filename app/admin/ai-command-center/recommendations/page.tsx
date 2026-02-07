'use client'

import { useState } from 'react'
import { Lightbulb, CheckCircle, TrendingUp, Users, DollarSign, Target, ThumbsUp, ThumbsDown, Zap } from 'lucide-react'

export default function Recommendations() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [feedbackMap, setFeedbackMap] = useState<Record<number, string>>({})

  const recommendations = [
    {
      id: 1,
      category: 'revenue',
      priority: 'high',
      title: 'Launch Premium Deep Cleaning Package',
      description: 'AI models predict 34% profit increase by introducing premium tier service',
      impact: 'Revenue increase: AED 425K/quarter',
      confidence: 96.2,
      action: 'Create premium service offering with white-glove service',
      timeline: 'Next 2 weeks',
      effort: 'Medium'
    },
    {
      id: 2,
      category: 'demand',
      priority: 'critical',
      title: 'Accelerate Hiring - 15 New Positions',
      description: 'Demand forecast shows 23% increase in Q2. Current staffing insufficient.',
      impact: 'Prevent service delays, increase capacity',
      confidence: 94.1,
      action: 'Post 15 positions immediately, focus on cleaners and supervisors',
      timeline: 'This week',
      effort: 'High'
    },
    {
      id: 3,
      category: 'retention',
      priority: 'high',
      title: 'Win-Back Campaign for At-Risk Clients',
      description: '23 high-value clients showing churn signals. Targeted intervention needed.',
      impact: 'Retain AED 234K in annual revenue',
      confidence: 87.6,
      action: 'Send personalized offers: 15% discount + free service',
      timeline: 'This week',
      effort: 'Low'
    },
    {
      id: 4,
      category: 'profitability',
      priority: 'medium',
      title: 'Optimize Carpet Cleaning Pricing',
      description: 'Current pricing 8% below market rate. Increase to match demand/profitability.',
      impact: 'Additional AED 85K profit/quarter',
      confidence: 89.3,
      action: 'Increase prices by 12-15% in phases',
      timeline: 'Next 4 weeks',
      effort: 'Low'
    },
    {
      id: 5,
      category: 'efficiency',
      priority: 'medium',
      title: 'Cross-Train Staff on New Services',
      description: 'Prediction shows demand for disinfection services increasing 31%',
      impact: 'Utilize existing staff for new revenue stream',
      confidence: 88.7,
      action: 'Train 8 current staff on disinfection service',
      timeline: 'Next 6 weeks',
      effort: 'Medium'
    },
    {
      id: 6,
      category: 'customer',
      priority: 'medium',
      title: 'Implement Subscription Model',
      description: 'AI analysis shows 67% of clients would adopt monthly subscription',
      impact: 'Recurring revenue: AED 312K/year',
      confidence: 85.4,
      action: 'Develop 3 subscription tiers (silver/gold/platinum)',
      timeline: 'Next 8 weeks',
      effort: 'High'
    },
    {
      id: 7,
      category: 'market',
      priority: 'high',
      title: 'Target Commercial Segment Growth',
      description: 'Commercial clients have 3.2x higher CLV than residential',
      impact: 'Potential AED 1.2M additional annual revenue',
      confidence: 92.1,
      action: 'Allocate 20% of resources to B2B sales and marketing',
      timeline: 'This quarter',
      effort: 'High'
    },
    {
      id: 8,
      category: 'revenue',
      priority: 'low',
      title: 'Launch Seasonal Service Bundles',
      description: 'Spring/summer peak demand ideal for bundled offerings',
      impact: 'Increase average transaction value by 18%',
      confidence: 81.2,
      action: 'Create spring cleaning and summer maintenance bundles',
      timeline: 'Next 3 weeks',
      effort: 'Low'
    },
  ]

  const categories = [
    { id: 'all', label: 'All Recommendations', icon: Lightbulb },
    { id: 'revenue', label: 'Revenue Growth', icon: TrendingUp },
    { id: 'demand', label: 'Demand Planning', icon: Users },
    { id: 'retention', label: 'Client Retention', icon: Target },
    { id: 'profitability', label: 'Profitability', icon: DollarSign },
  ]

  const filteredRecs = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.category === selectedCategory)

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'critical': return 'bg-red-100 text-red-700'
      case 'high': return 'bg-orange-100 text-orange-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-zinc-100 text-zinc-950'
    }
  }

  const getEffortColor = (effort: string) => {
    switch(effort) {
      case 'High': return 'text-red-600'
      case 'Medium': return 'text-yellow-600'
      default: return 'text-green-600'
    }
  }

  const handleFeedback = (id: number, type: 'positive' | 'negative') => {
    setFeedbackMap(prev => ({
      ...prev,
      [id]: type
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            <Lightbulb className="h-8 w-8 text-yellow-500" />
            AI Recommendations
          </h1>
          <p className="text-muted-foreground mt-1">Data-driven strategic recommendations from advanced analytics</p>
        </div>
      </div>

      {/* Category Selector */}
      <div className="bg-card border rounded-lg p-4">
        <p className="text-sm font-bold mb-3">Filter by Category</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {categories.map(cat => {
            const Icon = cat.icon
            const count = selectedCategory === 'all' 
              ? recommendations.length 
              : recommendations.filter(r => r.category === cat.id).length
            
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedCategory === cat.id
                    ? 'border-zinc-950 bg-zinc-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <Icon className={`h-5 w-5 mb-2 ${selectedCategory === cat.id ? 'text-zinc-950' : 'text-gray-600'}`} />
                <p className="text-xs font-bold">{cat.label}</p>
                <p className="text-[10px] text-muted-foreground">{cat.id === 'all' ? recommendations.length : count} items</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-linear-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Critical/High Priority</p>
          <p className="text-3xl font-black text-red-700">{filteredRecs.filter(r => r.priority === 'critical' || r.priority === 'high').length}</p>
        </div>
        <div className="bg-linear-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Potential Impact</p>
          <p className="text-2xl font-black text-green-700">AED 2.8M+</p>
          <p className="text-xs text-green-600">Annual revenue</p>
        </div>
        <div className="bg-linear-to-br from-zinc-50 to-zinc-100 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Avg Confidence</p>
          <p className="text-3xl font-black text-zinc-950">90.1%</p>
        </div>
        <div className="bg-linear-to-br from-zinc-50 to-zinc-100 border border-purple-200 rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Quick Wins Available</p>
          <p className="text-3xl font-black text-purple-700">3</p>
          <p className="text-xs text-zinc-800">Low effort items</p>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-3">
        {filteredRecs.map((rec) => (
          <div key={rec.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg">{rec.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold capitalize ${getPriorityColor(rec.priority)}`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{rec.description}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                <p className="text-2xl font-black text-zinc-950">{rec.confidence}%</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Financial Impact</p>
                <p className="text-sm font-bold text-green-600">{rec.impact}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Implementation</p>
                <p className="text-sm font-bold">{rec.action}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Timeline</p>
                <p className="text-sm font-bold text-zinc-950">{rec.timeline}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Effort Level</p>
                <p className={`text-sm font-bold ${getEffortColor(rec.effort)}`}>{rec.effort}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">Helpful?</span>
                <button 
                  onClick={() => handleFeedback(rec.id, 'positive')}
                  className={`p-1.5 rounded transition-colors ${feedbackMap[rec.id] === 'positive' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100'}`}
                  title="Useful"
                >
                  <ThumbsUp className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleFeedback(rec.id, 'negative')}
                  className={`p-1.5 rounded transition-colors ${feedbackMap[rec.id] === 'negative' ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'}`}
                  title="Not useful"
                >
                  <ThumbsDown className="h-4 w-4" />
                </button>
              </div>
              <button className="px-4 py-2 bg-zinc-950 text-white rounded-lg hover:bg-zinc-950 transition-colors font-bold text-sm">
                Implement
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
        <Zap className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-yellow-900">Smart Recommendations</p>
          <p className="text-sm text-yellow-800 mt-1">• Generated by advanced AI algorithms • Based on forecasting models • Include confidence scores • Prioritized by business impact • Estimated implementation effort included</p>
        </div>
      </div>
    </div>
  )
}