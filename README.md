# LocationIQ React Component Package

A comprehensive, production-ready React component library for integrating LocationIQ APIs into your React applications. Includes built-in components, custom hooks, and utility functions for geolocation, geocoding, routing, and map services.

## Features

✨ **Comprehensive API Coverage**
- Forward Geocoding (address to coordinates)
- Reverse Geocoding (coordinates to address)
- Address Autocomplete
- Directions & Routing (car, bike, foot)
- Distance Matrix API
- Timezone API
- Nearby Points of Interest
- Static Maps
- Account Balance & Usage

🚀 **Developer-Friendly**
- TypeScript support with full type definitions
- Custom React hooks for all APIs
- Pre-built, ready-to-use components
- Zero configuration setup
- Comprehensive error handling
- Utility functions for common tasks

📦 **Production-Ready**
- Fully tested and reliable
- Efficient API call management
- Loading and error states built-in
- Responsive components
- ESM and CommonJS support

## Installation

```bash
npm install @octacondeveloper/locationiq-react
# or
yarn add @octacondeveloper/locationiq-react
# or
pnpm add @octacondeveloper/locationiq-react
```

### Prerequisites
- React 16.8.0 or higher
- Node.js 14.0.0 or higher
- A free or paid LocationIQ API key from https://locationiq.com

## Quick Start

### 1. Get Your API Key

1. Visit https://locationiq.com
2. Sign up for a free account
3. Get your API key from the dashboard

### 2. Initialize the Client

```typescript
import { initializeClient } from '@octacondeveloper/locationiq-react';

// Initialize once in your app (e.g., in App.tsx)
initializeClient({
  apiKey: 'your-api-key-here',
  // baseURL: 'https://api.locationiq.com/v1' // optional, uses default if not specified
});
```

### 3. Use Components or Hooks

```typescript
import { GeocodingSearch, useGeocoding } from '@octacondeveloper/locationiq-react';

function MyComponent() {
  return (
    <GeocodingSearch
      placeholder="Search for a location..."
      onSelect={(result) => {
        console.log(result);
      }}
    />
  );
}
```

## Core Components

### 1. GeocodingSearch
Convert addresses to geographic coordinates with search functionality.

```typescript
import { GeocodingSearch } from '@octacondeveloper/locationiq-react';

export function SearchComponent() {
  return (
    <GeocodingSearch
      placeholder="Enter an address..."
      limit={10}
      countrycodes="us,ca" // Optional: filter by country codes
      onSelect={(result) => {
        console.log(`Selected: ${result.address}`);
        console.log(`Coordinates: ${result.lat}, ${result.lon}`);
      }}
    />
  );
}
```

**Props:**
- `onSelect?: (result: GeocodingResult) => void` - Callback when user selects a result
- `placeholder?: string` - Input placeholder text
- `limit?: number` - Maximum results to display (default: 10)
- `countrycodes?: string` - Comma-separated country codes to filter results
- `className?: string` - CSS class name for styling

**Returns:**
- `GeocodingResult` with properties:
  - `address: string` - Full address
  - `lat: string` - Latitude
  - `lon: string` - Longitude
  - `importance?: number` - Importance rating
  - `boundingbox?: string[]` - Bounding box coordinates

---

### 2. ReverseGeocodingDisplay
Convert coordinates to addresses. Includes built-in geolocation support.

```typescript
import { ReverseGeocodingDisplay } from '@octacondeveloper/locationiq-react';

export function LocationDisplay() {
  return (
    <ReverseGeocodingDisplay
      onResult={(address) => {
        console.log(`Current location: ${address}`);
      }}
    />
  );
}
```

**Features:**
- 📍 One-click "Get My Location" button
- Automatic geolocation using browser APIs
- Display current coordinates
- Full address information

**Props:**
- `onResult?: (address: string) => void` - Callback with address string
- `className?: string` - CSS class name

---

### 3. AddressAutocomplete
Real-time address suggestions as user types.

```typescript
import { AddressAutocomplete } from '@octacondeveloper/locationiq-react';

export function AutocompleteDemo() {
  const [address, setAddress] = useState('');

  return (
    <AddressAutocomplete
      placeholder="Start typing an address..."
      limit={5}
      onSelect={(result) => {
        setAddress(result.address);
        console.log('Selected coordinates:', result.lat, result.lon);
      }}
    />
  );
}
```

