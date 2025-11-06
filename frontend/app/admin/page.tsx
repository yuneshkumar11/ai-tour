'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart3, Map, TrendingUp } from 'lucide-react'
import Dashboard from '@/components/Dashboard'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

interface HeatmapData {
  heatmapData: Array<{
    lat: number
    lng: number
    intensity: number
    type: string
  }>
}

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'analytics' | 'heatmap' | 'predictive'>('analytics')
  const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null)

  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const data = await api.get('/api/admin/heatmap')
        setHeatmapData(data)
      } catch (error) {
        console.error('Error fetching heatmap:', error)
      }
    }
    fetchHeatmap()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Admin Dashboard
        </h1>

        <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'heatmap'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Map className="w-4 h-4 inline mr-2" />
            Heatmap
          </button>
          <button
            onClick={() => setActiveTab('predictive')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'predictive'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Predictive Risk
          </button>
        </div>

        <div className="mt-6">
          {activeTab === 'analytics' && <Dashboard />}
          {activeTab === 'heatmap' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                User Density & Incident Heatmap
              </h2>
              {heatmapData && (
                <div className="space-y-2">
                  {heatmapData.heatmapData.map((point, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <p className="text-sm">
                        <span className="font-medium">Location:</span>{' '}
                        {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Intensity:</span>{' '}
                        {(point.intensity * 100).toFixed(0)}% ({point.type})
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'predictive' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Predictive Risk Analytics
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Predictive risk analysis will be displayed here. This feature uses AI to forecast
                potential high-risk areas based on historical data and patterns.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

