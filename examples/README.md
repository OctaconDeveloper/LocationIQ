# LocationIQ React Package - Usage Examples

This directory contains practical examples of how to use the LocationIQ React component package.

## Files

- **GeocodingExample.tsx** - Address geocoding and reverse geocoding examples
- **RoutingExample.tsx** - Directions, routing, and distance matrix examples
- **UtilityExample.tsx** - Autocomplete, nearby POI, and account balance examples
- **App.tsx** - Complete demo application showcasing all features

## Quick Start

### 1. Setup Environment

Create a `.env` file:
```
REACT_APP_LOCATIONIQ_API_KEY=your-api-key-here
```

### 2. Basic Geocoding Example

```typescript
import { initializeClient, GeocodingSearch } from '@octacondeveloper/locationiq-react';

// Initialize once in your app
initializeClient({
  apiKey: process.env.REACT_APP_LOCATIONIQ_API_KEY,
});

export function MyComponent() {
  return (
    <GeocodingSearch
      placeholder="Search for a location..."
      onSelect={(result) => {
        console.log(`Selected: ${result.address}`);
        console.log(`Coordinates: ${result.lat}, ${result.lon}`);
      }}
    />
  );
}
```

### 3. Using Hooks

```typescript
import { useGeocoding, useDirections } from '@octacondeveloper/locationiq-react';

export function HookExample() {
  const { results, loading, error, geocode } = useGeocoding('Paris');
  const { routes, getDirections } = useDirections();

  return (
    <div>
      {/* Geocoding results */}
      <ul>
        {results.map((r) => (
          <li key={r.place_id}>{r.address}</li>
        ))}
      </ul>

      {/* Get directions */}
      <button
        onClick={() =>
          getDirections([
            [40.7128, -74.0060],
            [40.7489, -73.968],
          ])
        }
      >
        Get Directions
      </button>
    </div>
  );
}
```

### 4. Advanced: Multi-Step Location App

```typescript
import React, { useState } from 'react';
import {
  initializeClient,
  GeocodingSearch,
  DirectionsViewer,
  NearbyPOIViewer,
  StaticMap,
} from '@octacondeveloper/locationiq-react';

initializeClient({
  apiKey: process.env.REACT_APP_LOCATIONIQ_API_KEY,
});

export function LocationApp() {
  const [start, setStart] = useState<[number, number] | null>(null);
  const [end, setEnd] = useState<[number, number] | null>(null);

  return (
    <div>
      <h1>My Location App</h1>

      <h2>From</h2>
      <GeocodingSearch
        onSelect={(r) =>
          setStart([parseFloat(r.lat), parseFloat(r.lon)])
        }
      />

      <h2>To</h2>
      <GeocodingSearch
        onSelect={(r) =>
          setEnd([parseFloat(r.lat), parseFloat(r.lon)])
        }
      />

      {start && end && (
        <>
          <DirectionsViewer onRoutesLoaded={(routes) => console.log(routes)} />
          <StaticMap
            center={[(start[0] + end[0]) / 2, (start[1] + end[1]) / 2]}
            zoom={12}
            markers={[
              { lat: start[0], lon: start[1], color: 'green' },
              { lat: end[0], lon: end[1], color: 'red' },
            ]}
          />
          <NearbyPOIViewer lat={end[0]} lon={end[1]} />
        </>
      )}
    </div>
  );
}
```

## API Key

You need a LocationIQ API key to use these examples:

1. Visit https://locationiq.com
2. Sign up for a free account
3. Get your API key from the dashboard
4. Set it in your environment or directly in the code

## Common Patterns

### Handling Loading & Errors

```typescript
const { results, loading, error } = useGeocoding(query);

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;
return <ul>{results.map((r) => <li key={r.place_id}>{r.address}</li>)}</ul>;
```

### Debounced Search

```typescript
import { useEffect, useState } from 'react';
import { useGeocoding } from '@octacondeveloper/locationiq-react';

function Search() {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const { results } = useGeocoding(query);

  useEffect(() => {
    const timer = setTimeout(() => setQuery(input), 300);
    return () => clearTimeout(timer);
  }, [input]);

  return (
    <>
      <input onChange={(e) => setInput(e.target.value)} />
      <ul>
        {results.map((r) => (
          <li key={r.place_id}>{r.address}</li>
        ))}
      </ul>
    </>
  );
}
```

### Coordinate Utilities

```typescript
import { CoordinateUtils } from '@octacondeveloper/locationiq-react';

const distance = CoordinateUtils.calculateDistance(
  40.7128, -74.0060,
  34.0522, -118.2437
);

const formatted = CoordinateUtils.formatCoordinate(40.7128, -74.0060, 2);

const valid = CoordinateUtils.isValidCoordinate(40.7128, -74.0060);
```

## More Examples

See the individual example files for more detailed implementations:
- `GeocodingExample.tsx` - Geocoding patterns
- `RoutingExample.tsx` - Routing and matrix examples
- `UtilityExample.tsx` - Utility features
- `App.tsx` - Full application demo

## Troubleshooting

**Q: I'm getting "client not initialized" errors**
- Ensure `initializeClient()` is called before rendering components

**Q: No results showing**
- Check that your API key is valid
- Verify you have available API calls in your plan

**Q: CORS errors**
- These should be handled by LocationIQ's backend
- Check LocationIQ API documentation for details

## Support

- Documentation: https://docs.locationiq.com
- Issues: Report issues on GitHub
- Help: https://help.locationiq.com
