# Navigation System with Turn-by-Turn Directions

A modular React Native navigation system with MapLibre integration and Valhalla routing for turn-by-turn directions.

## Features

- 🗺️ **MapLibre Integration**: Interactive maps with ArcGIS World Imagery
- 🧭 **Valhalla Routing**: Real-time turn-by-turn navigation
- 📍 **Location Services**: GPS tracking and current location detection
- 🔊 **Voice Instructions**: Text-to-speech navigation guidance
- 📱 **Mobile Optimized**: Responsive design for mobile devices
- 🎨 **Theming Support**: iOS and Material Design themes
- 🔄 **Real-time Updates**: Live navigation with route recalculation
- 🛣️ **Route Visualization**: Polyline rendering on the map

## Architecture

### Modular Structure

```
src/
├── components/
│   ├── MapView.tsx              # Main map component with navigation
│   └── NavigationInstruction.tsx # Turn-by-turn instruction display
├── contexts/
│   └── NavigationContext.tsx    # Global navigation state management
├── hooks/
│   └── useNavigation.ts         # Navigation logic and API integration
├── types/
│   └── navigation.ts            # TypeScript definitions
├── utils/
│   └── navigation.ts            # Utility functions (polyline decode, distance calc)
└── navigation/
    └── index.ts                 # Module exports
```

### Key Components

#### 1. MapView Component (`src/components/MapView.tsx`)

The main map component that integrates all navigation features:

- **Interactive Map**: Pan, zoom, and gesture controls
- **Marker System**: Custom markers with popup interactions
- **Navigation Controls**: Location services and map controls
- **Route Display**: Visual route overlay on the map
- **Instruction Panel**: Contextual navigation instructions

#### 2. Navigation Hook (`src/hooks/useNavigation.ts`)

Core navigation logic with Valhalla integration:

```typescript
const navigation = useNavigation({
  costing: 'auto', // routing profile
  units: 'kilometers', // distance units
  voiceEnabled: true, // text-to-speech
})

// Start navigation
await navigation.startNavigation(startLocation, endLocation)

// Get current instruction
const instruction = navigation.getCurrentInstruction()

// Stop navigation
navigation.stopNavigation()
```

#### 3. Navigation Context (`src/contexts/NavigationContext.tsx`)

Global state management for navigation:

```typescript
// Wrap your app with NavigationProvider
<NavigationProvider options={{ costing: 'auto', voiceEnabled: true }}>
  <App />
</NavigationProvider>

// Use in any component
const navigation = useNavigationContext();
```

#### 4. Navigation Types (`src/types/navigation.ts`)

Comprehensive TypeScript definitions:

- **Location**: Geographic coordinates with optional metadata
- **RouteResponse**: Valhalla API response structure
- **NavigationState**: Current navigation status and data
- **ManeuverInstruction**: Turn-by-turn instruction details

## Usage

### Basic Implementation

```typescript
import { MapView, NavigationProvider } from './navigation';

function App() {
  return (
    <NavigationProvider options={{ costing: 'auto', voiceEnabled: true }}>
      <MapView
        theme="material"
        initialBounds={{
          longitude: 123.797886,
          latitude: 10.248593,
          zoom: 18,
        }}
        markerData={{
          longitude: 123.797848,
          latitude: 10.249307,
          title: 'Destination',
          description: 'Your destination marker',
        }}
      />
    </NavigationProvider>
  );
}
```

### Navigation Flow

1. **Get Current Location**: User clicks "My Location" button
2. **Select Destination**: User clicks on a marker to show popup
3. **Start Navigation**: User clicks "Get Directions" in popup
4. **Route Calculation**: System calculates route using Valhalla API
5. **Turn-by-Turn Instructions**: Real-time navigation begins
6. **Voice Guidance**: Optional text-to-speech instructions
7. **Route Visualization**: Route displayed on map with blue line

### Navigation Features

#### Get Directions Button in Popup

