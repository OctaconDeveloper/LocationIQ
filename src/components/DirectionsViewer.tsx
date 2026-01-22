import React, { useState, useCallback } from 'react';
import { useDirections } from '../hooks';

interface DirectionsComponentProps {
  onRoutesLoaded?: (routes: any[]) => void;
  className?: string;
  profile?: 'car' | 'bike' | 'foot';
}

export const DirectionsViewer: React.FC<DirectionsComponentProps> = ({
  onRoutesLoaded,
  className = '',
  profile = 'car',
}) => {
  const [startCoord, setStartCoord] = useState<[number, number] | null>(null);
  const [endCoord, setEndCoord] = useState<[number, number] | null>(null);
  const { routes, loading, error, getDirections } = useDirections();

  const handleGetDirections = useCallback(async () => {
    if (!startCoord || !endCoord) {
      alert('Please set both start and end coordinates');
      return;
    }
    await getDirections([startCoord, endCoord], profile);
  }, [startCoord, endCoord, profile, getDirections]);

  React.useEffect(() => {
    if (routes.length > 0) {
      onRoutesLoaded?.(routes);
    }
  }, [routes, onRoutesLoaded]);

  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${meters.toFixed(0)} m`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className={`locationiq-directions ${className}`}>
      <div className="input-group">
        <div className="coordinate-input">
          <label>Start Coordinates (lat, lon):</label>
          <input
            type="text"
            placeholder="e.g., 40.7128, -74.0060"
            onChange={(e) => {
              const parts = e.target.value.split(',').map((p) => parseFloat(p.trim()));
              if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                setStartCoord([parts[0], parts[1]]);
              }
            }}
          />
        </div>
        <div className="coordinate-input">
          <label>End Coordinates (lat, lon):</label>
          <input
            type="text"
            placeholder="e.g., 40.7489, -73.9680"
            onChange={(e) => {
              const parts = e.target.value.split(',').map((p) => parseFloat(p.trim()));
              if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                setEndCoord([parts[0], parts[1]]);
              }
            }}
          />
        </div>
        <button onClick={handleGetDirections} disabled={loading} className="get-directions-btn">
          {loading ? 'Getting Directions...' : 'Get Directions'}
        </button>
      </div>

      {error && <div className="error-message">{error.message}</div>}

      {routes.length > 0 && (
        <div className="routes-list">
          <h3>Routes Found: {routes.length}</h3>
          {routes.map((route, routeIndex) => (
            <div key={routeIndex} className="route-item">
              <h4>Route {routeIndex + 1}</h4>
              <div className="route-info">
                <div className="info-item">
                  <strong>Distance:</strong> {formatDistance(route.distance)}
                </div>
                <div className="info-item">
                  <strong>Duration:</strong> {formatDuration(route.duration)}
                </div>
                {route.legs && (
                  <div className="route-legs">
                    <strong>Legs:</strong>
                    <ul>
                      {route.legs.map((leg, legIndex) => (
                        <li key={legIndex}>
                          Leg {legIndex + 1}: {formatDistance(leg.distance)} ({formatDuration(leg.duration)})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DirectionsViewer;