**Props:**
- `onSelect?: (result: AutocompleteResult) => void` - Selection callback
- `placeholder?: string` - Input placeholder
- `limit?: number` - Max suggestions to show
- `className?: string` - CSS class

**Minimum Query Length:** 2 characters

---

### 4. DirectionsViewer
Get directions and routing information between multiple points.

```typescript
import { DirectionsViewer } from '@octacondeveloper/locationiq-react';

export function RoutingDemo() {
  return (
    <DirectionsViewer
      profile="car" // 'car' | 'bike' | 'foot'
      onRoutesLoaded={(routes) => {
        routes.forEach((route, idx) => {
          console.log(`Route ${idx + 1}: ${route.distance}m, ${route.duration}s`);
        });
      }}
    />
  );
}
```

**Features:**
- Support for multiple profiles (car, bike, foot)
- Detailed route information with legs and steps
- Distance and duration calculations
- Turn-by-turn directions

**Example Output:**
```
Routes Found: 2
Route 1
- Distance: 5.42 km
- Duration: 12m 45s
- Legs: 3
  - Leg 1: 2.1 km (5m 30s)
  - Leg 2: 1.8 km (4m 15s)
  - Leg 3: 1.52 km (3m)
```

---

### 5. StaticMap
Embed static map images with markers in your UI.

```typescript
import { StaticMap } from '@octacondeveloper/locationiq-react';

export function MapDisplay() {
  return (
    <StaticMap
      center={[40.7128, -74.006]} // NYC
      zoom={15}
      size={[600, 400]}
      markers={[
        {
          lat: 40.7128,
          lon: -74.006,
          color: 'red',
          size: 'medium',
        },
        {
          lat: 40.7489,
          lon: -73.968,
          color: 'blue',
        },
      ]}
      alt="My Map"
    />
  );
}
```

**Props:**
- `center: [number, number]` - Map center [lat, lon]
- `zoom?: number` - Zoom level (0-18, default: 15)
- `size?: [number, number]` - Map size [width, height] in pixels
- `markers?: Array<Marker>` - Array of marker objects
- `className?: string` - CSS class
- `alt?: string` - Image alt text

---

### 6. TimezoneDisplay
Display timezone information for a given location.

```typescript
import { TimezoneDisplay } from '@octacondeveloper/locationiq-react';

export function TimeInfo() {
  return (
    <TimezoneDisplay
      lat={40.7128}
      lon={-74.006}
    />
  );
}
```

**Displays:**
- Timezone name (e.g., "America/New_York")
- Abbreviation (e.g., "EST", "EDT")
- UTC offset
- Current time
- Daylight Saving Time status

---

### 7. NearbyPOIViewer
Find and display points of interest near a location.

```typescript
import { NearbyPOIViewer } from '@octacondeveloper/locationiq-react';

export function NearbyPlaces() {
  return (
    <NearbyPOIViewer
      lat={40.7128}
      lon={-74.006}
      tag="cafe" // Optional: filter by amenity type
      limit={20}
      onPOISelect={(poi) => {
        console.log(`Selected: ${poi.name}`);
        console.log(`Type: ${poi.type}`);
      }}
    />
  );
}
```

**Props:**
- `lat?: number` - Latitude
- `lon?: number` - Longitude
- `tag?: string` - Amenity filter (cafe, restaurant, hotel, etc.)
- `limit?: number` - Max results (default: 20)
- `onPOISelect?: (poi: NearbyPOIResult) => void` - Selection callback
- `className?: string` - CSS class

**Common Tags:**
- `cafe` - Cafes
- `restaurant` - Restaurants
- `hotel` - Hotels
- `parking` - Parking
- `hospital` - Hospitals
- `pharmacy` - Pharmacies
- `bank` - Banks
- `atm` - ATMs

---

## Custom Hooks

All custom hooks provide loading, error, and data states plus manual control functions.

### useGeocoding
```typescript
import { useGeocoding } from '@octacondeveloper/locationiq-react';

function SearchComponent() {
  const { results, loading, error, geocode } = useGeocoding('Paris');

  return (
    <div>
      {loading && <p>Searching...</p>}
      {error && <p>Error: {error.message}</p>}
      <ul>
        {results.map((result) => (
          <li key={result.place_id}>
            {result.address}
          </li>
        ))}
      </ul>
      <button onClick={() => geocode('London')}>
        Search for London
      </button>
    </div>
  );
}
```

**Hook Signature:**
```typescript
const {
  results,           // GeocodingResult[]
  loading,           // boolean
  error,             // Error | null
  geocode            // (query?: string) => Promise<void>
} = useGeocoding(query: string, autoSearch?: boolean)
```

