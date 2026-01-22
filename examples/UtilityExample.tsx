import React, { useState } from 'react';
import {
  initializeClient,
  AddressAutocomplete,
  NearbyPOIViewer,
  useBalance,
} from '@octacondeveloper/locationiq-react';

initializeClient({
  apiKey: 'your-api-key-here',
});

export const AutocompleteExample: React.FC = () => {
  const [selected, setSelected] = useState<any>(null);

  return (
    <div>
      <h2>Address Autocomplete Example</h2>
      <AddressAutocomplete
        placeholder="Type an address..."
        onSelect={(result) => {
          console.log('Selected:', result);
          setSelected(result);
        }}
      />
      {selected && (
        <div>
          <p>Selected: {selected.address}</p>
          <p>Coordinates: {selected.lat}, {selected.lon}</p>
        </div>
      )}
    </div>
  );
};

export const NearbyPOIExample: React.FC = () => {
  const [coordinates, setCoordinates] = useState<[number, number] | null>([40.7128, -74.006]);

  return (
    <div>
      <h2>Nearby POI Example</h2>
      {coordinates && (
        <NearbyPOIViewer
          lat={coordinates[0]}
          lon={coordinates[1]}
          limit={10}
          onPOISelect={(poi) => {
            console.log('Selected POI:', poi);
          }}
        />
      )}
    </div>
  );
};

export const AccountBalanceExample: React.FC = () => {
  const { balance, loading, error, getBalance } = useBalance();

  return (
    <div>
      <h2>Account Balance Example</h2>
      <button onClick={getBalance} disabled={loading}>
        {loading ? 'Loading...' : 'Check Balance'}
      </button>

      {error && <p>Error: {error.message}</p>}

      {balance && (
        <div>
          <p>
            Balance: {balance.balance} {balance.currency}
          </p>
        </div>
      )}
    </div>
  );
};

export default AutocompleteExample;
