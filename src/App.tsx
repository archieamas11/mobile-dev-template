import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useLayoutEffect, useState } from 'react'
import { View } from '@/views/View'
import { Home } from '@/views/Home'
import { App } from 'konsta/react'
import { NavigationProvider } from '@/contexts/NavigationContext'

export default function Root() {
  const [theme, setTheme] = useState<'ios' | 'material'>('material')

  useLayoutEffect(() => {
    if (window.location.href.includes('safe-areas')) {
      const html = document.documentElement

      if (html) {
        html.style.setProperty('--k-safe-area-top', theme === 'ios' ? '44px' : '24px')

        html.style.setProperty('--k-safe-area-bottom', '34px')
      }
    }
  }, [theme])

  return (
    <BrowserRouter>
      <NavigationProvider options={{ costing: 'pedestrian', units: 'kilometers', voiceEnabled: true }}>
        <App safeAreas theme={theme}>
          <Routes>
            <Route path="/" element={<Home theme={theme} onTheme={setTheme} />} />
            <Route path="/view" element={<View theme={theme} />} />
          </Routes>
        </App>
      </NavigationProvider>
    </BrowserRouter>
  )
}
