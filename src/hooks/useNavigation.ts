import { useState, useCallback, useRef } from 'react'
import type { Location, RouteResponse, NavigationState, NavigationOptions } from '../types/navigation'
import { decodePolyline, calculateDistance } from '../utils/navigation'

const DEFAULT_VALHALLA_URL = 'https://valhalla1.openstreetmap.de/route'

export function useNavigation(options: NavigationOptions = {}) {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    isNavigating: false,
    currentRoute: null,
    currentManeuverIndex: 0,
    currentLegIndex: 0,
    distanceToNextManeuver: 0,
    isLoading: false,
    error: null,
  })

  const watchIdRef = useRef<number | null>(null)
  const speakingRef = useRef(false)

  const calculateRoute = useCallback(
    async (startLocation: Location, endLocation: Location, customOptions?: Partial<NavigationOptions>): Promise<RouteResponse | null> => {
      const routeOptions = { ...options, ...customOptions }

      setNavigationState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const requestBody = {
          locations: [
            {
              lat: startLocation.lat,
              lon: startLocation.lon,
              street: startLocation.street,
            },
            {
              lat: endLocation.lat,
              lon: endLocation.lon,
              street: endLocation.street,
            },
          ],
          costing: routeOptions.costing || 'auto',
          directions_options: {
            units: routeOptions.units || 'kilometers',
            narrative: true,
            maneuver_types: true,
          },
        }

        const response = await fetch(DEFAULT_VALHALLA_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: RouteResponse = await response.json()

        if (data.trip.status !== 0) {
          throw new Error(data.trip.status_message || 'Route calculation failed')
        }

        setNavigationState((prev) => ({
          ...prev,
          currentRoute: data,
          isLoading: false,
        }))

        return data
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        setNavigationState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }))
        return null
      }
    },
    [options],
  )

  // Speech must be declared before startNavigation uses it; keep hook stable via ref pattern
  const speakInstruction = useCallback(
    (instruction: string) => {
      if (options.voiceEnabled && 'speechSynthesis' in window && !speakingRef.current) {
        speakingRef.current = true
        const utterance = new SpeechSynthesisUtterance(instruction)
        utterance.rate = 0.9
        utterance.pitch = 1.0
        utterance.volume = 1.0
        utterance.onend = () => {
          speakingRef.current = false
        }
        utterance.onerror = () => {
          speakingRef.current = false
        }
        speechSynthesis.speak(utterance)
      }
    },
    [options.voiceEnabled],
  )

  const startNavigation = useCallback(
    async (startLocation: Location, endLocation: Location, customOptions?: Partial<NavigationOptions>) => {
      const route = await calculateRoute(startLocation, endLocation, customOptions)
      if (!route) return
      setNavigationState((prev) => ({
        ...prev,
        isNavigating: true,
        currentManeuverIndex: 0,
        currentLegIndex: 0,
      }))
      const decodedLegShapes = route.trip.legs.map((leg) => (leg.shape ? decodePolyline(leg.shape, 6) : []))
      if (navigator.geolocation) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            setNavigationState((prev) => {
              const currentRoute = prev.currentRoute || route
              const leg = currentRoute.trip.legs[prev.currentLegIndex]
              if (!leg) return prev
              const maneuvers = leg.maneuvers
              if (!maneuvers.length) return prev
              const maneuver = maneuvers[prev.currentManeuverIndex]
              const shapePoints = decodedLegShapes[prev.currentLegIndex]
              let distanceToNext = prev.distanceToNextManeuver
              if (maneuver && shapePoints.length && maneuver.end_shape_index < shapePoints.length) {
                const { latitude, longitude } = position.coords
                const endPoint = shapePoints[maneuver.end_shape_index]
                distanceToNext = calculateDistance(latitude, longitude, endPoint[1], endPoint[0])
              }
              let nextManeuverIndex = prev.currentManeuverIndex
              if (distanceToNext < 8 && prev.currentManeuverIndex < maneuvers.length - 1) {
                nextManeuverIndex = prev.currentManeuverIndex + 1
                const next = maneuvers[nextManeuverIndex]
                if (next?.instruction) {
                  const clean = next.instruction
                    .replace(/<[^>]+>/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim()
                  speakInstruction(clean)
                }
              }
              return { ...prev, currentRoute, currentManeuverIndex: nextManeuverIndex, distanceToNextManeuver: distanceToNext }
            })
          },
          (error) => {
            console.error('Geolocation error:', error)
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 },
        )
      }
    },
    [calculateRoute, speakInstruction],
  )

  const stopNavigation = useCallback(() => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }

    setNavigationState({
      isNavigating: false,
      currentRoute: null,
      currentManeuverIndex: 0,
      currentLegIndex: 0,
      distanceToNextManeuver: 0,
      isLoading: false,
      error: null,
    })
  }, [])

  // speakInstruction declared earlier (moved above)

  const getCurrentInstruction = useCallback(() => {
    if (!navigationState.currentRoute || !navigationState.isNavigating) {
      return null
    }

    const currentLeg = navigationState.currentRoute.trip.legs[navigationState.currentLegIndex]
    if (!currentLeg) return null

    const currentManeuver = currentLeg.maneuvers[navigationState.currentManeuverIndex]
    return currentManeuver || null
  }, [navigationState])

  const getRouteGeometry = useCallback(() => {
    if (!navigationState.currentRoute) return null

    // Decode the polyline shape for map rendering
    const legs = navigationState.currentRoute.trip.legs
    return legs.map((leg) => {
      if (leg.shape) {
        return decodePolyline(leg.shape, 6)
      }
      return []
    })
  }, [navigationState.currentRoute])

  return {
    navigationState,
    calculateRoute,
    startNavigation,
    stopNavigation,
    speakInstruction,
    getCurrentInstruction,
    getRouteGeometry,
    isNavigating: navigationState.isNavigating,
    isLoading: navigationState.isLoading,
    error: navigationState.error,
  }
}
