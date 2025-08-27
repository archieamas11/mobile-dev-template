import { Block, Navbar, NavbarBackLink, Page } from 'konsta/react'
import { useNavigate } from 'react-router-dom'
import MapView from '@/components/MapView'

interface ViewProps {
  theme?: 'ios' | 'material'
}

export function View({ theme = 'material' }: ViewProps) {
  const navigate = useNavigate()

  return (
    <Page>
      <Navbar title="Map View" left={<NavbarBackLink onClick={() => navigate('/')} />} />
      <Block strong inset className="h-full">
        <MapView theme={theme} />
      </Block>
    </Page>
  )
}
