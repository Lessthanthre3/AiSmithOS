import { VStack, HStack, Text, Button, Box, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useWallet } from '../../../contexts/WalletContext';
import { FaWallet, FaCopy } from 'react-icons/fa';
import { heliusRpcRequest, TOKEN_IDS } from '../../../config/rpc';

interface TokenData {
  priceUsd: string;
  priceChange24h: number;
}

const WalletWindow = () => {
  const { publicKey, connect, disconnect, balance } = useWallet();
  const [solPrice, setSolPrice] = useState<TokenData | null>(null);
  const toast = useToast();

  const fetchTokenData = async () => {
    try {
      // Fetch SOL price from CoinGecko
      const solResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true');
      const solData = await solResponse.json();
      if (solData.solana) {
        setSolPrice({
          priceUsd: solData.solana.usd.toString(),
          priceChange24h: solData.solana.usd_24h_change
        });
      }
    } catch (error) {
      console.error('Error fetching token data:', error);
    }
  };

  useEffect(() => {
    if (publicKey) {
      fetchTokenData();
      // Set up polling every 30 seconds
      const interval = setInterval(() => {
        fetchTokenData();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [publicKey]);

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      toast({
        title: 'Address copied',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const formatBalance = (balance: number) => {
    return balance.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    });
  };

  return (
    <VStack spacing={4} p={4} align="stretch">
      <Text fontSize="2xl" fontWeight="bold" color="matrix.500">Wallet</Text>
      
      {publicKey ? (
        <>
          <Box bg="whiteAlpha.100" p={3} borderRadius="md">
            <HStack justify="space-between">
              <Text color="matrix.500">Address: {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}</Text>
              <Button size="sm" leftIcon={<FaCopy />} variant="ghost" onClick={handleCopyAddress}>
                Copy
              </Button>
            </HStack>
          </Box>

          <Box bg="whiteAlpha.100" p={3} borderRadius="md">
            <Stat>
              <StatLabel color="matrix.500">SOL Balance</StatLabel>
              <StatNumber color="matrix.500">{formatBalance(balance)} SOL</StatNumber>
              {solPrice && (
                <StatHelpText>
                  <StatArrow type={solPrice.priceChange24h >= 0 ? 'increase' : 'decrease'} />
                  {solPrice.priceChange24h.toFixed(2)}% (${parseFloat(solPrice.priceUsd).toFixed(2)})
                </StatHelpText>
              )}
            </Stat>
          </Box>

          <Button colorScheme="red" onClick={disconnect}>
            Disconnect
          </Button>
        </>
      ) : (
        <Button leftIcon={<FaWallet />} onClick={connect}>
          Connect Wallet
        </Button>
      )}
    </VStack>
  );
};

export default WalletWindow;
