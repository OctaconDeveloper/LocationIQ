import React from 'react';
import {
  initializeClient,
  DirectionsViewer,
  useMatrix,
  useTimezone,
  StaticMap,
} from '@octacondeveloper/locationiq-react';

initializeClient({
  apiKey: 'your-api-key-here',
});

export const DirectionsExample: React.FC = () => {
  return (
    <div>
      <h2>Directions/Routing Example</h2>
      <DirectionsViewer
        profile="car"
        onRoutesLoaded={(routes) => {
          console.log('Routes:', routes);
        }}
      />
    </div>
  );
};

export const StaticMapExample: React.FC = () => {
  return (
    <div>
      <h2>Static Map Example</h2>
      <StaticMap
        center={[40.7128, -74.006]}
        zoom={15}
        size={[600, 400]}
        markers={[
          {
            lat: 40.7128,
            lon: -74.006,
            color: 'red',
          },
        ]}
      />
    </div>
  );
};

export const TimezoneExample: React.FC = () => {
  return (
    <div>
      <h2>Timezone Example</h2>
      <p>Timezone for New York (40.7128, -74.0060):</p>
      {/* Import TimezoneDisplay from @octacondeveloper/locationiq-react */}
    </div>
  );
};

export const MatrixExample: React.FC = () => {
  const coordinates: [number, number][] = [
    [40.7128, -74.006], // New York
    [40.7489, -73.968], // Manhattan
    [40.6582, -73.9776], // Brooklyn
  ];

  const { matrix, loading, error, getMatrix } = useMatrix(coordinates);

  return (
    <div>
      <h2>Distance Matrix Example</h2>
      <button
        onClick={() => getMatrix(coordinates, 'car')}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Calculate Distances'}
      </button>

      {error && <p>Error: {error.message}</p>}

      {matrix && (
        <div>
          <h3>Distance Matrix Results</h3>
          <table>
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Distance (m)</th>
                <th>Duration (s)</th>
              </tr>
            </thead>
            <tbody>
              {matrix.durations && matrix.distances && (
                <>
                  {matrix.durations.map((row, i) =>
                    row.map((duration, j) => (
                      <tr key={`${i}-${j}`}>
                        <td>Point {i + 1}</td>
                        <td>Point {j + 1}</td>
                        <td>{matrix.distances![i]?.[j]}</td>
                        <td>{duration}</td>
                      </tr>
                    ))
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DirectionsExample;
