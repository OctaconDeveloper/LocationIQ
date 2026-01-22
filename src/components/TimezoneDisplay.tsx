import React from 'react';
import { useTimezone } from '../hooks';

interface TimezoneDisplayProps {
  lat: number;
  lon: number;
  className?: string;
}

export const TimezoneDisplay: React.FC<TimezoneDisplayProps> = ({
  lat,
  lon,
  className = '',
}) => {
  const { timezone, loading, error } = useTimezone(lat, lon, true);

  if (loading) return <div className="timezone-loading">Loading timezone...</div>;
  if (error) return <div className="timezone-error">{error.message}</div>;
  if (!timezone) return null;

  return (
    <div className={`locationiq-timezone ${className}`}>
      <div className="timezone-card">
        <h3>Timezone Information</h3>
        <div className="timezone-item">
          <strong>Timezone:</strong> {timezone.timezone}
        </div>
        <div className="timezone-item">
          <strong>Abbreviation:</strong> {timezone.abbreviation}
        </div>
        <div className="timezone-item">
          <strong>UTC Offset:</strong> {timezone.utc_offset}
        </div>
        <div className="timezone-item">
          <strong>Current Time:</strong> {timezone.current_time}
        </div>
        <div className="timezone-item">
          <strong>Daylight Saving:</strong> {timezone.is_dst ? 'Yes' : 'No'}
        </div>
      </div>
    </div>
  );
};

export default TimezoneDisplay;
