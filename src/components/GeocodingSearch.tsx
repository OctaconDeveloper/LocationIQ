import React, { useState, useCallback } from 'react';
import { useGeocoding } from '../hooks';
import * as Types from '../types';

interface GeocodingComponentProps {
  onSelect?: (result: Types.GeocodingResult) => void;
  placeholder?: string;
  limit?: number;
  countrycodes?: string;
  className?: string;
}

export const GeocodingSearch: React.FC<GeocodingComponentProps> = ({
  onSelect,
  placeholder = 'Search address...',
  limit = 10,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const { results, loading, error, geocode } = useGeocoding(query);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      if (value.trim().length > 2) {
        geocode(value);
      }
    },
    [geocode]
  );

  const handleSelectResult = (result: Types.GeocodingResult) => {
    setQuery(result.address);
    onSelect?.(result);
  };

  return (
    <div className={`locationiq-geocoding ${className}`}>
      <div className="search-input-wrapper">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="geocoding-input"
        />
        {loading && <div className="loading-spinner">Loading...</div>}
      </div>

      {error && <div className="error-message">{error.message}</div>}

      {results.length > 0 && (
        <ul className="results-list">
          {results.slice(0, limit).map((result, index) => (
            <li
              key={`${result.place_id || index}`}
              onClick={() => handleSelectResult(result)}
              className="result-item"
            >
              <div className="result-name">{result.address}</div>
              <div className="result-coordinates">
                ({result.lat}, {result.lon})
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GeocodingSearch;