### useReverseGeocoding
```typescript
const {
  result,            // ReverseGeocodingResult | null
  loading,           // boolean
  error,             // Error | null
  reverseGeocode     // (lat?: number, lon?: number) => Promise<void>
} = useReverseGeocoding(lat?: number, lon?: number, autoFetch?: boolean)
```

### useAutocomplete
```typescript
const {
  results,           // AutocompleteResult[]
  loading,           // boolean
  error,             // Error | null
  autocomplete       // (query?: string) => Promise<void>
} = useAutocomplete(query: string)
```

### useDirections
```typescript
const {
  routes,            // RoutingRoute[]
  loading,           // boolean
  error,             // Error | null
  getDirections      // (coords?: [number, number][], profile?: 'car'|'bike'|'foot') => Promise<void>
} = useDirections(coordinates?: [number, number][])
```

### useMatrix
```typescript
const {
  matrix,            // MatrixResult | null
  loading,           // boolean
  error,             // Error | null
  getMatrix          // (coords?: [number, number][], profile?: 'car'|'bike'|'foot') => Promise<void>
} = useMatrix(coordinates?: [number, number][])
```

### useTimezone
```typescript
const {
  timezone,          // TimezoneResult | null
  loading,           // boolean
  error,             // Error | null
  getTimezone        // (lat?: number, lon?: number) => Promise<void>
} = useTimezone(lat?: number, lon?: number, autoFetch?: boolean)
```

### useNearbyPOI
```typescript
const {
  pois,              // NearbyPOIResult[]
  loading,           // boolean
  error,             // Error | null
  getNearby          // (lat?: number, lon?: number, tag?: string) => Promise<void>
} = useNearbyPOI(lat?: number, lon?: number)
```

### useBalance
```typescript
const {
  balance,           // { balance: number; currency: string } | null
  loading,           // boolean
  error,             // Error | null
  getBalance         // () => Promise<void>
} = useBalance()
```

---

## Direct API Access

For advanced use cases, use the `LocationIQClient` directly:

```typescript
import { LocationIQClient, initializeClient, getClient } from '@octacondeveloper/locationiq-react';

// Initialize
initializeClient({ apiKey: 'your-key' });

// Get the client instance
const client = getClient();

// Use any API
const results = await client.geocode({ q: 'New York' });
const address = await client.reverseGeocode({ lat: 40.7128, lon: -74.0060 });
const routes = await client.getDirections({
  coordinates: [[40.7128, -74.0060], [40.7489, -73.9680]],
  profile: 'car',
});

// Get static map URL
const mapUrl = client.getStaticMapURL({
  center: [40.7128, -74.0060],
  zoom: 15,
  size: [600, 400],
});
```

---

## Utility Functions

Coordinate and formatting utilities:

```typescript
import { CoordinateUtils } from '@octacondeveloper/locationiq-react';

// Validation
CoordinateUtils.isValidCoordinate(40.7128, -74.0060); // true

// Distance calculation (Haversine formula)
const distance = CoordinateUtils.calculateDistance(
  40.7128, -74.0060,  // NYC
  34.0522, -118.2437  // LA
);
// Result: ~3944.35 km

// Formatting
CoordinateUtils.formatCoordinate(40.7128, -74.0060, 2);
// Result: "40.71, -74.01"

// Parse from string
CoordinateUtils.parseCoordinateString("40.7128, -74.0060");
// Result: [40.7128, -74.0060]

// Bounding box calculations
const bbox = CoordinateUtils.getBoundingBox([
  [40.7128, -74.0060],
  [40.7489, -73.9680],
]);
// Result: { minLat: 40.7128, maxLat: 40.7489, minLon: -74.0060, maxLon: -73.9680 }

// Get center point
const center = CoordinateUtils.getCenterPoint([
  [40.7128, -74.0060],
  [40.7489, -73.9680],
]);

// Format distances and durations
CoordinateUtils.formatDistance(5420);     // "5.42 km"
CoordinateUtils.formatDuration(3600);     // "1h 0m 0s"

// Generate viewbox
CoordinateUtils.generateViewbox(40.7128, -74.0060, 40.7489, -73.9680);
// Result: "-74.0060,40.7128,-73.9680,40.7489"
```

---

## Complete Example Application

