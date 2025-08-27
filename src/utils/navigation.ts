/**
 * Decodes polyline string to array of [lng, lat] coordinates
 * Based on the algorithm described at https://developers.google.com/maps/documentation/utilities/polylinealgorithm
 */
export function decodePolyline(polyline: string, precision: number = 6): [number, number][] {
  if (!polyline) return []

  const coordinates: [number, number][] = []
  let index = 0
  let lat = 0
  let lng = 0

  while (index < polyline.length) {
    let shift = 0
    let result = 0

    // Decode latitude
    let byte: number
    do {
      byte = polyline.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    const deltaLat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
    lat += deltaLat

    shift = 0
    result = 0

    // Decode longitude
    do {
      byte = polyline.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    const deltaLng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
    lng += deltaLng

    // Convert to actual coordinates
    const latDegrees = lat / Math.pow(10, precision)
    const lngDegrees = lng / Math.pow(10, precision)

    coordinates.push([lngDegrees, latDegrees])
  }

  return coordinates
}

/**
 * Calculates the distance between two points using the Haversine formula
 * @param lat1 First point latitude
 * @param lon1 First point longitude
 * @param lat2 Second point latitude
 * @param lon2 Second point longitude
 * @returns Distance in meters
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

/**
 * Formats distance in a human-readable way
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`
  }
  return `${(meters / 1000).toFixed(1)}km`
}

/**
 * Formats time duration in a human-readable way
 */
export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`
  }
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes}min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}min`
}

/**
 * Gets the bearing (direction) from one point to another
 * @param lat1 Starting latitude
 * @param lon1 Starting longitude
 * @param lat2 Ending latitude
 * @param lon2 Ending longitude
 * @returns Bearing in degrees (0-360)
 */
export function getBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const y = Math.sin(Δλ) * Math.cos(φ2)
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)

  const bearing = (Math.atan2(y, x) * 180) / Math.PI

  return (bearing + 360) % 360
}

/**
 * Converts compass bearing to direction text
 */
export function bearingToDirection(bearing: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(bearing / 45) % 8
  return directions[index]
}
