import React, { useState, useCallback } from 'react';
import { useAutocomplete } from '../hooks';
import * as Types from '../types';

interface AutocompleteComponentProps {
  onSelect?: (result: Types.AutocompleteResult) => void;
  placeholder?: string;
  limit?: number;
  className?: string;
}

export const AddressAutocomplete: React.FC<AutocompleteComponentProps> = ({
  onSelect,
  placeholder = 'Start typing an address...',
  limit = 5,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const { results, loading, error, autocomplete } = useAutocomplete(query);
  const [showResults, setShowResults] = useState(true);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      setShowResults(true);
      if (value.length >= 2) {
        autocomplete(value);
      }
    },
    [autocomplete]
  );

  const handleSelectResult = (result: Types.AutocompleteResult) => {
    setQuery(result.address);
    setShowResults(false);
    onSelect?.(result);
  };

  const handleBlur = () => {
    setTimeout(() => setShowResults(false), 200);
  };

  return (
    <div className={`locationiq-autocomplete ${className}`}>
      <div className="autocomplete-wrapper">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="autocomplete-input"
        />
        {loading && <span className="loading-indicator">Loading...</span>}
      </div>

      {error && <div className="error-message">{error.message}</div>}

      {showResults && results.length > 0 && (
        <ul className="suggestions-list">
          {results.slice(0, limit).map((result, index) => {
            if (!result || !result.address) return null;
            return (
              <li
                key={`${result.osm_id || index}`}
                onClick={() => handleSelectResult(result)}
                className="suggestion-item"
              >
                <div className="suggestion-address">{String(result.address)}</div>
                <div className="suggestion-coords">
                  {String(result.lat)}, {String(result.lon)}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AddressAutocomplete;
