# Navigation System with Turn-by-Turn Directions

A modular React Native navigatCore navigation logic with automatic location detection and pedestrian routing:

```typescript
const navigation = useNavigation({
  costing: 'pedestrian', // Walking mode for footpaths
  units: 'kilometers', // Distance units
  voiceEnabled: true, // Text-to-speech enabled
})

// One-click navigation - automatically gets current location
await navigation.startNavigation(startLocation, endLocation)

// Get current instruction for display
const instruction = navigation.getCurrentInstruction()

// Stop navigation
navigation.stopNavigation()
```

#### 4. Navigation Context (`src/contexts/NavigationContext.tsx`)ibre integration and Valhalla routing for turn-by-turn directions, featuring Google Maps-style UI and automatic location detection.

## ✨ Key Features

- 🗺️ **MapLibre Integration**: Interactive maps with ArcGIS World Imagery
- 🧭 **Valhalla Routing**: Real-time turn-by-turn navigation with pedestrian mode
- 📍 **Auto-Location**: Automatic current location detection (no manual steps required)
- 🔊 **Voice Instructions**: Text-to-speech navigation guidance
- 📱 **Mobile Optimized**: Responsive design for mobile devices
- 🎨 **Google Maps Style**: Modern, clean navigation UI similar to Google Maps
- 🔄 **Real-time Updates**: Live navigation with route recalculation
- 🛣️ **Route Visualization**: Polyline rendering on the map
- 🚶 **Pedestrian Mode**: Optimized for walking directions using footpaths

## 🚀 Quick Start

### One-Click Navigation

The system now provides **seamless one-click navigation**:

1. **Click on any marker** to open the popup
2. **Click "🧭 Get Directions"** button
3. **That's it!** The system automatically:
   - Gets your current location
   - Calculates the walking route
   - Shows Google Maps-style turn-by-turn directions
   - Displays the route on the map

**No more manual location button clicks required!**

## 🏗️ Architecture

### Modular Structure

```plaintext
src/
├── components/
│   ├── MapView.tsx                           # Main map component with navigation
│   ├── NavigationInstruction.tsx             # Basic instruction display (legacy)
│   └── GoogleMapsNavigationInstruction.tsx   # Google Maps-style UI component
├── contexts/
│   └── NavigationContext.tsx                 # Global navigation state management
├── hooks/
│   └── useNavigation.ts                      # Navigation logic and API integration
├── types/
│   └── navigation.ts                         # TypeScript definitions
├── utils/
│   └── navigation.ts                         # Utility functions (polyline decode, distance calc)
└── navigation/
    └── index.ts                              # Module exports
```

### Key Components

#### 1. MapView Component (`src/components/MapView.tsx`)

The main map component that integrates all navigation features:

- **Interactive Map**: Pan, zoom, and gesture controls
- **Marker System**: Custom markers with popup interactions
- **Navigation Controls**: Location services and map controls
- **Route Display**: Visual route overlay on the map
- **Instruction Panel**: Contextual navigation instructions

#### 2. Google Maps Navigation Component (`src/components/GoogleMapsNavigationInstruction.tsx`)

Modern Google Maps-style navigation interface:

- **Clean Header**: Navigation status with close button
- **Route Summary**: Total distance and time at a glance
- **Current Instruction**: Large, clear turn-by-turn directions
- **Next Instruction Preview**: Shows what's coming up
- **Walking Mode Indicator**: Visual confirmation of pedestrian routing
- **Voice Controls**: Replay instructions with text-to-speech
- **Rerouting Alerts**: Visual feedback during route recalculation

#### 3. Auto-Location Navigation Hook (`src/hooks/useNavigation.ts`)

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
<NavigationProvider options={{ costing: 'pedestrian', voiceEnabled: true }}>
  <App />
</NavigationProvider>

// Use in any component
const navigation = useNavigationContext();
```

#### 5. Navigation Types (`src/types/navigation.ts`)

Comprehensive TypeScript definitions:

- **Location**: Geographic coordinates with optional metadata
- **RouteResponse**: Valhalla API response structure
- **NavigationState**: Current navigation status and data
- **ManeuverInstruction**: Turn-by-turn instruction details

## Usage

### Enhanced Implementation (New)

```typescript
import { MapView, NavigationProvider } from './navigation';

function App() {
  return (
    <NavigationProvider options={{ costing: 'pedestrian', voiceEnabled: true }}>
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

### Improved Navigation Flow

1. **Click Destination Marker**: User clicks on any marker to show popup
2. **One-Click Directions**: User clicks "🧭 Get Directions" button
3. **Auto-Location Detection**: System automatically gets current GPS location
4. **Route Calculation**: System calculates walking route using Valhalla API
5. **Google Maps UI**: Modern navigation interface appears
6. **Turn-by-Turn Instructions**: Real-time pedestrian navigation begins
7. **Voice Guidance**: Optional text-to-speech instructions
8. **Route Visualization**: Walking route displayed with blue line on map

### Navigation Features

#### Enhanced "Get Directions" Experience

**Before (2-step process):**

1. ❌ User had to manually click "My Location" button first
2. ❌ Wait for location to be acquired
3. ❌ Then click "Get Directions" button
4. ❌ Required current location validation

**After (1-step process):**

1. ✅ User clicks "🧭 Get Directions" button once
2. ✅ System automatically gets current location
3. ✅ Immediate route calculation begins
4. ✅ No manual location acquisition needed

#### Google Maps-Style Navigation UI

- **Modern Header**: Clean navigation title with status indicator
- **Route Summary**: Total distance and estimated walking time
- **Current Instruction**: Large, prominent turn-by-turn direction
- **Next Step Preview**: Shows upcoming maneuver
- **Walking Indicator**: Clear pedestrian mode confirmation
- **Voice Replay**: Text-to-speech instruction replay button
- **Smart Positioning**: Responsive layout for mobile and desktop

#### Pedestrian-Optimized Routing

- **Walking Paths**: Uses footpaths and pedestrian-friendly routes
- **Accurate Times**: Realistic walking time estimates
- **Safe Routes**: Avoids highways and car-only roads
- **Accessibility**: Considers walkable surfaces and crossings

## 📱 User Experience Improvements

### Streamlined Navigation Flow

```text
OLD: Marker → Location Button → Wait → Get Directions Button → Navigate
NEW: Marker → Get Directions Button → Navigate
```

### Automatic Location Detection

- **GPS Integration**: Seamless current location acquisition
- **Error Handling**: Clear error messages for location issues
- **Loading States**: Visual feedback during location detection
- **Timeout Handling**: Fallback for slow GPS responses

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
