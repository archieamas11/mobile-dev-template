import { useCallback, useRef, useState } from 'react'
import { Map, Marker, Popup, NavigationControl, GeolocateControl } from 'react-map-gl/maplibre'
import type { MapRef, ViewStateChangeEvent } from 'react-map-gl/maplibre'
import { Button } from 'konsta/react'
import 'maplibre-gl/dist/maplibre-gl.css'

interface MapViewProps {
  theme?: 'ios' | 'material'
  initialBounds?: {
    longitude: number
    latitude: number
    zoom: number
  }
  markerData?: {
    longitude: number
    latitude: number
    title: string
    description: string
  }
}

interface ViewState {
  longitude: number
  latitude: number
  zoom: number
  bearing: number
  pitch: number
}

export default function MapView({
  theme = 'material',
  initialBounds = {
    longitude: 123.79788636323983, // Center of the specified bounds
    latitude: 10.248593274703158, // Center of the specified bounds
    zoom: 18,
  },
  markerData = {
    longitude: 123.797848311330114,
    latitude: 10.249306880563585,
    title: 'Sample Location',
    description: 'Sample marker in the specified area',
  },
}: MapViewProps) {
  const mapRef = useRef<MapRef>(null)
  const [viewState, setViewState] = useState<ViewState>({
    longitude: initialBounds.longitude,
    latitude: initialBounds.latitude,
    zoom: initialBounds.zoom,
    bearing: 0,
    pitch: 0,
  })

  const [showPopup, setShowPopup] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{ longitude: number; latitude: number } | null>(null)
  const [isLocating, setIsLocating] = useState(false)

  // ArcGIS World Imagery style configuration
  const arcgisStyle = {
    version: 8 as const,
    sources: {
      'arcgis-imagery': {
        type: 'raster' as const,
        tiles: ['https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256,
        attribution: 'Esri, Maxar, Earthstar Geographics, and the GIS User Community',
      },
    },
    layers: [
      {
        id: 'arcgis-imagery-layer',
        type: 'raster' as const,
        source: 'arcgis-imagery',
      },
    ],
  }

  // Handle map view state changes
  const onMove = useCallback((evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState)
  }, [])

  // Reset map to initial bounds
  const handleReset = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [initialBounds.longitude, initialBounds.latitude],
        zoom: initialBounds.zoom,
        bearing: 0,
        pitch: 0,
        duration: 1000,
      })
    }
  }, [initialBounds])

  // Handle marker click
  const handleMarkerClick = useCallback(() => {
    setShowPopup(!showPopup)
  }, [showPopup])

  // Get current location
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.')
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setCurrentLocation({ longitude, latitude })

        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [longitude, latitude],
            zoom: 15,
            duration: 1000,
          })
        }
        setIsLocating(false)
      },
      (error) => {
        console.error('Error getting location:', error)
        alert('Unable to get your location. Please check your permissions.')
        setIsLocating(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }, [])

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={onMove}
        mapStyle={arcgisStyle}
        style={{ width: '100%', height: '100%' }}
        maxZoom={24}
        minZoom={1}
        attributionControl={false}
        cooperativeGestures={true}
      >
        {/* Navigation Controls */}
        <NavigationControl position="top-right" visualizePitch={true} />

        {/* Geolocation Control */}
        <GeolocateControl
          position="top-right"
          positionOptions={{
            enableHighAccuracy: true,
          }}
          trackUserLocation={true}
        />

        {/* Single Marker */}
        <Marker longitude={markerData.longitude} latitude={markerData.latitude} anchor="bottom" onClick={handleMarkerClick}>
          <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg cursor-pointer hover:bg-red-600 transition-colors" />
        </Marker>

        {/* Current Location Marker */}
        {currentLocation && (
          <Marker longitude={currentLocation.longitude} latitude={currentLocation.latitude} anchor="center">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
          </Marker>
        )}

        {/* Popup */}
        {showPopup && (
          <Popup
            longitude={markerData.longitude}
            latitude={markerData.latitude}
            anchor="top"
            onClose={() => setShowPopup(false)}
            closeButton={true}
            closeOnClick={false}
            className="min-w-[200px]"
          >
            <div className="p-2">
              <h3 className="font-semibold text-lg mb-1">{markerData.title}</h3>
              <p className="text-gray-600 text-sm">{markerData.description}</p>
              <div className="mt-2 text-xs text-gray-500">
                <div>Lat: {markerData.latitude.toFixed(6)}</div>
                <div>Lng: {markerData.longitude.toFixed(6)}</div>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Control Buttons */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between gap-2">
        <Button onClick={getCurrentLocation} disabled={isLocating} rounded={theme === 'ios'} className={`px-4 py-2 text-sm font-medium ${isLocating ? 'opacity-50' : ''}`}>
          {isLocating ? 'Locating...' : 'My Location'}
        </Button>

        <Button onClick={handleReset} rounded={theme === 'ios'} className="px-4 py-2 text-sm font-medium">
          Reset View
        </Button>
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm">Zoom: {Math.round(viewState.zoom * 10) / 10}</div>

      {/* Attribution */}
      <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white px-2 py-1 text-xs">Esri, Maxar, Earthstar Geographics</div>

      {/* Loading indicator */}
      {isLocating && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">Getting your location...</div>
      )}
    </div>
  )
}
