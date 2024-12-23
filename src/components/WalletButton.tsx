import React from 'react';
import { Button, Text, HStack, VStack, useToast } from '@chakra-ui/react';
import { useWallet } from '../contexts/WalletContext';

const WalletButton: React.FC = () => {
  const { publicKey, connect, disconnect, isConnected, isConnecting, balance } = useWallet();
  const toast = useToast();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: error instanceof Error ? error.message : 'Failed to connect wallet',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      toast({
        title: 'Disconnect Failed',
        description: error instanceof Error ? error.message : 'Failed to disconnect wallet',
        status: 'error',
        duration: 5000,
      });
    }
  };

  if (!isConnected) {
    return (
      <Button
        onClick={handleConnect}
        isLoading={isConnecting}
        variant="matrix"
        size="md"
      >
        Connect Wallet
      </Button>
    );
  }

  return (
    <VStack spacing={2} align="stretch">
      <HStack justify="space-between">
        <Button
          onClick={handleDisconnect}
          variant="matrix"
          size="md"
        >
          Disconnect {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
        </Button>
      </HStack>
      <Text fontSize="sm" color="matrix.500">
        Balance: {balance.toFixed(2)} SOL
      </Text>
    </VStack>
  );
};

export default WalletButton;
