import { Button } from 'konsta/react'
import type { ManeuverInstruction } from '../types/navigation'
import { ManeuverType } from '../types/navigation'
import { Volume2 } from 'lucide-react'

interface NavigationInstructionProps {
  instruction: ManeuverInstruction | null
  distanceToNext?: number
  theme?: 'ios' | 'material'
  onSpeak?: (text: string) => void
  isNavigating?: boolean
  onClose?: () => void
  totalDistance?: number
  totalTime?: number
  isRerouting?: boolean
  allManeuvers?: ManeuverInstruction[]
  currentManeuverIndex?: number
}

export default function NavigationInstruction({
  instruction,
  distanceToNext,
  theme = 'material',
  onSpeak,
  isNavigating = false,
  onClose,
  totalDistance,
  totalTime,
  isRerouting = false,
  allManeuvers = [],
  currentManeuverIndex = 0,
}: NavigationInstructionProps) {
  // 🧭 Get icon for maneuver type
  const getManeuverIcon = (type: number): string => {
    switch (type) {
      case ManeuverType.kStart:
        return '📍'
      case ManeuverType.kDestination:
      case ManeuverType.kDestinationRight:
      case ManeuverType.kDestinationLeft:
        return '🏁'
      case ManeuverType.kRight:
      case ManeuverType.kSharpRight:
        return '↗️'
      case ManeuverType.kLeft:
      case ManeuverType.kSharpLeft:
        return '↖️'
      case ManeuverType.kSlightRight:
        return '↘️'
      case ManeuverType.kSlightLeft:
        return '↙️'
      case ManeuverType.kContinue:
      case ManeuverType.kStayStraight:
        return '⬆️'
      case ManeuverType.kUturnRight:
      case ManeuverType.kUturnLeft:
        return '🔄'
      case ManeuverType.kRoundaboutEnter:
        return '🔵'
      case ManeuverType.kRoundaboutExit:
        return '↗️'
      default:
        return '➡️'
    }
  }

  // 🎨 Get background color for maneuver type
  const getManeuverColor = (type: number, isCurrent = false): string => {
    if (isCurrent) return 'bg-blue-600 text-white'

    switch (type) {
      case ManeuverType.kStart:
        return 'bg-green-100 text-green-800'
      case ManeuverType.kDestination:
      case ManeuverType.kDestinationRight:
      case ManeuverType.kDestinationLeft:
        return 'bg-red-100 text-red-800'
      case ManeuverType.kUturnRight:
      case ManeuverType.kUturnLeft:
        return 'bg-orange-100 text-orange-800'
      case ManeuverType.kRoundaboutEnter:
      case ManeuverType.kRoundaboutExit:
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDistance = (meters: number) => {
    if (!isFinite(meters) || meters < 0) return '—'
    if (meters < 1000) return `${Math.round(meters)}m`
    return `${(meters / 1000).toFixed(1)}km`
  }

  const formatTime = (seconds: number) => {
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

  const handleSpeak = () => {
    if (onSpeak && instruction?.instruction) {
      onSpeak(instruction.instruction)
    }
  }

  if (!instruction && allManeuvers.length === 0) {
    return (
      <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md sm:inset-x-auto sm:top-8 sm:bottom-auto sm:left-8">
        <div className="bg-white/90 backdrop-blur rounded-xl border shadow-lg p-6">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">🧭</div>
            <p>No navigation instructions available</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className=" fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md sm:inset-x-auto sm:top-8 sm:bottom-auto sm:left-8">
      <div className="bg-white/90 backdrop-blur rounded-xl border shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 text-blue-800 inline-flex h-8 w-8 items-center justify-center rounded-full">
              <span className="text-lg">🧭</span>
            </div>
            <div>
              <h3 className="font-semibold text-base">Navigation</h3>
              {isNavigating && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>}
            </div>
          </div>

          {onClose && (
            <Button onClick={onClose} rounded={theme === 'ios'} className="px-3 py-1 text-sm w-20 border-0" outline small>
              ✕
            </Button>
          )}
        </div>

        {/* Rerouting Alert */}
        {isRerouting && (
          <div className="px-4 py-2 bg-orange-50 border-b border-orange-200">
            <div className="flex items-center gap-2 text-orange-600">
              <span>⚠️</span>
              <span className="text-sm">Recalculating route...</span>
            </div>
          </div>
        )}

        {/* Route Summary */}
        {(totalDistance || totalTime) && (
          <div className="px-4 py-3 bg-gray-50 border-b">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {totalDistance && (
                <div className="flex items-center gap-1">
                  <span>📏</span>
                  <span>{formatDistance(totalDistance * 1000)}</span>
                </div>
              )}
              {totalTime && (
                <div className="flex items-center gap-1">
                  <span>⏱️</span>
                  <span>{formatTime(totalTime)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Current Instruction */}
        {instruction && (
          <div className="p-4">
            <div className="flex items-start gap-3 p-3 rounded-lg border-2 border-blue-200 bg-blue-50">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full text-lg ${getManeuverColor(instruction.type, true)}`}>
                {getManeuverIcon(instruction.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm leading-snug mb-1 break-words">
                  {instruction.instruction
                    ?.replace(/<[^>]+>/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim()}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <span>{formatDistance(((instruction.length ?? instruction.distance) || 0) * 1000)}</span>
                  {instruction.time !== undefined && (
                    <>
                      <span>•</span>
                      <span>{formatTime(instruction.time)}</span>
                    </>
                  )}
                  {distanceToNext !== undefined && (
                    <>
                      <span>•</span>
                      <span className="font-medium text-blue-600">Next: {formatDistance(distanceToNext)}</span>
                    </>
                  )}
                </div>
              </div>

              {onSpeak && 'speechSynthesis' in window && (
                <Button onClick={handleSpeak} rounded={theme === 'ios'} className="px-2 py-1 text-xs w-24 border-0" outline>
                  <Volume2 />
                </Button>
              )}
            </div>

            {/* Next Instruction Preview */}
            {allManeuvers[currentManeuverIndex + 1] && (
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                <span>Then:</span>
                <div className={`flex h-6 w-6 items-center justify-center rounded text-sm ${getManeuverColor(allManeuvers[currentManeuverIndex + 1].type)}`}>
                  {getManeuverIcon(allManeuvers[currentManeuverIndex + 1].type)}
                </div>
                <span className="truncate">
                  {allManeuvers[currentManeuverIndex + 1].instruction
                    ?.replace(/<[^>]+>/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Walking Mode Indicator */}
        <div className="px-4 py-2 bg-green-50 border-t">
          <div className="flex items-center gap-2 text-green-700">
            <span>🚶</span>
            <span className="text-xs font-medium">Walking directions</span>
          </div>
        </div>
      </div>
    </div>
  )
}
