import axios, { AxiosInstance, AxiosError } from 'axios';
import * as Types from '../types';

export interface LocationIQConfig {
  apiKey: string;
  baseURL?: string;
}

export class LocationIQClient {
  private axiosInstance: AxiosInstance;
  private apiKey: string;
  private baseURL: string = 'https://api.locationiq.com/v1';

  constructor(config: LocationIQConfig) {
    this.apiKey = config.apiKey;
    if (config.baseURL) {
      this.baseURL = config.baseURL;
    }

    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });
  }

  // Geocoding: Convert address to coordinates
  async geocode(request: Types.GeocodingRequest): Promise<Types.GeocodingResult[]> {
    try {
      const response = await this.axiosInstance.get('/search', {
        params: {
          key: this.apiKey,
          format: 'json',
          ...request,
        },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Reverse Geocoding: Convert coordinates to address
  async reverseGeocode(
    request: Types.ReverseGeocodingRequest
  ): Promise<Types.ReverseGeocodingResult> {
    try {
      const response = await this.axiosInstance.get('/reverse', {
        params: {
          key: this.apiKey,
          format: 'json',
          ...request,
        },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Autocomplete: Get address suggestions
  async autocomplete(request: Types.AutocompleteRequest): Promise<Types.AutocompleteResult[]> {
    try {
      const response = await this.axiosInstance.get('/autocomplete', {
        params: {
          key: this.apiKey,
          format: 'json',
          ...request,
        },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Routing API: Get directions between coordinates
  async getDirections(request: Types.RoutingRequest): Promise<Types.RoutingRoute[]> {
    try {
      const coordinatesStr = request.coordinates.map((coord) => coord.join(',')).join(';');
      const params: any = {
        key: this.apiKey,
        geometries: request.geometries || 'geojson',
      };

      if (request.profile) params.profile = request.profile;
      if (request.alternatives !== undefined) params.alternatives = request.alternatives;
      if (request.steps !== undefined) params.steps = request.steps;
      if (request.annotations) params.annotations = request.annotations.join(',');
      if (request.continue_straight !== undefined)
        params.continue_straight = request.continue_straight;
      if (request.waypoint_names) params.waypoint_names = request.waypoint_names.join(';');
      if (request.waypoints) params.waypoints = request.waypoints.join(';');
      if (request.approaches) params.approaches = request.approaches.join(';');
      if (request.exclude) params.exclude = request.exclude.join(',');

      const response = await this.axiosInstance.get(`/directions/${request.profile || 'car'}/${coordinatesStr}`, {
        params,
      });
      return response.data.routes || [];
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Matrix API: Get distance/duration matrix between multiple points
  async getMatrix(request: Types.MatrixRequest): Promise<Types.MatrixResult> {
    try {
      const coordinatesStr = request.coordinates.map((coord) => coord.join(',')).join(';');
      const params: any = {
        key: this.apiKey,
      };

      if (request.profile) params.profile = request.profile;
      if (request.sources) params.sources = request.sources.join(';');
      if (request.destinations) params.destinations = request.destinations.join(';');
      if (request.annotations) params.annotations = request.annotations.join(',');
      if (request.exclude) params.exclude = request.exclude.join(',');

      const response = await this.axiosInstance.get(
        `/matrix/${request.profile || 'car'}/${coordinatesStr}`,
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Nearest API: Find nearest points on road network
  async getNearest(request: Types.NearestRequest): Promise<Types.NearestResult> {
    try {
      const coordinatesStr = request.coordinates.map((coord) => coord.join(',')).join(';');
      const params: any = {
        key: this.apiKey,
      };

      if (request.profile) params.profile = request.profile;
      if (request.number) params.number = request.number;
      if (request.exclude) params.exclude = request.exclude.join(',');

      const response = await this.axiosInstance.get(
        `/nearest/${request.profile || 'car'}/${coordinatesStr}`,
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Timezone API: Get timezone info for coordinates
  async getTimezone(lat: number, lon: number): Promise<Types.TimezoneResult> {
    try {
      const response = await this.axiosInstance.get('/timezone', {
        params: {
          key: this.apiKey,
          lat,
          lon,
          format: 'json',
        },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Nearby POI API: Find points of interest near coordinates
  async getNearbyPOI(request: Types.NearbyPOIRequest): Promise<Types.NearbyPOIResult[]> {
    try {
      const response = await this.axiosInstance.get('/nearby', {
        params: {
          key: this.apiKey,
          format: 'json',
          ...request,
        },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get static map image URL
  getStaticMapURL(request: Types.StaticMapRequest): string {
    const params = new URLSearchParams({
      key: this.apiKey,
    });

    if (request.center) {
      params.append('center', request.center.join(','));
    }
    if (request.zoom !== undefined) {
      params.append('zoom', request.zoom.toString());
    }
    if (request.size) {
      params.append('size', request.size.join('x'));
    }
    if (request.format) {
      params.append('format', request.format);
    }
    if (request.style) {
      params.append('style', request.style);
    }

    if (request.markers && request.markers.length > 0) {
      const markersStr = request.markers
        .map((marker) => {
          let markerStr = `${marker.lat},${marker.lon}`;
          if (marker.size) markerStr = `size:${marker.size}|${markerStr}`;
          if (marker.color) markerStr = `color:${marker.color}|${markerStr}`;
          if (marker.icon) markerStr = `icon:${marker.icon}|${markerStr}`;
          return markerStr;
        })
        .join('|');
      params.append('markers', markersStr);
    }

    return `${this.baseURL}/staticmap?${params.toString()}`;
  }

  // Balance/Usage API: Get account balance
  async getBalance(): Promise<{ balance: number; currency: string }> {
    try {
      const response = await this.axiosInstance.get('/balance', {
        params: {
          key: this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: any): void {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        throw new Error('Unauthorized: Invalid API key');
      }
      if (axiosError.response?.status === 429) {
        throw new Error('Rate limit exceeded');
      }
      if (axiosError.response?.status === 400) {
        throw new Error(`Bad request: ${axiosError.response?.data}`);
      }
    }
  }
}

// Singleton instance
let clientInstance: LocationIQClient | null = null;

export const initializeClient = (config: LocationIQConfig): LocationIQClient => {
  clientInstance = new LocationIQClient(config);
  return clientInstance;
};

export const getClient = (): LocationIQClient => {
  if (!clientInstance) {
    throw new Error(
      'LocationIQ client not initialized. Call initializeClient() first.'
    );
  }
  return clientInstance;
};
