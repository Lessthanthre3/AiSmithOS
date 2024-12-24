import React, { useEffect, useState } from 'react';
import { Box, VStack, Text, Spinner, useInterval } from '@chakra-ui/react';

interface TokenData {
  pairs?: [{
    chainId: string;
    dexId: string;
    url: string;
    pairAddress: string;
    baseToken: {
      address: string;
      name: string;
      symbol: string;
    };
    priceUsd: string;
    priceChange: {
      h24: number;
      h6: number;
      h1: number;
      m5: number;
    };
    liquidity?: {
      usd: number;
    };
    volume?: {
      h24: number;
    };
  }];
}

const TokenTracker: React.FC = () => {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const CONTRACT_ADDRESS = 'ZNjDcVppJQV8Z9NECsuUhoM1VdJ3fvRtdFhDEaZpump';

  const fetchTokenData = async () => {
    try {
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${CONTRACT_ADDRESS}`);
      if (!response.ok) {
        throw new Error('Failed to fetch token data');
      }
      const data = await response.json();
      setTokenData(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchTokenData();
  }, []);

  // Refresh data every 30 seconds
  useInterval(fetchTokenData, 30000);

  if (loading) {
    return (
      <Box p={4} bg="rgba(0, 0, 0, 0.8)" borderRadius="md" color="#00ff00">
        <VStack spacing={4} align="center">
          <Spinner color="#00ff00" />
          <Text>Loading token data...</Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4} bg="rgba(0, 0, 0, 0.8)" borderRadius="md" color="#00ff00">
        <Text>Error: {error}</Text>
      </Box>
    );
  }

  const pair = tokenData?.pairs?.[0];

  return (
    <Box p={4} bg="rgba(0, 0, 0, 0.8)" borderRadius="md" color="#00ff00">
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl" fontWeight="bold">$AIS Token Tracker</Text>
        
        <Box borderWidth="1px" borderColor="#00ff00" p={3} borderRadius="md">
          <Text fontSize="sm" mb={2}>Contract: {CONTRACT_ADDRESS}</Text>
        </Box>
        
        {pair ? (
          <>
            <Box borderWidth="1px" borderColor="#00ff00" p={3} borderRadius="md">
              <Text>Price: ${parseFloat(pair.priceUsd).toFixed(6)} USD</Text>
              <Text>24h Change: {pair.priceChange.h24?.toFixed(2)}%</Text>
              <Text>1h Change: {pair.priceChange.h1?.toFixed(2)}%</Text>
            </Box>

            {pair.liquidity && (
              <Box borderWidth="1px" borderColor="#00ff00" p={3} borderRadius="md">
                <Text>Liquidity: ${pair.liquidity.usd.toLocaleString()}</Text>
                {pair.volume && (
                  <Text>24h Volume: ${pair.volume.h24.toLocaleString()}</Text>
                )}
              </Box>
            )}

            <Box borderWidth="1px" borderColor="#00ff00" p={3} borderRadius="md">
              <Text>DEX: {pair.dexId}</Text>
              <Text>Chain: {pair.chainId}</Text>
              <Text fontSize="sm" color="gray.400">
                <a href={pair.url} target="_blank" rel="noopener noreferrer" style={{ color: '#00ff00' }}>
                  View on Dexscreener →
                </a>
              </Text>
            </Box>
          </>
        ) : (
          <Text>No data available</Text>
        )}
      </VStack>
    </Box>
  );
};

export default TokenTracker;
