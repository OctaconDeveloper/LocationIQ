import React from 'react';
import {
  initializeClient,
  GeocodingSearch,
  ReverseGeocodingDisplay,
  AddressAutocomplete,
  DirectionsViewer,
  StaticMap,
  TimezoneDisplay,
  NearbyPOIViewer,
  useBalance,
} from '../src';

// Initialize the LocationIQ client
initializeClient({
  apiKey: process.env.REACT_APP_LOCATIONIQ_API_KEY || 'your-api-key-here',
});

interface ComponentDemoProps {
  title: string;
  children: React.ReactNode;
}

const ComponentDemo: React.FC<ComponentDemoProps> = ({ title, children }) => (
  <section style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ddd' }}>
    <h2>{title}</h2>
    {children}
  </section>
);

export const App: React.FC = () => {
  const [currentLat, setCurrentLat] = React.useState<number | null>(null);
  const [currentLon, setCurrentLon] = React.useState<number | null>(null);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>LocationIQ React Component Package - Demo</h1>
      <p>
        This demo showcases all the components and hooks available in the LocationIQ React package.
      </p>

      <ComponentDemo title="1. Address Geocoding Search">
        <p>Search for an address and get its coordinates:</p>
        <GeocodingSearch
          placeholder="Enter an address (e.g., 'Statue of Liberty, New York')..."
          limit={5}
          onSelect={(result) => {
            console.log('Geocoding result:', result);
            setCurrentLat(parseFloat(result.lat));
            setCurrentLon(parseFloat(result.lon));
          }}
        />
      </ComponentDemo>

      <ComponentDemo title="2. Address Autocomplete">
        <p>Get address suggestions as you type:</p>
        <AddressAutocomplete
          placeholder="Type an address for autocomplete suggestions..."
          limit={5}
          onSelect={(result) => {
            console.log('Autocomplete result:', result);
          }}
        />
      </ComponentDemo>

      <ComponentDemo title="3. Reverse Geocoding">
        <p>Convert coordinates to an address or use your current location:</p>
        <ReverseGeocodingDisplay
          onResult={(address) => {
            console.log('Address found:', address);
          }}
        />
      </ComponentDemo>

      {currentLat && currentLon && (
        <>
          <ComponentDemo title="4. Static Map">
            <p>Display a static map with markers:</p>
            <StaticMap
              center={[currentLat, currentLon]}
              zoom={15}
              size={[800, 400]}
              markers={[
                {
                  lat: currentLat,
                  lon: currentLon,
                  color: 'red',
                },
              ]}
              alt="Location Map"
            />
          </ComponentDemo>

          <ComponentDemo title="5. Directions & Routing">
            <p>Get directions between two points:</p>
            <DirectionsViewer
              profile="car"
              onRoutesLoaded={(routes) => {
                console.log('Routes loaded:', routes);
              }}
            />
          </ComponentDemo>

          <ComponentDemo title="6. Timezone Information">
            <p>Get timezone information for the selected location:</p>
            <TimezoneDisplay lat={currentLat} lon={currentLon} />
          </ComponentDemo>

          <ComponentDemo title="7. Nearby Points of Interest">
            <p>Find nearby places and amenities:</p>
            <NearbyPOIViewer
              lat={currentLat}
              lon={currentLon}
              limit={15}
              onPOISelect={(poi) => {
                console.log('Selected POI:', poi);
              }}
            />
          </ComponentDemo>
        </>
      )}

      <ComponentDemo title="8. Account Balance">
        <AccountBalanceDemo />
      </ComponentDemo>

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f5f5f5' }}>
        <h2>How to Use This Package</h2>
        <ol>
          <li>Install: <code>npm install @octacondeveloper/locationiq-react</code></li>
          <li>Get API key from <a href="https://locationiq.com">https://locationiq.com</a></li>
          <li>Initialize: <code>initializeClient({'{apiKey: "YOUR_KEY"}'});</code></li>
          <li>Use components or hooks in your React app</li>
        </ol>
        <p>
          For more details, see the{' '}
          <a href="https://github.com/location-iq/locationiq-react#readme">
            full documentation
          </a>
        </p>
      </div>
    </div>
  );
};

const AccountBalanceDemo: React.FC = () => {
  const { balance, loading, error, getBalance } = useBalance();

  return (
    <div>
      <p>Check your LocationIQ account balance and usage:</p>
      <button
        onClick={getBalance}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Loading...' : 'Check Balance'}
      </button>

      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

      {balance && (
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e7f3ff' }}>
          <p>
            <strong>Current Balance:</strong> {balance.balance} {balance.currency}
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
