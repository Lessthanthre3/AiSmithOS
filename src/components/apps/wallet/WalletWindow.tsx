import { Box, Button, VStack, Text, useToast, Alert, AlertIcon, AlertDescription } from '@chakra-ui/react';
import { useWallet } from '../../../contexts/WalletContext';
import { useState } from 'react';

const WalletWindow = () => {
  const { 
    publicKey, 
    isConnected, 
    isConnecting, 
    connect, 
    disconnect, 
    connectionStatus,
    retryConnection,
    balance 
  } = useWallet();
  const [isRetrying, setIsRetrying] = useState(false);
  const toast = useToast();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      // Error is already handled in WalletContext
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      // Error is already handled in WalletContext
    }
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await retryConnection();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Text color="green.300" fontSize="lg" fontWeight="bold">
          Wallet Status
        </Text>
        
        {connectionStatus === 'error' && (
          <Alert status="error" variant="subtle" borderRadius="md">
            <AlertIcon />
            <AlertDescription>
              Connection error. Please check your network connection.
              <Button
                ml={2}
                size="sm"
                colorScheme="red"
                onClick={handleRetry}
                isLoading={isRetrying}
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {isConnected ? (
          <>
            <Text color="green.300">
              Connected: {publicKey?.toString()}
            </Text>
            <Text color="green.300">
              Balance: {balance.toFixed(4)} SOL
            </Text>
            <Button
              onClick={handleDisconnect}
              colorScheme="red"
              variant="outline"
              isLoading={isConnecting}
            >
              Disconnect
            </Button>
          </>
        ) : (
          <Button
            onClick={handleConnect}
            colorScheme="green"
            variant="outline"
            isLoading={isConnecting}
          >
            Connect Wallet
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default WalletWindow;
