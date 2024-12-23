import { VStack, Text, Box, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, StatGroup, Divider, Spinner, useInterval, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

const TOKEN_ADDRESS = "ZNjDcVppJQV8Z9NECsuUhoM1VdJ3fvRtdFhDEaZpump";

interface TokenPair {
  chainId: string;
  dexId: string;
  priceUsd: string;
  priceChange: {
    h24?: number;
    h6?: number;
    h1?: number;
    m5?: number;
  };
  liquidity?: {
    usd: number;
  };
  volume?: {
    h24: number;
  };
}

interface TokenData {
  pairs?: TokenPair[];
}

const TokenDataWindow = () => {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTokenData = async () => {
    try {
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`);
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

  useEffect(() => {
    fetchTokenData();
  }, []);

  // Refresh data every 30 seconds
  useInterval(fetchTokenData, 30000);

  if (loading) {
    return (
      <VStack spacing={6} p={4} color="matrix.500" align="center" justify="center" height="100%">
        <Spinner color="#00ff00" size="xl" />
        <Text>Loading token data...</Text>
      </VStack>
    );
  }

  const pair = tokenData?.pairs?.[0];

  return (
    <VStack spacing={6} p={4} color="matrix.500">
      <Text fontSize="2xl" fontWeight="bold">$AIS Token Data</Text>
      
      <Box width="100%" bg="rgba(0, 255, 0, 0.1)" p={4} borderRadius="md">
        <Text fontSize="sm" fontFamily="monospace" wordBreak="break-all">
          Contract: {TOKEN_ADDRESS}
        </Text>
      </Box>

      <StatGroup width="100%">
        <Stat bg="rgba(0, 255, 0, 0.1)" p={4} borderRadius="md" mr={2}>
          <StatLabel>Price</StatLabel>
          <StatNumber>${pair ? parseFloat(pair.priceUsd).toFixed(6) : '0.00'}</StatNumber>
          <StatHelpText>
            <StatArrow type={pair?.priceChange.h24 >= 0 ? "increase" : "decrease"} />
            {pair ? pair.priceChange.h24.toFixed(2) : '0.00'}%
          </StatHelpText>
        </Stat>
        <Stat bg="rgba(0, 255, 0, 0.1)" p={4} borderRadius="md">
          <StatLabel>24h Volume</StatLabel>
          <StatNumber>${pair?.volume?.h24.toLocaleString() ?? '0'}</StatNumber>
          <StatHelpText>
            <Text color={pair?.liquidity ? '#00ff00' : 'yellow.500'}>
              Liquidity: ${pair?.liquidity?.usd.toLocaleString() ?? '0'}
            </Text>
          </StatHelpText>
        </Stat>
      </StatGroup>

      <Box width="100%" bg="rgba(0, 255, 0, 0.1)" p={4} borderRadius="md">
        <Text fontWeight="bold" mb={2}>Market Data</Text>
        <VStack align="stretch" spacing={2}>
          <Text>DEX: {pair?.dexId ?? 'N/A'}</Text>
          <Text>Chain: {pair?.chainId ?? 'N/A'}</Text>
          <Text>1h Change: {pair?.priceChange.h1.toFixed(2) ?? '0.00'}%</Text>
          <Text>6h Change: {pair?.priceChange.h6.toFixed(2) ?? '0.00'}%</Text>
        </VStack>
      </Box>

      <Divider borderColor="matrix.500" opacity={0.3} />

      <Box width="100%" bg="rgba(0, 255, 0, 0.1)" p={4} borderRadius="md">
        <Text fontWeight="bold" mb={2}>Token Metrics</Text>
        <Text>Total Supply: 1,000,000,000</Text>
      </Box>

      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th color="green.300">Pair</Th>
            <Th color="green.300" isNumeric>Price</Th>
            <Th color="green.300" isNumeric>24h Volume</Th>
            <Th color="green.300" isNumeric>24h Change</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tokenData?.pairs?.map((pair, index) => (
            <Tr key={index}>
              <Td color="green.300">{pair.dexId}</Td>
              <Td color="green.300" isNumeric>${parseFloat(pair.priceUsd).toFixed(4)}</Td>
              <Td color="green.300" isNumeric>{(pair.volume?.h24 / 1000).toFixed(1)}k</Td>
              <Td 
                color={pair.priceChange.h24 && pair.priceChange.h24 > 0 ? "green.300" : "red.300"} 
                isNumeric
              >
                {pair.priceChange.h24 ? `${pair.priceChange.h24.toFixed(2)}%` : 'N/A'}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </VStack>
  );
};

export default TokenDataWindow;
