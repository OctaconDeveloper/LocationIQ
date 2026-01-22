import React, { useState } from 'react';
import { initializeClient, GeocodingSearch, ReverseGeocodingDisplay } from '@octacondeveloper/locationiq-react';

// Initialize the client with your API key
initializeClient({
  apiKey: 'your-api-key-here',
});

export const GeocodingExample: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  return (
    <div>
      <h2>Address Geocoding Example</h2>
      <GeocodingSearch
        placeholder="Search for a place..."
        limit={10}
        onSelect={(result) => {
          console.log('Selected:', result);
          setSelectedLocation(result);
        }}
      />

      {selectedLocation && (
        <div>
          <h3>Selected Location:</h3>
          <p>Address: {selectedLocation.address}</p>
          <p>
            Coordinates: {selectedLocation.lat}, {selectedLocation.lon}
          </p>
        </div>
      )}
    </div>
  );
};

export const ReverseGeocodingExample: React.FC = () => {
  return (
    <div>
      <h2>Reverse Geocoding Example</h2>
      <ReverseGeocodingDisplay
        onResult={(address) => {
          console.log('Address found:', address);
        }}
      />
    </div>
  );
};

export default GeocodingExample;