The popup now includes a "Get Directions" button that:

- ✅ Checks if current location is available
- ✅ Calculates route using Valhalla routing API
- ✅ Starts turn-by-turn navigation
- ✅ Shows route on map with visual polyline
- ✅ Displays navigation instructions panel
- ✅ Enables voice guidance (if supported)

#### Navigation Instructions Panel

- **Current Instruction**: Shows the next maneuver to perform
- **Distance Information**: Distance to next turn and total distance
- **Visual Icons**: Directional icons based on maneuver type
- **Voice Button**: Replay instruction with text-to-speech
- **Error Handling**: Shows routing errors and connectivity issues

## API Configuration

### Valhalla Routing API

The system uses the Valhalla routing API for turn-by-turn directions:

```typescript
const DEFAULT_VALHALLA_URL = 'https://valhalla1.openstreetmap.de/route'

// Request structure
{
  "locations": [
    { "lat": 10.248593, "lon": 123.797886, "street": "Start Location" },
    { "lat": 10.249307, "lon": 123.797848, "street": "End Location" }
  ],
  "costing": "auto",
  "directions_options": {
    "units": "kilometers",
    "narrative": true,
    "maneuver_types": true
  }
}
```

### Supported Routing Profiles

- **auto**: Car routing with traffic considerations
- **pedestrian**: Walking routes with footpaths
- **bicycle**: Cycling routes with bike lanes

## Customization

### Theming

The component supports both iOS and Material Design themes:

```typescript
<MapView theme="ios" />        // iOS-style components
<MapView theme="material" />   // Material Design components
```

### Navigation Options

```typescript
const options: NavigationOptions = {
  costing: 'auto', // routing profile
  units: 'kilometers', // 'kilometers' | 'miles'
  voiceEnabled: true, // enable text-to-speech
  recalculateOnDeviation: true, // auto-recalculate if off-route
}
```

### Map Styling

The map uses ArcGIS World Imagery for satellite view. You can customize the map style:

```typescript
const customMapStyle = {
  version: 8,
  sources: {
    'custom-source': {
      type: 'raster',
      tiles: ['your-tile-server/{z}/{x}/{y}'],
      tileSize: 256,
    },
  },
  layers: [
    {
      id: 'custom-layer',
      type: 'raster',
      source: 'custom-source',
    },
  ],
}
```

## Dependencies

```json
{
  "react-map-gl": "^7.x.x",
  "maplibre-gl": "^3.x.x",
  "konsta": "^3.x.x",
  "react": "^18.x.x",
  "typescript": "^5.x.x"
}
```

## Browser Support

- **Geolocation API**: Required for current location detection
- **Speech Synthesis API**: Optional, for voice instructions
- **Fetch API**: Required for routing API requests
- **WebGL**: Required for map rendering

## Error Handling

The system includes comprehensive error handling:

- **Network Errors**: API connectivity issues
- **Routing Errors**: No route found, invalid locations
- **Location Errors**: GPS unavailable, permission denied
- **Voice Errors**: Speech synthesis not supported

## Performance Optimization

- **Route Caching**: Prevents unnecessary API calls
- **Polyline Compression**: Efficient route geometry encoding
- **Component Memoization**: Reduces unnecessary re-renders
- **Lazy Loading**: Components loaded on demand
- **Memory Management**: Proper cleanup of listeners and timers

## Future Enhancements

- [ ] **Offline Routing**: Download maps for offline navigation
- [ ] **Traffic Integration**: Real-time traffic data
- [ ] **Route Alternatives**: Multiple route options
- [ ] **Waypoints**: Multi-stop navigation
- [ ] **Voice Commands**: Voice-controlled navigation
- [ ] **Lane Guidance**: Lane-level directions
- [ ] **Speed Limits**: Display current speed limits
- [ ] **Hazard Alerts**: Construction, accidents, etc.

## License

This navigation system is part of a React Native mobile application template and follows the project's license terms.
