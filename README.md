# @octacondeveloper/locationiq

A premium LocationIQ Places API integration for React and core TypeScript. This package provides a framework-agnostic core SDK and a polished React autocomplete component with glassmorphism and animations.

[![npm version](https://img.shields.io/badge/npm-1.0.0-blue.svg)](https://www.npmjs.com/package/@octacondeveloper/locationiq)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)

## Features

- 🌍 **Core SDK**: Framework-agnostic TypeScript class for Forward Geocoding, Reverse Geocoding, Autocomplete, and Directions.
- 🔍 **Autocomplete**: Premium React input component with real-time suggestions and debounced searching.
- 📍 **Reverse Geocoding**: Convert coordinates to human-readable addresses (includes "Current Location" support).
- 🛣️ **Directions**: Calculate routes and fetch step-by-step instructions.
- ✨ **Rich UI**: Built-in support for glassmorphism, dark mode, and smooth transitions using `framer-motion`.

## Installation

```bash
npm install @octacondeveloper/locationiq axios lucide-react framer-motion
```

> [!NOTE]
> `lucide-react` and `framer-motion` are peer dependencies required for the React components. `axios` is a direct dependency.

## Quick Start

### 1. Get your API Key
Register at [LocationIQ](https://locationiq.com/) to get your free API key (Public Token).

### 2. Usage in React

The `LocationInput` component provides a search box with built-in autocomplete logic.

```tsx
import { LocationInput, LocationIQSDK } from '@octacondeveloper/locationiq';
import '@octacondeveloper/locationiq/dist/locationiq.css'; // Optional: import default styles

// Initialize the SDK
const sdk = new LocationIQSDK('YOUR_LOCATIONIQ_API_KEY');

function App() {
  const handleSelect = (place) => {
    console.log('Selected place:', place);
  };

  return (
    <div className="container">
      <h1>Search for a Place</h1>
      <LocationInput 
        sdk={sdk} 
        onSelect={handleSelect} 
        placeholder="Type an address..." 
      />
    </div>
  );
}
```

### 3. Usage in any environment (Vue, Angular, Node.js)

You can use the `LocationIQSDK` class independently of any UI framework.

```typescript
import { LocationIQSDK } from '@octacondeveloper/locationiq';

const sdk = new LocationIQSDK('YOUR_LOCATIONIQ_API_KEY');

// Autocomplete suggestions
const suggestions = await sdk.autocomplete('Empire State');

// Forward Geocoding
const locations = await sdk.forwardGeocoding('1600 Amphitheatre Parkway, Mountain View, CA');

// Reverse Geocoding
const address = await sdk.reverseGeocoding(40.7484, -73.9857);

// Directions
const route = await sdk.directions([
  [-73.9857, 40.7484], // [lon, lat] - Origin
  [-74.0060, 40.7128]  // [lon, lat] - Destination
]);
```

## API Reference

### `LocationIQSDK`

| Method | Description | Parameters |
| :--- | :--- | :--- |
| `autocomplete(query)` | Get search suggestions | `query: string` |
| `forwardGeocoding(query)` | Convert address to GPS | `query: string` |
| `reverseGeocoding(lat, lon)`| Convert GPS to address | `lat: number, lon: number` |
| `directions(coords)` | Get route between points | `coords: [number, number][]` |

### `LocationInput` (React)

| Prop | Description | Type |
| :--- | :--- | :--- |
| `sdk` | Instance of `LocationIQSDK` | `LocationIQSDK` |
| `onSelect` | Callback on selection | `(result) => void` |
| `placeholder`| Input placeholder | `string` (optional) |

## Peer Dependencies

To keep the package lightweight, the following are required as peer dependencies in your project:
- `react` & `react-dom` (>= 18.0.0)
- `framer-motion` (>= 12.0.0)
- `lucide-react` (>= 0.400.0)

## License

MIT © [OctaconDeveloper](https://github.com/OctaconDeveloper)
