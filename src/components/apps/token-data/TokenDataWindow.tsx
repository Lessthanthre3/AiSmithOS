import { VStack, HStack, Text, Box, Spinner, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Grid, GridItem, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface TokenData {
  baseToken: {
    name: string;
    symbol: string;
    address: string;
  };
  priceUsd: string;
  volume24h: string;
  liquidityUsd: string;
  fdv: string;
  priceChange24h: number;
  pairAddress: string;
}

const TOKEN_ADDRESS = 'ZNjDcVppJQV8Z9NECsuUhoM1VdJ3fvRtdFhDEaZpump';

const TokenDataWindow = () => {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchTokenData = async () => {
    try {
      console.log('Fetching token data from DexScreener...');
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`);
      const data = await response.json();
      
      if (data.pairs && data.pairs[0]) {
        console.log('Token data received:', data.pairs[0]);
        // Sort pairs by liquidity to get the main pair
        const mainPair = data.pairs.sort((a: any, b: any) => 
          parseFloat(b.liquidity?.usd || '0') - parseFloat(a.liquidity?.usd || '0')
        )[0];

        setTokenData({
          baseToken: mainPair.baseToken,
          priceUsd: mainPair.priceUsd,
          volume24h: mainPair.volume?.h24 || '0',
          liquidityUsd: mainPair.liquidity?.usd || '0',
          fdv: mainPair.fdv || '0',
          priceChange24h: mainPair.priceChange?.h24 || 0,
          pairAddress: mainPair.pairAddress
        });
        setError(null);
      } else {
        console.error('No pairs found in DexScreener response:', data);
        throw new Error('No data available for this token');
      }
    } catch (err) {
      console.error('Error fetching token data:', err);
      setError('Failed to fetch token data');
      toast({
        title: 'Error',
        description: 'Failed to fetch token data',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchTokenData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <VStack h="100%" justify="center" align="center" spacing={4}>
        <Spinner size="xl" color="matrix.500" />
        <Text color="matrix.500">Loading token data...</Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <VStack h="100%" justify="center" align="center" spacing={4}>
        <Text color="red.500">{error}</Text>
      </VStack>
    );
  }

  return (
    <VStack h="100%" p={6} spacing={6} bg="black" color="matrix.500">
      <Text fontSize="2xl" fontWeight="bold">$AIS Token Data</Text>
      
      <Grid templateColumns="repeat(2, 1fr)" gap={6} w="100%">
        <GridItem>
          <Stat>
            <StatLabel>Price USD</StatLabel>
            <StatNumber>${parseFloat(tokenData?.priceUsd || '0').toFixed(6)}</StatNumber>
            <StatHelpText>
              <StatArrow type={tokenData?.priceChange24h && tokenData.priceChange24h >= 0 ? 'increase' : 'decrease'} />
              {Math.abs(tokenData?.priceChange24h || 0).toFixed(2)}%
            </StatHelpText>
          </Stat>
        </GridItem>

        <GridItem>
          <Stat>
            <StatLabel>24h Volume</StatLabel>
            <StatNumber>
              ${parseFloat(tokenData?.volume24h || '0').toLocaleString(undefined, {
                maximumFractionDigits: 0
              })}
            </StatNumber>
          </Stat>
        </GridItem>

        <GridItem>
          <Stat>
            <StatLabel>Liquidity</StatLabel>
            <StatNumber>
              ${parseFloat(tokenData?.liquidityUsd || '0').toLocaleString(undefined, {
                maximumFractionDigits: 0
              })}
            </StatNumber>
          </Stat>
        </GridItem>

        <GridItem>
          <Stat>
            <StatLabel>FDV</StatLabel>
            <StatNumber>
              ${parseFloat(tokenData?.fdv || '0').toLocaleString(undefined, {
                maximumFractionDigits: 0
              })}
            </StatNumber>
          </Stat>
        </GridItem>
      </Grid>

      <Box w="100%" p={4} borderRadius="md" bg="rgba(0, 255, 0, 0.1)">
        <VStack align="start" spacing={2}>
          <Text>
            <Text as="span" fontWeight="bold">Token: </Text>
            {tokenData?.baseToken.name} ({tokenData?.baseToken.symbol})
          </Text>
          <Text>
            <Text as="span" fontWeight="bold">Contract: </Text>
            <Text as="span" fontSize="sm">{tokenData?.baseToken.address}</Text>
          </Text>
          <Text>
            <Text as="span" fontWeight="bold">Pair Address: </Text>
            <Text as="span" fontSize="sm">{tokenData?.pairAddress}</Text>
          </Text>
        </VStack>
      </Box>
    </VStack>
  );
};

export default TokenDataWindow;
