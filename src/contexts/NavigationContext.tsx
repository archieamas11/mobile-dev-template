import { createContext, useContext, ReactNode } from 'react'
import { useNavigation } from '../hooks/useNavigation'
import type { NavigationOptions } from '../types/navigation'

type NavigationContextType = ReturnType<typeof useNavigation>

const NavigationContext = createContext<NavigationContextType | null>(null)

interface NavigationProviderProps {
  children: ReactNode
  options?: NavigationOptions
}

export function NavigationProvider({ children, options = {} }: NavigationProviderProps) {
  const navigationUtils = useNavigation(options)

  return <NavigationContext.Provider value={navigationUtils}>{children}</NavigationContext.Provider>
}

export function useNavigationContext() {
  const context = useContext(NavigationContext)

  if (!context) {
    throw new Error('useNavigationContext must be used within a NavigationProvider')
  }

  return context
}
