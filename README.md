# @octacondeveloper/locationiq

A pure, lightweight, and framework-agnostic LocationIQ Places API client. This package is written in TypeScript and provides seamless integration for Forward Geocoding, Reverse Geocoding, Autocomplete, and Directions.

[![npm version](https://img.shields.io/badge/npm-3.0.0-blue.svg)](https://www.npmjs.com/package/@octacondeveloper/locationiq)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)

## Features

- 🌍 **Pure TypeScript**: Zero dependencies on React, Vue, or Angular. Works everywhere.
- 🚀 **Small & Fast**: Only depends on `axios`.
- 🔍 **Autocomplete**: High-performance suggestions for search-as-you-type interfaces.
- 📍 **Geocoding**: Precise Forward and Reverse geocoding.
- 🛣️ **Directions**: Route calculation with step-by-step instructions.

## Installation

```bash
npm install @octacondeveloper/locationiq
```

## System Requirements

- **Node.js**: v24.0.0 or higher is recommended for development.

## Usage

### Usage (Web Component - Recommended for UI)

The package includes a framework-agnostic `<location-autocomplete>` custom element.

```html
<!-- 1. HTML -->
<location-autocomplete id="search" token="YOUR_API_KEY" placeholder="Search for a place..."></location-autocomplete>

<!-- 2. JavaScript -->
<script type="module">
  import { register } from '@octacondeveloper/locationiq';
  register(); // Initialize the custom element

  const el = document.getElementById('search');
  el.addEventListener('location-select', (e) => {
    console.log('Selected location:', e.detail);
  });
</script>
```

#### Customizing Styles
You can style the component using CSS variables:
```css
location-autocomplete {
  --liq-primary-color: #4f46e5;
  --liq-border-radius: 4px;
  --liq-bg: #f9fafb;
}
```

### Usage (Pure SDK)

#### Initialize the SDK

```typescript
import { LocationIQSDK } from '@octacondeveloper/locationiq';

const sdk = new LocationIQSDK('YOUR_LOCATIONIQ_API_KEY');
```

#### Autocomplete suggestions
```typescript
const suggestions = await sdk.autocomplete('Empire State Building');
// Returns AutocompleteResult[]
```

### Forward Geocoding
```typescript
const locations = await sdk.forwardGeocoding('1600 Amphitheatre Parkway, Mountain View, CA');
// Returns LocationIQResult[]
```

### Reverse Geocoding
```typescript
const address = await sdk.reverseGeocoding(40.7484, -73.9857);
// Returns LocationIQResult
```

### Directions
```typescript
const route = await sdk.directions([
  [-73.9857, 40.7484], // [lon, lat] - Origin
  [-74.0060, 40.7128]  // [lon, lat] - Destination
]);
// Returns DirectionsResult
```

## Usage in React

### 1. Register the component
In your `main.tsx` or entry point:
```tsx
import { register } from '@octacondeveloper/locationiq';
register();
```

### 2. Use in a Component
```tsx
import { useEffect, useRef } from 'react';

function Search() {
  const ref = useRef(null);

  useEffect(() => {
    const handleSelect = (e) => console.log(e.detail);
    ref.current?.addEventListener('location-select', handleSelect);
    return () => ref.current?.removeEventListener('location-select', handleSelect);
  }, []);

  return <location-autocomplete ref={ref} token="YOUR_TOKEN" />;
}
```

## API Reference

### `LocationIQSDK`

| Method | Description | Parameters |
| :--- | :--- | :--- |
| `autocomplete(query)` | Get search suggestions | `query: string` |
| `forwardGeocoding(query)` | Convert address to GPS | `query: string` |
| `reverseGeocoding(lat, lon)`| Convert GPS to address | `lat: number, lon: number` |
| `directions(coords)` | Get route between points | `coords: [number, number][]` |

## License

MIT © [OctaconDeveloper](https://github.com/OctaconDeveloper)
