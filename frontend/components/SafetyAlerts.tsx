'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Shield, MapPin, Navigation } from 'lucide-react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

interface SafetyAlertsProps {
  location: { lat: number; lng: number } | null
}

interface RiskAssessment {
  riskScore: number
  riskLevel: 'low' | 'medium' | 'high'
  factors: {
    geofencing: boolean
    timeOfDay: string
    nearbyZones: any[]
  }
  recommendations: string[]
}

export default function SafetyAlerts({ location }: SafetyAlertsProps) {
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!location) return

    const checkRisk = async () => {
      setLoading(true)
      try {
        const data = await api.get(
          `/api/location/risk-assessment?lat=${location.lat}&lng=${location.lng}`
        )
        setRiskAssessment(data)
      } catch (error) {
        console.error('Error checking risk:', error)
        toast.error('Failed to assess risk level')
      } finally {
        setLoading(false)
      }
    }

    checkRisk()
    const interval = setInterval(checkRisk, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [location])

  if (!location) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <p className="text-gray-600 dark:text-gray-400">
          Please enable location access to receive safety alerts
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!riskAssessment) return null

  const riskColors = {
    high: 'bg-danger-50 dark:bg-danger-900/20 border-danger-500 text-danger-700 dark:text-danger-400',
    medium: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-700 dark:text-yellow-400',
    low: 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400',
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Shield className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Safety Assessment
        </h2>
      </div>

      <div className={`border-l-4 rounded-lg p-4 mb-4 ${riskColors[riskAssessment.riskLevel]}`}>
        <div className="flex items-center space-x-2 mb-2">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-semibold capitalize">
            Risk Level: {riskAssessment.riskLevel}
          </span>
          <span className="text-sm">
            (Score: {(riskAssessment.riskScore * 100).toFixed(0)}%)
          </span>
        </div>

        <div className="space-y-2 mt-3">
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Location Factors:</p>
              <ul className="list-disc list-inside ml-2 mt-1">
                {riskAssessment.factors.geofencing && (
                  <li>In or near a risk zone</li>
                )}
                <li>Time of day: {riskAssessment.factors.timeOfDay}</li>
                {riskAssessment.factors.nearbyZones.length > 0 && (
                  <li>
                    {riskAssessment.factors.nearbyZones.length} nearby risk zone(s)
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {riskAssessment.recommendations.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Navigation className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Recommendations:</h3>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
            {riskAssessment.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

