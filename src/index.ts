import axios from 'axios';

/**
 * Result structure for Forward and Reverse Geocoding
 */
export interface LocationIQResult {
    place_id: string;
    licence: string;
    osm_type: string;
    osm_id: string;
    boundingbox: string[];
    lat: string;
    lon: string;
    display_name: string;
    class: string;
    type: string;
    importance: number;
    address?: {
        name?: string;
        house_number?: string;
        road?: string;
        neighborhood?: string;
        suburb?: string;
        city?: string;
        county?: string;
        state?: string;
        postcode?: string;
        country?: string;
        country_code?: string;
        [key: string]: any;
    };
}

/**
 * Result structure for Autocomplete API
 */
export interface AutocompleteResult {
    place_id: string;
    osm_id: string;
    osm_type: string;
    display_name: string;
    display_place: string;
    display_address: string;
    address: {
        name: string;
        house_number?: string;
        road?: string;
        neighborhood?: string;
        suburb?: string;
        city?: string;
        county?: string;
        state?: string;
        postcode?: string;
        country?: string;
        country_code?: string;
    };
    lat: string;
    lon: string;
}

/**
 * Result structure for Directions API
 */
export interface DirectionsResult {
    code: string;
    routes: Array<{
        geometry: string | any;
        legs: Array<{
            steps: any[];
            summary: string;
            weight: number;
            duration: number;
            distance: number;
        }>;
        weight_name: string;
        weight: number;
        duration: number;
        distance: number;
    }>;
    waypoints: Array<{
        hint: string;
        distance: number;
        name: string;
        location: [number, number];
    }>;
}

/**
 * LocationIQ SDK Client
 * Integrates Forward Geocoding, Reverse Geocoding, Autocomplete, and Directions.
 */
export class LocationIQSDK {
    private apiKey: string;
    private baseUrl = 'https://us1.locationiq.com/v1';

    /**
     * @param apiKey Your LocationIQ Public Token (pk...)
     */
    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error('LocationIQ API Key is required');
        }
        this.apiKey = apiKey;
    }

    /**
     * Forward Geocoding: Convert an address/query to coordinates.
     */
    async forwardGeocoding(query: string): Promise<LocationIQResult[]> {
        const response = await axios.get(`${this.baseUrl}/search`, {
            params: {
                key: this.apiKey,
                q: query,
                format: 'json',
            },
        });
        return response.data;
    }

    /**
     * Reverse Geocoding: Convert latitude and longitude to a human-readable address.
     */
    async reverseGeocoding(lat: number, lon: number): Promise<LocationIQResult> {
        const response = await axios.get(`${this.baseUrl}/reverse`, {
            params: {
                key: this.apiKey,
                lat,
                lon,
                format: 'json',
            },
        });
        return response.data;
    }

    /**
     * Autocomplete: Get suggestions for a place or address as the user types.
     * Suggested use: Debounce this call in your UI (keyup).
     */
    async autocomplete(query: string): Promise<AutocompleteResult[]> {
        if (!query || query.trim().length < 3) return [];

        const response = await axios.get(`${this.baseUrl}/autocomplete`, {
            params: {
                key: this.apiKey,
                q: query,
                format: 'json',
            },
        });
        return response.data;
    }

    /**
     * Directions: Get routing information between two or more points.
     * @param coords Array of [longitude, latitude] pairs.
     */
    async directions(coords: [number, number][]): Promise<DirectionsResult> {
        if (coords.length < 2) {
            throw new Error('At least two coordinate pairs are required for directions');
        }
        const coordString = coords.map(c => `${c[0]},${c[1]}`).join(';');
        const response = await axios.get(`${this.baseUrl}/directions/driving/${coordString}`, {
            params: {
                key: this.apiKey,
                overview: 'full',
                steps: 'true',
            },
        });
        return response.data;
    }
}
import { LocationAutocomplete } from './components/autocomplete';

export * from './components/autocomplete';

/**
 * Register the <location-autocomplete> custom element.
 * Safe to call multiple times.
 */
export function register() {
    if (typeof window !== 'undefined' && !customElements.get('location-autocomplete')) {
        customElements.define('location-autocomplete', LocationAutocomplete);
    }
}
