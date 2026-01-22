// Coordinate utilities
export const isValidCoordinate = (lat: number, lon: number): boolean => {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const formatCoordinate = (
  lat: number,
  lon: number,
  decimals: number = 4
): string => {
  return `${lat.toFixed(decimals)}, ${lon.toFixed(decimals)}`;
};

export const parseCoordinateString = (str: string): [number, number] | null => {
  const parts = str.split(',').map((p) => parseFloat(p.trim()));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    const [lat, lon] = parts;
    if (isValidCoordinate(lat, lon)) {
      return [lat, lon];
    }
  }
  return null;
};

// Geometry utilities
export const getBoundingBox = (coordinates: [number, number][]): {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
} => {
  const lats = coordinates.map((c) => c[0]);
  const lons = coordinates.map((c) => c[1]);
  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLon: Math.min(...lons),
    maxLon: Math.max(...lons),
  };
};

export const getCenterPoint = (coordinates: [number, number][]): [number, number] => {
  const lats = coordinates.map((c) => c[0]);
  const lons = coordinates.map((c) => c[1]);
  return [lats.reduce((a, b) => a + b) / lats.length, lons.reduce((a, b) => a + b) / lons.length];
};

// Formatting utilities
export const formatDistance = (meters: number): string => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} km`;
  }
  return `${meters.toFixed(0)} m`;
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};

// Bounds utilities
export const generateViewbox = (
  minLat: number,
  minLon: number,
  maxLat: number,
  maxLon: number
): string => {
  return `${minLon},${minLat},${maxLon},${maxLat}`;
};
