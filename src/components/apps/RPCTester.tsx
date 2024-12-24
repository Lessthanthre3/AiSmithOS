import React, { useState } from 'react';
import axios from 'axios';

const RPCTester: React.FC = () => {
  const [ownerAddress, setOwnerAddress] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssetsByOwner = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/rpc/assets/owner', {
        owner: ownerAddress
      });
      
      setResults(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">RPC Tester</h2>
      
      <div className="mb-4">
        <input
          type="text"
          value={ownerAddress}
          onChange={(e) => setOwnerAddress(e.target.value)}
          placeholder="Enter owner address"
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        onClick={fetchAssetsByOwner}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Fetch Assets'}
      </button>

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {results && (
        <div className="mt-4">
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default RPCTester;
