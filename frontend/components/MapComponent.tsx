'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { AlertCircle, MapPin } from 'lucide-react'

interface MapComponentProps {
  currentLocation: { lat: number; lng: number } | null
}

export default function MapComponent({ currentLocation }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

      if (!apiKey) {
        setError('Google Maps API key not configured')
        return
      }

      try {
        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places', 'geocoding'],
        })

        await loader.load()

        const mapInstance = new google.maps.Map(mapRef.current, {
          center: currentLocation || { lat: 40.7128, lng: -74.0060 },
          zoom: 15,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        })

        setMap(mapInstance)
        setMapLoaded(true)

        // Add user marker
        if (currentLocation) {
          new google.maps.Marker({
            position: currentLocation,
            map: mapInstance,
            title: 'Your Location',
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            },
          })
        }
      } catch (err) {
        console.error('Error loading map:', err)
        setError('Failed to load Google Maps')
      }
    }

    initMap()
  }, [currentLocation])

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-2 text-danger-600">
          <AlertCircle className="w-5 h-5" />
          <p className="font-medium">{error}</p>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Please configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env file
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Interactive Map
          </h2>
        </div>
        {currentLocation && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Location: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
          </p>
        )}
      </div>
      <div
        ref={mapRef}
        className="w-full h-[600px] bg-gray-200 dark:bg-gray-700"
        style={{ minHeight: '600px' }}
      >
        {!mapLoaded && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading map...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

