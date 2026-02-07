'use client'

import { useState, useCallback } from 'react'
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  CreditCard, 
  Mail, 
  Smartphone, 
  Lock,
  Save,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
  X
} from 'lucide-react'

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile')
  const [showSave, setShowSave] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: 'Admin User',
    email: 'admin@silvermaid.ae',
    phone: '+971-50-1234567',
    company: 'Silver Maid UAE',
    role: 'Administrator'
  })
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    meetingReminders: true,
    jobAlerts: true,
    systemUpdates: false
  })
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    sessionTimeout: '30',
    passwordExpiry: '90'
  })
  const [billingSettings, setBillingSettings] = useState({
    billingEmail: 'billing@silvermaid.ae',
    paymentMethod: 'Bank Transfer',
    invoiceFrequency: 'Monthly',
    autoRenewal: true
  })
  const [generalSettings, setGeneralSettings] = useState({
    theme: 'light',
    language: 'English',
    timezone: 'UAE (GMT+4)',
    dateFormat: 'DD/MM/YYYY'
  })

  const sections = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
    { id: 'general', label: 'General', icon: Globe },
  ]

  const handleSaveSettings = useCallback(() => {
    alert('Settings saved successfully!')
    setShowSave(false)
  }, [])

  const handleProfileChange = useCallback((field: any, value: any) => {
    setProfileData({ ...profileData, [field]: value })
    setShowSave(true)
  }, [profileData])

  const handleNotificationToggle = useCallback((setting: string) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting as keyof typeof notificationSettings]: !(notificationSettings[setting as keyof typeof notificationSettings] as any)
    })
    setShowSave(true)
  }, [notificationSettings])

  const handleSecurityChange = useCallback((field: any, value: any) => {
    setSecuritySettings({ ...securitySettings, [field]: value })
    setShowSave(true)
  }, [securitySettings])

  const handleBillingChange = useCallback((field: any, value: any) => {
    setBillingSettings({ ...billingSettings, [field]: value })
    setShowSave(true)
  }, [billingSettings])

  const handleGeneralChange = useCallback((field: any, value: any) => {
    setGeneralSettings({ ...generalSettings, [field]: value })
    setShowSave(true)
  }, [generalSettings])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-1">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeSection === section.id 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {section.label}
              </button>
            )
          })}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Settings */}
          {activeSection === 'profile' && (
            <div className="bg-card rounded-xl border shadow-sm p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => handleProfileChange('fullName', e.target.value)}
                    className="w-full px-4 py-2 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="w-full px-4 py-2 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    className="w-full px-4 py-2 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => handleProfileChange('company', e.target.value)}
                    className="w-full px-4 py-2 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <select
                    value={profileData.role}
                    onChange={(e) => handleProfileChange('role', e.target.value)}
                    className="w-full px-4 py-2 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>Administrator</option>
                    <option>Manager</option>
                    <option>Supervisor</option>
                    <option>Staff</option>
                  </select>
                </div>

                <button
                  onClick={() => alert('Password change functionality would open a secure dialog')}
                  className="w-full px-4 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-zinc-100 dark:hover:opacity-90/20 transition-colors mt-4"
                >
                  <Lock className="inline-block mr-2 h-4 w-4" />
                  Change Password
                </button>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeSection === 'notifications' && (
            <div className="bg-card rounded-xl border shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-bold">Notification Preferences</h2>

              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
                  { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive urgent alerts via SMS' },
                  { key: 'meetingReminders', label: 'Meeting Reminders', description: 'Get reminded about scheduled meetings' },
                  { key: 'jobAlerts', label: 'Job Updates', description: 'Receive notifications about job assignments' },
                  { key: 'systemUpdates', label: 'System Updates', description: 'Get notified about system maintenance' }
                ].map(({ key, label, description }) => (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium">{label}</p>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle(key)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        (notificationSettings as any)[key] ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          (notificationSettings as any)[key] ? 'translate-x-6' : ''
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeSection === 'security' && (
            <div className="bg-card rounded-xl border shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-bold">Security Settings</h2>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <button
                    onClick={() => handleSecurityChange('twoFactor', !securitySettings.twoFactor)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      securitySettings.twoFactor ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        securitySettings.twoFactor ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
                  <select
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                    className="w-full px-4 py-2 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>15</option>
                    <option>30</option>
                    <option>60</option>
                    <option>120</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Password Expiry (days)</label>
                  <select
                    value={securitySettings.passwordExpiry}
                    onChange={(e) => handleSecurityChange('passwordExpiry', e.target.value)}
                    className="w-full px-4 py-2 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>30</option>
                    <option>60</option>
                    <option>90</option>
                    <option>180</option>
                  </select>
                </div>

                <button className="w-full px-4 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-zinc-100 dark:hover:opacity-90/20 transition-colors mt-4">
                  View Active Sessions
                </button>
              </div>
            </div>
          )}

          {/* Billing Settings */}
          {activeSection === 'billing' && (
            <div className="bg-card rounded-xl border shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-bold">Billing & Subscription</h2>

              <div className="bg-zinc-100 dark:bg-zinc-900/20 border border-zinc-300 dark:border-zinc-300 rounded-lg p-4 mb-6">
                <p className="text-sm text-zinc-900 dark:text-white">
                  <strong>Current Plan:</strong> Professional Plan - AED 5,000/month (Active until Dec 31, 2025)
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Billing Email</label>
                  <input
                    type="email"
                    value={billingSettings.billingEmail}
                    onChange={(e) => handleBillingChange('billingEmail', e.target.value)}
                    className="w-full px-4 py-2 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Payment Method</label>
                  <select
                    value={billingSettings.paymentMethod}
                    onChange={(e) => handleBillingChange('paymentMethod', e.target.value)}
                    className="w-full px-4 py-2 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>Credit Card</option>
                    <option>Bank Transfer</option>
                    <option>Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Invoice Frequency</label>
                  <select
                    value={billingSettings.invoiceFrequency}
                    onChange={(e) => handleBillingChange('invoiceFrequency', e.target.value)}
                    className="w-full px-4 py-2 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Annually</option>
                  </select>
                </div>

                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-Renewal</p>
                    <p className="text-sm text-muted-foreground">Automatically renew subscription</p>
                  </div>
                  <button
                    onClick={() => handleBillingChange('autoRenewal', !billingSettings.autoRenewal)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      billingSettings.autoRenewal ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        billingSettings.autoRenewal ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>

                <button className="w-full px-4 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-zinc-100 dark:hover:opacity-90/20 transition-colors mt-4">
                  View Invoices
                </button>
              </div>
            </div>
          )}

          {/* General Settings */}
          {activeSection === 'general' && (
            <div className="bg-card rounded-xl border shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-bold">General Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Theme</label>
                  <select
                    value={generalSettings.theme}
                    onChange={(e) => handleGeneralChange('theme', e.target.value)}
                    className="w-full px-4 py-2 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>light</option>
                    <option>dark</option>
                    <option>auto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select
                    value={generalSettings.language}
                    onChange={(e) => handleGeneralChange('language', e.target.value)}
                    className="w-full px-4 py-2 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>English</option>
                    <option>Arabic</option>
                    <option>French</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Timezone</label>
                  <select
                    value={generalSettings.timezone}
                    onChange={(e) => handleGeneralChange('timezone', e.target.value)}
                    className="w-full px-4 py-2 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>UAE (GMT+4)</option>
                    <option>UK (GMT+0)</option>
                    <option>US East (GMT-5)</option>
                    <option>Australia (GMT+10)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date Format</label>
                  <select
                    value={generalSettings.dateFormat}
                    onChange={(e) => handleGeneralChange('dateFormat', e.target.value)}
                    className="w-full px-4 py-2 bg-muted border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      {showSave && (
        <div className="fixed bottom-6 right-6 bg-primary text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Save className="h-4 w-4" />
          <span className="font-medium">Changes detected</span>
          <button
            onClick={handleSaveSettings}
            className="ml-4 px-4 py-1.5 bg-white text-primary rounded font-medium text-sm hover:bg-zinc-100 transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  )
}
