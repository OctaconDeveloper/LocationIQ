// Geocoding Types
export interface GeocodingResult {
  address: string;
  lat: string;
  lon: string;
  boundingbox: string[];
  license?: string;
  osm_id?: string;
  osm_type?: string;
  place_id?: string;
  importance?: number;
  type?: string;
  class?: string;
  display_name?: string;
  name?: string;
}

export interface GeocodingRequest {
  q: string;
  countrycodes?: string;
  limit?: number;
  format?: string;
  addressdetails?: number;
  viewbox?: string;
  bounded?: number;
  accept_language?: string;
  namedetails?: number;
  extratags?: number;
}

// Reverse Geocoding Types
export interface ReverseGeocodingResult extends GeocodingResult {
  place_rank?: number;
}

export interface ReverseGeocodingRequest {
  lat: number;
  lon: number;
  format?: string;
  zoom?: number;
  addressdetails?: number;
  accept_language?: string;
  namedetails?: number;
  extratags?: number;
}

// Autocomplete Types
export interface AutocompleteResult {
  address: string;
  lat: string;
  lon: string;
  boundingbox: string[];
  osm_id: string;
  osm_type: string;
  importance?: number;
}

export interface AutocompleteRequest {
  q: string;
  countrycodes?: string;
  limit?: number;
  format?: string;
  dedupe?: number;
  viewbox?: string;
  bounded?: number;
  accept_language?: string;
  tag?: string;
}

// Routing Types
export interface RoutingRequest {
  coordinates: [number, number][];
  profile?: 'car' | 'bike' | 'foot';
  alternatives?: boolean;
  steps?: boolean;
  annotations?: string[];
  geometries?: 'geojson' | 'polyline' | 'polyline6';
  continue_straight?: boolean;
  waypoint_names?: string[];
  waypoints?: number[];
  approaches?: string[];
  exclude?: string[];
}

export interface RoutingRoute {
  distance: number;
  duration: number;
  weight: number;
  weight_name: string;
  geometry: {
    coordinates: [number, number][];
    type: string;
  };
  legs: RoutingLeg[];
  summary?: string;
}

export interface RoutingLeg {
  distance: number;
  duration: number;
  weight: number;
  steps: RoutingStep[];
  summary: string;
}

export interface RoutingStep {
  distance: number;
  duration: number;
  weight: number;
  name: string;
  instruction: string;
  way_points: number[];
  geometry: {
    coordinates: [number, number][];
    type: string;
  };
  maneuver?: {
    location: [number, number];
    bearing_before: number;
    bearing_after: number;
    type: string;
  };
}

// Matrix API Types
export interface MatrixRequest {
  coordinates: [number, number][];
  profile?: 'car' | 'bike' | 'foot';
  sources?: number[];
  destinations?: number[];
  annotations?: string[];
  exclude?: string[];
}

export interface MatrixResult {
  code: string;
  durations: number[][];
  distances: number[][];
  sources?: Array<{
    name: string;
    hint: string;
    location: [number, number];
  }>;
  destinations?: Array<{
    name: string;
    hint: string;
    location: [number, number];
  }>;
}

// Nearest API Types
export interface NearestRequest {
  coordinates: [number, number][];
  profile?: 'car' | 'bike' | 'foot';
  number?: number;
  exclude?: string[];
}

export interface NearestResult {
  code: string;
  waypoints: Array<{
    hint: string;
    name: string;
    location: [number, number];
  }>;
  routes: RoutingRoute[];
}

// Timezone API Types
export interface TimezoneResult {
  timezone: string;
  abbreviation: string;
  utc_offset: string;
  is_dst: boolean;
  current_time: string;
}

// Nearby POI Types
export interface NearbyPOIRequest {
  lat: number;
  lon: number;
  tag?: string;
  radius?: number;
  limit?: number;
  format?: string;
}

export interface NearbyPOIResult {
  place_id: string;
  name: string;
  display_name: string;
  place_rank: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  osm_type: string;
  osm_id: string;
  type: string;
  class: string;
  importance?: number;
  icon?: string;
  address?: {
    amenity?: string;
    house_number?: string;
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

// Static Map Types
export interface StaticMapRequest {
  center?: [number, number];
  zoom?: number;
  size?: [number, number];
  format?: 'png' | 'jpg' | 'gif';
  style?: string;
  markers?: Array<{
    lat: number;
    lon: number;
    size?: string;
    color?: string;
    icon?: string;
  }>;
}

// API Response Types
export interface APIResponse<T> {
  data: T;
  status: number;
  headers: Record<string, any>;
}

export interface APIError {
  error: string;
  message?: string;
  status?: number;
}
