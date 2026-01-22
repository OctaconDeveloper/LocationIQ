import React, { useState, useCallback } from 'react';
import { useReverseGeocoding } from '../hooks';

interface ReverseGeocodingComponentProps {
  onResult?: (address: string) => void;
  className?: string;
}

export const ReverseGeocodingDisplay: React.FC<ReverseGeocodingComponentProps> = ({
  onResult,
  className = '',
}) => {
  const [lat, setLat] = useState<number | undefined>();
  const [lon, setLon] = useState<number | undefined>();
  const { result, loading, error, reverseGeocode } = useReverseGeocoding(lat, lon);

  const handleGeolocate = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLat(latitude);
        setLon(longitude);
        reverseGeocode(latitude, longitude);
      });
    }
  }, [reverseGeocode]);

  React.useEffect(() => {
    if (result?.address) {
      onResult?.(result.address);
    }
  }, [result, onResult]);

  return (
    <div className={`locationiq-reverse-geocoding ${className}`}>
      <div className="controls">
        <button onClick={handleGeolocate} className="geolocate-btn">
          📍 Get My Location
        </button>
      </div>

      {lat !== undefined && lon !== undefined && (
        <div className="coordinates-display">
          Latitude: {lat.toFixed(4)}, Longitude: {lon.toFixed(4)}
        </div>
      )}

      {loading && <div className="loading">Loading address...</div>}
      {error && <div className="error">{error.message}</div>}

      {result && (
        <div className="result-box">
          <h3>Address</h3>
          <p>{result.address}</p>
          {result.display_name && (
            <div className="details">
              <p>
                <strong>Full Details:</strong> {result.display_name}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReverseGeocodingDisplay;