```typescript
import React, { useState } from 'react';
import {
  initializeClient,
  GeocodingSearch,
  DirectionsViewer,
  StaticMap,
  NearbyPOIViewer,
  TimezoneDisplay,
  CoordinateUtils,
} from '@octacondeveloper/locationiq-react';

// Initialize once
initializeClient({
  apiKey: 'your-api-key-here',
});

export function LocationApp() {
  const [startLocation, setStartLocation] = useState<[number, number] | null>(null);
  const [endLocation, setEndLocation] = useState<[number, number] | null>(null);

  return (
    <div className="app">
      <h1>LocationIQ Demo App</h1>

      {/* Origin Search */}
      <section>
        <h2>From</h2>
        <GeocodingSearch
          placeholder="Search origin..."
          onSelect={(result) => {
            const coords: [number, number] = [
              parseFloat(result.lat),
              parseFloat(result.lon),
            ];
            setStartLocation(coords);
          }}
        />
        {startLocation && (
          <p>
            Selected: {CoordinateUtils.formatCoordinate(...startLocation)}
          </p>
        )}
      </section>

      {/* Destination Search */}
      <section>
        <h2>To</h2>
        <GeocodingSearch
          placeholder="Search destination..."
          onSelect={(result) => {
            const coords: [number, number] = [
              parseFloat(result.lat),
              parseFloat(result.lon),
            ];
            setEndLocation(coords);
          }}
        />
        {endLocation && (
          <p>
            Selected: {CoordinateUtils.formatCoordinate(...endLocation)}
          </p>
        )}
      </section>

      {/* Directions */}
      {startLocation && endLocation && (
        <>
          <section>
            <h2>Directions</h2>
            <DirectionsViewer
              profile="car"
              onRoutesLoaded={(routes) => {
                routes.forEach((route, idx) => {
                  const dist = CoordinateUtils.formatDistance(route.distance);
                  const dur = CoordinateUtils.formatDuration(route.duration);
                  console.log(`Route ${idx + 1}: ${dist} in ${dur}`);
                });
              }}
            />
          </section>

          {/* Map */}
          <section>
            <h2>Map</h2>
            <StaticMap
              center={CoordinateUtils.getCenterPoint([startLocation, endLocation])}
              zoom={12}
              size={[800, 400]}
              markers={[
                { lat: startLocation[0], lon: startLocation[1], color: 'green' },
                { lat: endLocation[0], lon: endLocation[1], color: 'red' },
              ]}
            />
          </section>

          {/* Timezone for end location */}
          <section>
            <h2>Timezone at Destination</h2>
            <TimezoneDisplay lat={endLocation[0]} lon={endLocation[1]} />
          </section>

          {/* Nearby POI */}
          <section>
            <h2>Nearby Places</h2>
            <NearbyPOIViewer
              lat={endLocation[0]}
              lon={endLocation[1]}
              limit={10}
            />
          </section>
        </>
      )}
    </div>
  );
}

export default LocationApp;
```

---

## Advanced Usage

### Custom Error Handling

```typescript
import { useGeocoding } from '@octacondeveloper/locationiq-react';

function SearchWithErrorHandling() {
  const { results, loading, error, geocode } = useGeocoding('');

  const handleSearch = async (query: string) => {
    try {
      await geocode(query);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('Invalid API key')) {
          console.error('API key is invalid');
        } else if (err.message.includes('Rate limit')) {
          console.error('Rate limit exceeded - try again later');
        }
      }
    }
  };

  return (
    <div>
      {error && <div className="error-banner">{error.message}</div>}
      <button onClick={() => handleSearch('London')}>Search</button>
    </div>
  );
}
```

### Debounced Autocomplete

```typescript
import { useEffect, useState } from 'react';
import { useGeocoding } from '@octacondeveloper/locationiq-react';

function DebouncedSearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { results } = useGeocoding(debouncedQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to search..."
      />
      <ul>
        {results.map((r) => (
          <li key={r.place_id}>{r.address}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Caching API Responses

```typescript
import { useGeocoding } from '@octacondeveloper/locationiq-react';
import { useRef } from 'react';

