# LocationIQ React Component Package

## Overview

A comprehensive, production-ready React component library for LocationIQ APIs with TypeScript support, custom hooks, and pre-built components.

## Quick Links

- 📖 [Full Documentation](./README.md)
- 🚀 [Getting Started](./README.md#quick-start)
- 📚 [Examples](./examples/)
- 🔗 [LocationIQ API Docs](https://docs.locationiq.com)
- 🎯 [LocationIQ Website](https://locationiq.com)

## Installation

```bash
npm install @octacondeveloper/locationiq-react
```

## Quick Start

```typescript
import { initializeClient, GeocodingSearch } from '@octaondeveloper/locationiq-react';

// Initialize your app
initializeClient({
  apiKey: 'your-locationiq-api-key',
});

// Use components
export function MyApp() {
  return (
    <GeocodingSearch
      placeholder="Search locations..."
      onSelect={(result) => console.log(result)}
    />
  );
}
```

## Features

✨ **7 Ready-to-Use Components**
- GeocodingSearch - Address to coordinates
- ReverseGeocodingDisplay - Coordinates to address
- AddressAutocomplete - Address suggestions
- DirectionsViewer - Routing & directions
- StaticMap - Embedded map images
- TimezoneDisplay - Timezone info
- NearbyPOIViewer - Points of interest

🎣 **8 Custom Hooks**
- useGeocoding
- useReverseGeocoding
- useAutocomplete
- useDirections
- useMatrix
- useTimezone
- useNearbyPOI
- useBalance

🛠️ **Utility Functions**
- Coordinate validation & formatting
- Distance calculations
- Bounding box operations
- Timezone utilities

## Core APIs Covered

- ✅ Forward Geocoding
- ✅ Reverse Geocoding
- ✅ Autocomplete
- ✅ Directions/Routing
- ✅ Distance Matrix
- ✅ Nearest Points
- ✅ Timezone
- ✅ Nearby POI
- ✅ Static Maps
- ✅ Account Balance

## Project Structure

```
@octacondeveloper/locationiq-react/
├── src/
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API client
│   ├── types/            # TypeScript definitions
│   ├── utils/            # Utility functions
│   └── index.ts          # Main export
├── examples/             # Example implementations
├── README.md             # Full documentation
├── package.json
├── tsconfig.json
└── .gitignore
```

## Components at a Glance

### GeocodingSearch
Search for addresses and get coordinates.
```tsx
<GeocodingSearch onSelect={(result) => console.log(result.lat, result.lon)} />
```

### DirectionsViewer
Get routes between multiple points.
```tsx
<DirectionsViewer profile="car" onRoutesLoaded={(routes) => console.log(routes)} />
```

### StaticMap
Display embedded map images.
```tsx
<StaticMap center={[40.7128, -74.0060]} zoom={15} size={[600, 400]} />
```

### AddressAutocomplete
Real-time address suggestions.
```tsx
<AddressAutocomplete onSelect={(result) => setAddress(result.address)} />
```

### NearbyPOIViewer
Find points of interest nearby.
```tsx
<NearbyPOIViewer lat={40.7128} lon={-74.0060} limit={20} />
```

### ReverseGeocodingDisplay
Convert coordinates to addresses.
```tsx
<ReverseGeocodingDisplay onResult={(address) => console.log(address)} />
```

### TimezoneDisplay
Show timezone information.
```tsx
<TimezoneDisplay lat={40.7128} lon={-74.0060} />
```

## Hooks Usage

```typescript
import { useGeocoding, useDirections, useMatrix } from '@octacondeveloper/locationiq-react';

// Geocoding hook
const { results, loading, error, geocode } = useGeocoding('Paris');

// Directions hook
const { routes, loading, getDirections } = useDirections();

// Matrix hook (distance matrix)
const { matrix, loading, getMatrix } = useMatrix(coordinates);
```

## Documentation

See [README.md](./README.md) for:
- Detailed component props
- Hook signatures
- Advanced usage patterns
- Performance optimization
- Troubleshooting guide
- Complete API reference
- Migration from Google Maps

## Examples

Run the included examples:

```bash
# Copy examples/App.tsx to your app
# Set REACT_APP_LOCATIONIQ_API_KEY in .env
npm start
```

See the [examples directory](./examples/) for more code samples.

## Browser Support

- Chrome 58+
- Firefox 54+
- Safari 11+
- Edge 79+

## License

MIT © 2024

## Support & Resources

- **API Key**: Get one at https://locationiq.com
- **Documentation**: https://docs.locationiq.com
- **Support**: https://help.locationiq.com
- **Status**: https://status.locationiq.com
- **Issues**: Report bugs on GitHub

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

---

**Ready to get started?** [View Full Documentation →](./README.md)
