'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MapComponent from '@/components/MapComponent'
import SafetyAlerts from '@/components/SafetyAlerts'
import Chatbot from '@/components/Chatbot'
import TranslationPanel from '@/components/TranslationPanel'
import IncidentReport from '@/components/IncidentReport'
import Dashboard from '@/components/Dashboard'
import Header from '@/components/Header'
import { useAuthStore } from '@/lib/store'

export default function Home() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'map' | 'dashboard' | 'chatbot' | 'translate' | 'report'>('map')
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'map'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            🗺️ Map
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('chatbot')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'chatbot'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            🤖 Chatbot
          </button>
          <button
            onClick={() => setActiveTab('translate')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'translate'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            🌐 Translate
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'report'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            🚨 Report Incident
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'map' && (
            <div className="space-y-6">
              <MapComponent currentLocation={currentLocation} />
              <SafetyAlerts location={currentLocation} />
            </div>
          )}
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'chatbot' && <Chatbot location={currentLocation} />}
          {activeTab === 'translate' && <TranslationPanel />}
          {activeTab === 'report' && <IncidentReport location={currentLocation} />}
        </div>
      </main>
    </div>
  )
}