function CachedSearch() {
  const cacheRef = useRef<Map<string, any>>(new Map());
  const { results, geocode } = useGeocoding('');

  const cachedGeocode = async (query: string) => {
    if (cacheRef.current.has(query)) {
      console.log('Using cached result');
      return cacheRef.current.get(query);
    }
    const result = await geocode(query);
    cacheRef.current.set(query, result);
    return result;
  };

  return (
    <button onClick={() => cachedGeocode('Paris')}>
      Search (with cache)
    </button>
  );
}
```

---

## Error Handling

The package provides comprehensive error handling:

| Error | Reason | Solution |
|-------|--------|----------|
| `Unauthorized: Invalid API key` | API key is invalid or missing | Check your API key in dashboard |
| `Rate limit exceeded` | Too many requests | Implement request throttling or upgrade plan |
| `Bad request` | Invalid parameters | Check API documentation for parameter format |
| `Network error` | Connection issue | Check internet connection and API status |

---

## Type Definitions

Full TypeScript support with exported types:

```typescript
import {
  GeocodingResult,
  ReverseGeocodingResult,
  AutocompleteResult,
  RoutingRoute,
  MatrixResult,
  TimezoneResult,
  NearbyPOIResult,
  StaticMapRequest,
  LocationIQConfig,
} from '@octacondeveloper/locationiq-react';
```

---

## Browser Support

- Chrome 58+
- Firefox 54+
- Safari 11+
- Edge 79+

Requires ES2015 (ES6) support.

---

## Performance Optimization

### Memoization
```typescript
import { useMemo, useCallback } from 'react';
import { useGeocoding } from '@octacondeveloper/locationiq-react';

function OptimizedComponent() {
  const memoizedQuery = useMemo(() => 'New York', []);
  const { results } = useGeocoding(memoizedQuery);

  const handleSelect = useCallback((result) => {
    console.log(result);
  }, []);

  return <div>{/* ... */}</div>;
}
```

### Lazy Loading Maps
```typescript
import { Suspense, lazy } from 'react';

const StaticMap = lazy(() => import('@octacondeveloper/locationiq-react').then(m => ({ default: m.StaticMap })));

function App() {
  return (
    <Suspense fallback={<div>Loading map...</div>}>
      <StaticMap center={[40.7128, -74.0060]} />
    </Suspense>
  );
}
```

---

## Styling

Components use semantic CSS classes for easy customization:

```css
/* Geocoding */
.locationiq-geocoding { }
.search-input-wrapper { }
.geocoding-input { }
.results-list { }
.result-item { }

/* Autocomplete */
.locationiq-autocomplete { }
.autocomplete-input { }
.suggestions-list { }

/* Directions */
.locationiq-directions { }
.routes-list { }
.route-item { }

/* Map */
.locationiq-static-map { }

/* Timezone */
.locationiq-timezone { }
.timezone-card { }

/* POI */
.locationiq-nearby-poi { }
.poi-list { }
.poi-item { }
```

---

## Migration Guides

### From Google Maps API
LocationIQ provides similar functionality with better pricing:

```typescript
// Google Maps
import { GoogleMap, Marker } from '@react-google-maps/api';

// LocationIQ
import { StaticMap } from '@octacondeveloper/locationiq-react';

// No API key in component - handled globally
<StaticMap center={[lat, lon]} markers={markers} />
```

---

## Troubleshooting

**Q: Components not rendering**
- Ensure `initializeClient()` is called before rendering components
- Check that API key is valid in LocationIQ dashboard

**Q: Rate limit errors**
- Implement debouncing for search inputs
- Consider upgrading your LocationIQ plan

**Q: Geolocation not working**
- HTTPS is required for browser geolocation
- User must grant location permission
- Check browser console for permission errors

**Q: TypeScript errors**
- Ensure TypeScript 4.0+ is installed
- Import types explicitly: `import type { GeocodingResult } from '@octacondeveloper/locationiq-react'`

---

## API Reference

See [LocationIQ API Documentation](https://docs.locationiq.com/) for:
- Rate limits and quotas
- Detailed parameter documentation
- Response format specifications
- Authentication details
- Error codes

---

## Contributing

Contributions welcome! Please see our [Contributing Guidelines](./CONTRIBUTING.md).

---

## License

MIT © 2024 LocationIQ React Package

---

## Support

- 📖 [Documentation](https://github.com/OctaconDeveloper/LocationIQ/)
- 🐛 [Report Issues](https://github.com/OctaconDeveloper/LocationIQ/issues)
- 💬 [Discussions](https://github.com/OctaconDeveloper/LocationIQ/discussions)
- 📧 [Email Support](kaakadev@gmail.com)

---

## Changelog

### v1.0.0 (2024)
- Initial release
- All core APIs implemented
- Full TypeScript support
- Comprehensive component library
- Production-ready

---

**Built with ❤️ for developers by the LocationIQ community**
