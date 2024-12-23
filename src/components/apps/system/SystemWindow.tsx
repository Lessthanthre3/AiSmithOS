import { useState } from 'react';
import {
  VStack,
  Text,
  Box,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Button,
  Input,
  useToast,
  HStack,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Switch,
  FormControl,
  FormLabel,
  Select,
} from '@chakra-ui/react';
import { useWallet } from '../../../contexts/WalletContext';
import { useSystem } from '../../../contexts/SystemContext';
import { sha256 } from 'js-sha256';

// Whitelisted admin wallets
const ADMIN_WALLETS = [
  '25NcM1z7dxbRZE9JptiBVec9XySd8MGCnxZKMvzDP5T5', // Dev wallet
  '4qKmxCGme3oDMbn5EidEJ22cMx1EWAXHsVXPMctCiHwZ', // Treasury wallet
  'F2NMjJX7xHfKWfgAEv9uATcgx2nabzDFkKtk8szoJASN'  // Raffle Wallet
];

interface AdminState {
  isAuthenticated: boolean;
  isLoading: boolean;
  attempts: number;
  lastAttempt: number;
}

const SystemWindow = () => {
  const [adminState, setAdminState] = useState<AdminState>({
    isAuthenticated: false,
    isLoading: false,
    attempts: 0,
    lastAttempt: 0,
  });
  const [password, setPassword] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const { publicKey } = useWallet();
  const { toggleMatrixEffect, isMatrixEnabled } = useSystem();
  const toast = useToast();

  const isAdminWallet = (address: string | null) => {
    return address && ADMIN_WALLETS.includes(address);
  };

  const handleAuthentication = async () => {
    if (adminState.attempts >= 3) {
      const timeSinceLastAttempt = Date.now() - adminState.lastAttempt;
      if (timeSinceLastAttempt < 300000) { // 5 minutes lockout
        toast({
          title: 'Too many attempts',
          description: `Please wait ${Math.ceil((300000 - timeSinceLastAttempt) / 60000)} minutes before trying again`,
          status: 'error',
          duration: 5000,
        });
        return;
      }
      setAdminState(prev => ({ ...prev, attempts: 0 }));
    }

    setAdminState(prev => ({ ...prev, isLoading: true }));

    try {
      const hashedPassword = sha256(password);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (hashedPassword === process.env.ADMIN_PASSWORD_HASH && isAdminWallet(publicKey)) {
        setAdminState(prev => ({
          ...prev,
          isAuthenticated: true,
          isLoading: false,
          attempts: 0,
          lastAttempt: Date.now(),
        }));
      } else {
        throw new Error('Invalid credentials');
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
        description: 'Invalid credentials or unauthorized wallet',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleLogout = () => {
    setAdminState({
      isAuthenticated: false,
      isLoading: false,
      attempts: 0,
      lastAttempt: 0,
    });
    setPassword('');
  };

  const handleMatrixToggle = () => {
    toggleMatrixEffect();
    toast({
      title: isMatrixEnabled ? 'Matrix Effect Disabled' : 'Matrix Effect Enabled',
      status: 'success',
      duration: 2000,
    });
  };

  return (
    <VStack spacing={4} p={6} align="stretch" h="100%">
      <Text fontSize="2xl" mb={4}>System Control Panel</Text>

      <Tabs 
        variant="matrix" 
        colorScheme="green" 
        index={selectedTab}
        onChange={setSelectedTab}
        h="calc(100% - 60px)"
      >
        <TabList>
          <Tab>System Info</Tab>
          {isAdminWallet(publicKey) && <Tab>Admin Panel</Tab>}
          <Tab>Settings</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack spacing={4} align="stretch">
              <Box bg="rgba(0, 255, 0, 0.1)" p={4} borderRadius="md">
                <Text fontWeight="bold" mb={2}>System Status</Text>
                <HStack>
                  <Badge colorScheme="green">Online</Badge>
                  <Badge colorScheme="blue">Version 1.0.0</Badge>
                  <Badge colorScheme="purple">Mainnet</Badge>
                </HStack>
              </Box>

              <Box bg="rgba(0, 255, 0, 0.1)" p={4} borderRadius="md">
                <Text fontWeight="bold" mb={2}>Connected Wallet</Text>
                {publicKey ? (
                  <Text fontSize="sm" wordBreak="break-all">{publicKey}</Text>
                ) : (
                  <Text fontSize="sm">No wallet connected</Text>
                )}
              </Box>

              <Box bg="rgba(0, 255, 0, 0.1)" p={4} borderRadius="md">
                <Text fontWeight="bold" mb={2}>Network Status</Text>
                <Text fontSize="sm">Connected to Solana Mainnet</Text>
                <Text fontSize="sm">Block Height: 12345678</Text>
                <Text fontSize="sm">TPS: 2,500</Text>
              </Box>
            </VStack>
          </TabPanel>

          {isAdminWallet(publicKey) && (
            <TabPanel>
              {!adminState.isAuthenticated ? (
                <VStack spacing={4} align="stretch">
                  <Box bg="rgba(0, 255, 0, 0.1)" p={4} borderRadius="md">
                    <Text fontSize="sm">
                      ⚠️ This area is restricted to authorized administrators only.
                      Both wallet verification and password are required.
                    </Text>
                  </Box>
                  
                  <Input
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isDisabled={adminState.isLoading}
                  />
                  
                  <Button
                    onClick={handleAuthentication}
                    isLoading={adminState.isLoading}
                    loadingText="Verifying..."
                    variant="matrix"
                    isDisabled={!publicKey || !password}
                  >
                    Authenticate
                  </Button>
                </VStack>
              ) : (
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="xl">Administrator Panel</Text>
                    <Button
                      onClick={handleLogout}
                      size="sm"
                      variant="matrix"
                    >
                      Logout
                    </Button>
                  </HStack>

                  <Tabs variant="matrix" colorScheme="green" size="sm">
                    <TabList>
                      <Tab>Users</Tab>
                      <Tab>Airdrops</Tab>
                      <Tab>Logs</Tab>
                    </TabList>

                    <TabPanels>
                      <TabPanel>
                        <Table variant="simple" size="sm">
                          <Thead>
                            <Tr>
                              <Th>Wallet</Th>
                              <Th>Role</Th>
                              <Th>Status</Th>
                              <Th>Actions</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {ADMIN_WALLETS.map((wallet) => (
                              <Tr key={wallet}>
                                <Td>{wallet}</Td>
                                <Td>Admin</Td>
                                <Td><Badge colorScheme="green">Active</Badge></Td>
                                <Td>
                                  <Button size="xs" variant="matrix">Manage</Button>
                                </Td>
                              </Tr>
                            ))}
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
                              <Td>2024-12-22</Td>
                              <Td>1000 $AIS</Td>
                              <Td>150</Td>
                              <Td><Badge colorScheme="green">Completed</Badge></Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </TabPanel>

                      <TabPanel>
                        <VStack align="stretch" spacing={2}>
                          <Text fontSize="sm">[2024-12-22 12:09:13] Admin login successful</Text>
                          <Text fontSize="sm">[2024-12-22 12:08:45] System update completed</Text>
                          <Text fontSize="sm">[2024-12-22 12:07:30] New user registered</Text>
                        </VStack>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </VStack>
              )}
            </TabPanel>
          )}

          <TabPanel>
            <VStack spacing={4} align="stretch">
              <Box bg="rgba(0, 255, 0, 0.1)" p={4} borderRadius="md">
                <Text fontWeight="bold" mb={4}>Visual Settings</Text>
                <VStack spacing={4} align="stretch">
                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">
                      Matrix Rain Effect
                    </FormLabel>
                    <Switch
                      isChecked={isMatrixEnabled}
                      onChange={handleMatrixToggle}
                      colorScheme="green"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Theme Intensity</FormLabel>
                    <Select defaultValue="medium" variant="matrix">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </Select>
                  </FormControl>
                </VStack>
              </Box>

              <Box bg="rgba(0, 255, 0, 0.1)" p={4} borderRadius="md">
                <Text fontWeight="bold" mb={4}>Display Settings</Text>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Resolution</FormLabel>
                    <Select defaultValue="1080p" variant="matrix">
                      <option value="720p">1280x720</option>
                      <option value="1080p">1920x1080</option>
                      <option value="1440p">2560x1440</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Refresh Rate</FormLabel>
                    <Select defaultValue="60" variant="matrix">
                      <option value="60">60 Hz</option>
                      <option value="120">120 Hz</option>
                      <option value="144">144 Hz</option>
                    </Select>
                  </FormControl>
                </VStack>
              </Box>

              <Box bg="rgba(0, 255, 0, 0.1)" p={4} borderRadius="md">
                <Text fontWeight="bold" mb={4}>Performance Settings</Text>
                <VStack spacing={4} align="stretch">
                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">
                      Hardware Acceleration
                    </FormLabel>
                    <Switch defaultChecked colorScheme="green" />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">
                      Background Processes
                    </FormLabel>
                    <Switch defaultChecked colorScheme="green" />
                  </FormControl>
                </VStack>
              </Box>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default SystemWindow;
