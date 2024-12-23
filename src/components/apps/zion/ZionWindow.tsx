import { VStack, Text, Input, Button, Box, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useWallet } from '../../../contexts/WalletContext';

const ZionWindow = () => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { publicKey } = useWallet();
  const toast = useToast();

  const checkAuthorization = async () => {
    // TODO: Implement actual token balance check
    if (password === 'matrix') { // Temporary password check
      setIsAuthorized(true);
    } else {
      toast({
        title: 'Access Denied',
        description: 'Incorrect password or insufficient $AIS balance',
        status: 'error',
        duration: 3000,
      });
    }
  };

  if (!publicKey) {
    return (
      <VStack p={4} spacing={4} color="matrix.500">
        <Text>Please connect your wallet to access Zion</Text>
      </VStack>
    );
  }

  if (!isAuthorized) {
    return (
      <VStack p={4} spacing={4} color="matrix.500">
        <Text fontSize="xl">Welcome to Zion Gateway</Text>
        <Text>Access requires $AIS token holdings</Text>
        <Input
          type="password"
          placeholder="Enter Access Code"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="matrix"
        />
        <Button variant="matrix" onClick={checkAuthorization}>
          Verify Access
        </Button>
      </VStack>
    );
  }

  return (
    <VStack p={4} spacing={4} color="matrix.500">
      <Text fontSize="xl">Welcome to Zion</Text>
      <Box width="100%" p={4} bg="rgba(0, 255, 0, 0.1)" borderRadius="md">
        <Text fontWeight="bold" mb={2}>Available Utilities:</Text>
        {/* Add token-gated utilities here */}
        <Text>Coming Soon...</Text>
      </Box>
    </VStack>
  );
};

export default ZionWindow;
