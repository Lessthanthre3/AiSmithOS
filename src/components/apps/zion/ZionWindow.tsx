import { VStack, Text, Input, Button, Box, useToast, Divider, UnorderedList, ListItem } from '@chakra-ui/react';
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
    <VStack p={4} spacing={4} color="matrix.500" align="stretch">
      <Text fontSize="2xl" fontWeight="bold">Welcome to Zion</Text>
      
      <Box bg="rgba(0, 255, 0, 0.1)" p={4} borderRadius="md">
        <Text fontSize="lg" fontWeight="bold" mb={2}>Governance</Text>
        <Text>Participate in DAO governance and voting</Text>
        <UnorderedList mt={2} spacing={2}>
          <ListItem>Vote on protocol changes</ListItem>
          <ListItem>Submit proposals</ListItem>
          <ListItem>Delegate voting power</ListItem>
        </UnorderedList>
      </Box>

      <Divider borderColor="matrix.500" opacity={0.3} />

      <Box bg="rgba(0, 255, 0, 0.1)" p={4} borderRadius="md">
        <Text fontSize="lg" fontWeight="bold" mb={2}>Staking</Text>
        <Text>Stake your $AIS tokens to earn rewards</Text>
        <UnorderedList mt={2} spacing={2}>
          <ListItem>APY: 15%</ListItem>
          <ListItem>Lock period: 30 days</ListItem>
          <ListItem>Early unstake fee: 10%</ListItem>
        </UnorderedList>
      </Box>

      <Divider borderColor="matrix.500" opacity={0.3} />

      <Box bg="rgba(0, 255, 0, 0.1)" p={4} borderRadius="md">
        <Text fontSize="lg" fontWeight="bold" mb={2}>Exclusive Features</Text>
        <Text>Access special features and benefits</Text>
        <UnorderedList mt={2} spacing={2}>
          <ListItem>Priority access to new features</ListItem>
          <ListItem>Exclusive airdrops</ListItem>
          <ListItem>Community events</ListItem>
        </UnorderedList>
      </Box>
    </VStack>
  );
};

export default ZionWindow;
