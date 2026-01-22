import React from 'react';
import { getClient } from '../services/LocationIQClient';

interface StaticMapComponentProps {
  center: [number, number];
  zoom?: number;
  size?: [number, number];
  markers?: Array<{
    lat: number;
    lon: number;
    color?: string;
    size?: string;
  }>;
  className?: string;
  alt?: string;
}

export const StaticMap: React.FC<StaticMapComponentProps> = ({
  center,
  zoom = 15,
  size = [600, 400],
  markers,
  className = '',
  alt = 'LocationIQ Map',
}) => {
  const client = getClient();

  const mapURL = client.getStaticMapURL({
    center,
    zoom,
    size,
    markers,
    format: 'png',
  });

  return (
    <div className={`locationiq-static-map ${className}`}>
      <img src={mapURL} alt={alt} style={{ maxWidth: '100%', height: 'auto' }} />
    </div>
  );
};

export default StaticMap;
