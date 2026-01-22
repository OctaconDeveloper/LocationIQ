import axios from 'axios';

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
    address?: Record<string, string>;
}

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

export class LocationIQSDK {
    private apiKey: string;
    private baseUrl = 'https://us1.locationiq.com/v1';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    /**
     * Forward Geocoding: Convert address to coordinates
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
     * Reverse Geocoding: Convert coordinates to address
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
     * Autocomplete: Get suggestions for partial input
     */
    async autocomplete(query: string): Promise<AutocompleteResult[]> {
        if (!query || query.length < 3) return [];

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
     * Directions: Get route between coordinates
     * coords format: [[lon, lat], [lon, lat]]
     */
    async directions(coords: [number, number][]): Promise<DirectionsResult> {
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
