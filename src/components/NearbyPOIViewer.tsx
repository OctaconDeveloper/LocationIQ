import React from 'react';
import { useNearbyPOI } from '../hooks';
import * as Types from '../types';

interface NearbyPOIComponentProps {
  lat?: number;
  lon?: number;
  tag?: string;
  limit?: number;
  className?: string;
  onPOISelect?: (poi: Types.NearbyPOIResult) => void;
}

export const NearbyPOIViewer: React.FC<NearbyPOIComponentProps> = ({
  lat,
  lon,
  tag,
  limit = 20,
  className = '',
  onPOISelect,
}) => {
  const { pois, loading, error, getNearby } = useNearbyPOI(lat, lon);

  React.useEffect(() => {
    if (lat !== undefined && lon !== undefined) {
      getNearby(lat, lon, tag);
    }
  }, [lat, lon, tag, getNearby]);

  if (!lat || !lon) {
    return <div className="poi-info">Please provide latitude and longitude</div>;
  }

  return (
    <div className={`locationiq-nearby-poi ${className}`}>
      {loading && <div className="poi-loading">Loading nearby POIs...</div>}
      {error && <div className="poi-error">{error.message}</div>}

      {pois.length > 0 && (
        <div className="poi-list">
          <h3>Nearby Points of Interest ({pois.length})</h3>
          <ul>
            {pois.slice(0, limit).map((poi, index) => (
              <li
                key={`${poi.place_id || index}`}
                className="poi-item"
                onClick={() => onPOISelect?.(poi)}
              >
                <div className="poi-name">{poi.name}</div>
                <div className="poi-type">
                  {poi.class} • {poi.type}
                </div>
                <div className="poi-address">{poi.display_name}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {pois.length === 0 && !loading && (
        <div className="poi-empty">No points of interest found nearby</div>
      )}
    </div>
  );
};

export default NearbyPOIViewer;
