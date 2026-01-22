import { useState, useCallback, useEffect } from 'react';
import { getClient } from '../services/LocationIQClient';
import * as Types from '../types';

export interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface UseAsyncActions {
  execute: () => Promise<void>;
  reset: () => void;
}

// Generic async hook
export const useAsync = <T,>(
  asyncFunction: () => Promise<T>
): UseAsyncState<T> & UseAsyncActions => {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await asyncFunction();
      setState({ data: response, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, [asyncFunction]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    reset,
  };
};

// Geocoding Hook
export const useGeocoding = (query: string, autoSearch = false) => {
  const [results, setResults] = useState<Types.GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const geocode = useCallback(async (searchQuery?: string) => {
    const queryToUse = searchQuery || query;
    if (!queryToUse.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const client = getClient();
      const result = await client.geocode({ q: queryToUse });
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Geocoding failed'));
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (autoSearch && query.trim()) {
      geocode();
    }
  }, [query, autoSearch, geocode]);

  return { results, loading, error, geocode };
};

// Reverse Geocoding Hook
export const useReverseGeocoding = (lat?: number, lon?: number, autoSearch = false) => {
  const [result, setResult] = useState<Types.ReverseGeocodingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reverseGeocode = useCallback(async (latitude?: number, longitude?: number) => {
    const latToUse = latitude !== undefined ? latitude : lat;
    const lonToUse = longitude !== undefined ? longitude : lon;

    if (latToUse === undefined || lonToUse === undefined) return;

    setLoading(true);
    setError(null);
    try {
      const client = getClient();
      const result = await client.reverseGeocode({
        lat: latToUse,
        lon: lonToUse,
      });
      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Reverse geocoding failed'));
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [lat, lon]);

  useEffect(() => {
    if (autoSearch && lat !== undefined && lon !== undefined) {
      reverseGeocode();
    }
  }, [lat, lon, autoSearch, reverseGeocode]);

  return { result, loading, error, reverseGeocode };
};

// Autocomplete Hook
export const useAutocomplete = (query: string) => {
  const [results, setResults] = useState<Types.AutocompleteResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const autocomplete = useCallback(async (searchQuery?: string) => {
    const queryToUse = searchQuery || query;
    if (!queryToUse.trim() || queryToUse.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const client = getClient();
      const result = await client.autocomplete({ q: queryToUse });
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Autocomplete failed'));
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (query.length >= 2) {
      autocomplete();
    } else {
      setResults([]);
    }
  }, [query, autocomplete]);

  return { results, loading, error, autocomplete };
};

// Directions/Routing Hook
export const useDirections = (coordinates?: [number, number][]) => {
  const [routes, setRoutes] = useState<Types.RoutingRoute[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getDirections = useCallback(
    async (coords?: [number, number][], profile: 'car' | 'bike' | 'foot' = 'car') => {
      const coordsToUse = coords || coordinates;
      if (!coordsToUse || coordsToUse.length < 2) return;

      setLoading(true);
      setError(null);
      try {
        const client = getClient();
        const result = await client.getDirections({
          coordinates: coordsToUse,
          profile,
          geometries: 'geojson',
          steps: true,
          annotations: ['duration', 'distance'],
        });
        setRoutes(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to get directions'));
        setRoutes([]);
      } finally {
        setLoading(false);
      }
    },
    [coordinates]
  );

  return { routes, loading, error, getDirections };
};

// Matrix API Hook
export const useMatrix = (coordinates?: [number, number][]) => {
  const [matrix, setMatrix] = useState<Types.MatrixResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getMatrix = useCallback(
    async (coords?: [number, number][], profile: 'car' | 'bike' | 'foot' = 'car') => {
      const coordsToUse = coords || coordinates;
      if (!coordsToUse || coordsToUse.length < 2) return;

      setLoading(true);
      setError(null);
      try {
        const client = getClient();
        const result = await client.getMatrix({
          coordinates: coordsToUse,
          profile,
        });
        setMatrix(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to get matrix'));
        setMatrix(null);
      } finally {
        setLoading(false);
      }
    },
    [coordinates]
  );

  return { matrix, loading, error, getMatrix };
};

// Timezone Hook
export const useTimezone = (lat?: number, lon?: number, autoFetch = false) => {
  const [timezone, setTimezone] = useState<Types.TimezoneResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getTimezone = useCallback(async (latitude?: number, longitude?: number) => {
    const latToUse = latitude !== undefined ? latitude : lat;
    const lonToUse = longitude !== undefined ? longitude : lon;

    if (latToUse === undefined || lonToUse === undefined) return;

    setLoading(true);
    setError(null);
    try {
      const client = getClient();
      const result = await client.getTimezone(latToUse, lonToUse);
      setTimezone(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get timezone'));
      setTimezone(null);
    } finally {
      setLoading(false);
    }
  }, [lat, lon]);

  useEffect(() => {
    if (autoFetch && lat !== undefined && lon !== undefined) {
      getTimezone();
    }
  }, [lat, lon, autoFetch, getTimezone]);

  return { timezone, loading, error, getTimezone };
};

// Nearby POI Hook
export const useNearbyPOI = (lat?: number, lon?: number) => {
  const [pois, setPOIs] = useState<Types.NearbyPOIResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getNearby = useCallback(
    async (latitude?: number, longitude?: number, tag?: string) => {
      const latToUse = latitude !== undefined ? latitude : lat;
      const lonToUse = longitude !== undefined ? longitude : lon;

      if (latToUse === undefined || lonToUse === undefined) return;

      setLoading(true);
      setError(null);
      try {
        const client = getClient();
        const result = await client.getNearbyPOI({
          lat: latToUse,
          lon: lonToUse,
          tag,
          limit: 50,
        });
        setPOIs(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to get nearby POIs'));
        setPOIs([]);
      } finally {
        setLoading(false);
      }
    },
    [lat, lon]
  );

  return { pois, loading, error, getNearby };
};

// Balance Hook
export const useBalance = () => {
  const [balance, setBalance] = useState<{ balance: number; currency: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getBalance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const client = getClient();
      const result = await client.getBalance();
      setBalance(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get balance'));
      setBalance(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { balance, loading, error, getBalance };
};
