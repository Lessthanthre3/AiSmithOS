import { useState, useEffect } from 'react';
import {
  VStack,
  Box,
  Button,
  Text,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { useWallet } from '../../../contexts/WalletContext';

interface AdminState {
  isAuthenticated: boolean;
  isLoading: boolean;
  attempts: number;
  lastAttempt: number;
}

const AdminWindow = () => {
  const [adminState, setAdminState] = useState<AdminState>({
    isAuthenticated: false,
    isLoading: false,
    attempts: 0,
    lastAttempt: 0,
  });
  const { publicKey } = useWallet();
  const toast = useToast();

  // Admin wallet addresses from environment variables
  const ADMIN_ADDRESSES = [
    import.meta.env.VITE_ADMIN_WALLET_1,
    import.meta.env.VITE_ADMIN_WALLET_2,
    import.meta.env.VITE_ADMIN_WALLET_3
  ].filter(Boolean);

  const isAdminWallet = (address: any) => {
    if (!address) {
      console.log('No wallet address provided');
      return false;
    }
    
    // Convert PublicKey object to string if needed
    const addressStr = typeof address === 'string' ? address : address.toString();
    
    // Clean up the addresses by removing any whitespace and making them lowercase
    const cleanAddress = addressStr.toLowerCase().trim();
    
    // Debug logging
    console.log('Connected wallet (cleaned):', cleanAddress);
    console.log('Admin wallets from env:', ADMIN_ADDRESSES);
    
    const isAdmin = ADMIN_ADDRESSES.some(adminAddr => {
      if (!adminAddr) return false;
      const cleanAdminAddr = adminAddr.toLowerCase().trim();
      console.log(`Comparing cleaned addresses: "${cleanAdminAddr}" with "${cleanAddress}"`);
      return cleanAdminAddr === cleanAddress;
    });

    console.log('Is admin wallet?', isAdmin);
    return isAdmin;
  };

  const handleAuthentication = async () => {
    setAdminState(prev => ({ ...prev, isLoading: true }));

    try {
      console.log('Attempting authentication with wallet:', publicKey?.toString());
      
      if (!publicKey) {
        throw new Error('No wallet connected');
      }

      if (isAdminWallet(publicKey)) {
        setAdminState(prev => ({
          ...prev,
          isAuthenticated: true,
          isLoading: false,
          attempts: 0,
          lastAttempt: Date.now(),
        }));
        toast({
          title: 'Authentication successful',
          status: 'success',
          duration: 3000,
        });
      } else {
        throw new Error('Unauthorized wallet');
      }
    } catch (error) {
      setAdminState(prev => ({
        ...prev,
        isLoading: false,
        attempts: prev.attempts + 1,
        lastAttempt: Date.now(),
      }));
      
      toast({
        title: 'Authentication failed',
        description: 'Unauthorized wallet',
        status: 'error',
        duration: 5000,
      });
    }
  };

  // Auto-authenticate when wallet connects
  useEffect(() => {
    if (publicKey && !adminState.isAuthenticated) {
      handleAuthentication();
    }
  }, [publicKey]);

  const handleLogout = () => {
    setAdminState({
      isAuthenticated: false,
      isLoading: false,
      attempts: 0,
      lastAttempt: 0,
    });
  };

  const [connectedWallets, setConnectedWallets] = useState<Array<{
    address: string;
    balance: number;
    lastConnected: Date;
  }>>([]);

  const [systemStatus, setSystemStatus] = useState({
    status: 'Online',
    version: '1.0.0',
    network: 'Mainnet'
  });

  // Track connected wallets
  useEffect(() => {
    if (publicKey) {
      setConnectedWallets(prev => {
        const exists = prev.some(w => w.address === publicKey.toString());
        if (!exists) {
          return [...prev, {
            address: publicKey.toString(),
            balance: 0, // You'll need to fetch this from your token contract
            lastConnected: new Date()
          }];
        }
        return prev;
      });
    }
  }, [publicKey]);

  if (!adminState.isAuthenticated) {
    return (
      <VStack spacing={4} p={4}>
        <Text>Connect your admin wallet to access the admin panel</Text>
      </VStack>
    );
  }

  return (
    <VStack spacing={4} p={6} align="stretch" h="100%">
      <HStack justify="space-between" mb={4}>
        <Text fontSize="2xl">Administrator Panel</Text>
        <Button
          onClick={handleLogout}
          size="sm"
          variant="matrix"
        >
          Logout
        </Button>
      </HStack>

      <Tabs variant="matrix" colorScheme="green">
        <TabList>
          <Tab>Connected Users</Tab>
          <Tab>Airdrops</Tab>
          <Tab>System</Tab>
          <Tab>Connection Logs</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Wallet</Th>
                  <Th>Balance</Th>
                  <Th>Status</Th>
                  <Th>Last Active</Th>
                </Tr>
              </Thead>
              <Tbody>
                {connectedWallets.map(wallet => (
                  <Tr key={wallet.address}>
                    <Td>{wallet.address}</Td>
                    <Td>{wallet.balance} $AIS</Td>
                    <Td><Badge colorScheme="green">Connected</Badge></Td>
                    <Td>{wallet.lastConnected.toLocaleString()}</Td>
                  </Tr>
                ))}
                {connectedWallets.length === 0 && (
                  <Tr>
                    <Td colSpan={4} textAlign="center">No wallets currently connected</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TabPanel>

          <TabPanel>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Amount</Th>
                  <Th>Recipients</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td colSpan={4} textAlign="center">No airdrop data available</Td>
                </Tr>
              </Tbody>
            </Table>
          </TabPanel>

          <TabPanel>
            <VStack align="stretch" spacing={4}>
              <Box bg="rgba(0, 255, 0, 0.1)" p={4} borderRadius="md">
                <Text fontWeight="bold" mb={2}>System Status</Text>
                <HStack>
                  <Badge colorScheme="green">{systemStatus.status}</Badge>
                  <Badge colorScheme="blue">Version {systemStatus.version}</Badge>
                  <Badge colorScheme="purple">{systemStatus.network}</Badge>
                </HStack>
              </Box>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack align="stretch" spacing={2}>
              {connectedWallets.map(wallet => (
                <Text key={wallet.address} fontSize="sm">
                  [{wallet.lastConnected.toLocaleString()}] New wallet connected: {wallet.address} (Balance: {wallet.balance} $AIS)
                </Text>
              ))}
              {connectedWallets.length === 0 && (
                <Text fontSize="sm">No connection logs available</Text>
              )}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default AdminWindow;
