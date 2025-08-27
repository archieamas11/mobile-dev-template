// Navigation types for Valhalla routing integration

export interface Location {
  lat: number
  lon: number
  street?: string
  city?: string
}

export interface ManeuverInstruction {
  type: number
  instruction: string
  verbal_transition_alert_instruction?: string
  verbal_pre_transition_instruction?: string
  verbal_post_transition_instruction?: string
  /** Valhalla returns maneuver distance as `length` (in route units, typically km or miles). Keep `distance` optional for forward compatibility */
  length?: number
  /** Some responses/libraries might map distance directly; treat as km/miles same as length */
  distance?: number
  /** Maneuver travel time in seconds */
  time: number
  /** Polyline shape start index */
  begin_shape_index: number
  /** Polyline shape end index */
  end_shape_index: number
  rough?: boolean
}

export interface NavigationLeg {
  summary: {
    time: number
    length: number
    min_lat: number
    min_lon: number
    max_lat: number
    max_lon: number
  }
  maneuvers: ManeuverInstruction[]
  shape: string // Encoded polyline
}

export interface RouteResponse {
  trip: {
    locations: Location[]
    legs: NavigationLeg[]
    summary: {
      time: number
      length: number
      min_lat: number
      min_lon: number
      max_lat: number
      max_lon: number
    }
    status: number
    status_message: string
    units: 'kilometers' | 'miles'
  }
}

export interface NavigationState {
  isNavigating: boolean
  currentRoute: RouteResponse | null
  currentManeuverIndex: number
  currentLegIndex: number
  distanceToNextManeuver: number
  isLoading: boolean
  error: string | null
}

export interface NavigationOptions {
  costing?: 'auto' | 'pedestrian' | 'bicycle'
  units?: 'kilometers' | 'miles'
  voiceEnabled?: boolean
  recalculateOnDeviation?: boolean
}

// Maneuver types from Valhalla API
export enum ManeuverType {
  kNone = 0,
  kStart = 1,
  kStartRight = 2,
  kStartLeft = 3,
  kDestination = 4,
  kDestinationRight = 5,
  kDestinationLeft = 6,
  kBecomes = 7,
  kContinue = 8,
  kSlightRight = 9,
  kRight = 10,
  kSharpRight = 11,
  kUturnRight = 12,
  kUturnLeft = 13,
  kSharpLeft = 14,
  kLeft = 15,
  kSlightLeft = 16,
  kRampStraight = 17,
  kRampRight = 18,
  kRampLeft = 19,
  kExitRight = 20,
  kExitLeft = 21,
  kStayStraight = 22,
  kStayRight = 23,
  kStayLeft = 24,
  kMerge = 25,
  kRoundaboutEnter = 26,
  kRoundaboutExit = 27,
  kFerryEnter = 28,
  kFerryExit = 29,
  kTransit = 30,
  kTransitTransfer = 31,
  kTransitRemainOn = 32,
  kTransitConnectionStart = 33,
  kTransitConnectionTransfer = 34,
  kTransitConnectionDestination = 35,
  kPostTransitConnection = 36,
}
