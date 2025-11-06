'use client'

import { useState } from 'react'
import { AlertTriangle, MapPin, Send, CheckCircle } from 'lucide-react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/lib/store'

interface IncidentReportProps {
  location: { lat: number; lng: number } | null
}

export default function IncidentReport({ location }: IncidentReportProps) {
  const { user } = useAuthStore()
  const [formData, setFormData] = useState({
    message: '',
    type: 'general',
    severity: 'medium',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!location) {
      toast.error('Location is required. Please enable location access.')
      return
    }

    if (!formData.message.trim()) {
      toast.error('Please describe the incident')
      return
    }

    setSubmitting(true)

    try {
      await api.post('/api/incidents/report', {
        userId: user?.id || 'anonymous',
        location,
        message: formData.message,
        type: formData.type,
        severity: formData.severity,
      })

      toast.success('Incident reported successfully')
      setSubmitted(true)
      setFormData({ message: '', type: 'general', severity: 'medium' })

      setTimeout(() => setSubmitted(false), 5000)
    } catch (error) {
      console.error('Error reporting incident:', error)
      toast.error('Failed to report incident')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <AlertTriangle className="w-6 h-6 text-danger-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Report Incident
        </h2>
      </div>

      {submitted && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-500 rounded-lg">
          <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
            <CheckCircle className="w-5 h-5" />
            <p className="font-medium">Incident reported successfully. Help is on the way!</p>
          </div>
        </div>
      )}

      {location ? (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-500 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-400">
            <MapPin className="w-5 h-5" />
            <p className="text-sm">
              Your location will be shared: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-500 rounded-lg">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            ⚠️ Location access is required to report incidents. Please enable location services.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Incident Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="general">General</option>
            <option value="medical">Medical Emergency</option>
            <option value="crime">Crime</option>
            <option value="accident">Accident</option>
            <option value="harassment">Harassment</option>
            <option value="lost">Lost or Stolen</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Severity
          </label>
          <select
            value={formData.severity}
            onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Describe the incident in detail..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !location || !formData.message.trim()}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-danger-600 text-white rounded-lg hover:bg-danger-700 focus:outline-none focus:ring-2 focus:ring-danger-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
          <span>{submitting ? 'Reporting...' : 'Report Incident'}</span>
        </button>
      </form>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Note:</strong> In case of immediate danger, please call local emergency services. 
          This reporting system is for non-immediate assistance and documentation.
        </p>
      </div>
    </div>
  )
}

