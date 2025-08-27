import { Button } from 'konsta/react'
import type { ManeuverInstruction } from '../types/navigation'
import { ManeuverType } from '../types/navigation'

interface NavigationInstructionProps {
  instruction: ManeuverInstruction | null
  distanceToNext?: number
  theme?: 'ios' | 'material'
  onSpeak?: (text: string) => void
}

export default function NavigationInstruction({ instruction, distanceToNext, theme = 'material', onSpeak }: NavigationInstructionProps) {
  if (!instruction) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-gray-500 text-center">No navigation instructions available</p>
      </div>
    )
  }

  const getManeuverIcon = (type: number) => {
    switch (type) {
      case ManeuverType.kStart:
        return '🚗'
      case ManeuverType.kDestination:
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

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`
    }
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
    if (onSpeak && instruction.instruction) {
      onSpeak(instruction.instruction)
    }
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
      <div className="flex items-center gap-4">
        <div className="text-3xl">{getManeuverIcon(instruction.type)}</div>

        <div className="flex-1">
          <p className="text-lg font-semibold text-gray-800 mb-1">{instruction.instruction}</p>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Distance: {formatDistance(instruction.distance)}</span>
            <span>Time: {formatTime(instruction.time)}</span>
            {distanceToNext !== undefined && <span className="font-medium text-blue-600">Next: {formatDistance(distanceToNext)}</span>}
          </div>
        </div>

        {onSpeak && 'speechSynthesis' in window && (
          <Button onClick={handleSpeak} rounded={theme === 'ios'} className="px-3 py-2 text-sm" outline>
            🔊
          </Button>
        )}
      </div>
    </div>
  )
}
