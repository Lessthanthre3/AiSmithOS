import { 
  VStack, Text, Box, useToast, HStack, Tabs, TabList, Tab, TabPanels, TabPanel,
  Table, Thead, Tbody, Tr, Th, Td, Progress, Button, Spinner, Badge, Tooltip,
  IconButton, Menu, MenuButton, MenuList, MenuItem
} from '@chakra-ui/react';
import { useWallet } from '../../../contexts/WalletContext';
import { useSession } from '../../../contexts/SessionContext';
import { isAdminWallet } from '../../../config/apps';
import { useEffect, useState } from 'react';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { RPC_ENDPOINT, getConnectionConfig, heliusRpcRequest, getCurrentEndpoint, TOKEN_IDS } from '../../../config/rpc';
import { FiMoreVertical, FiRefreshCw, FiUserX } from 'react-icons/fi';

interface OnlineUser {
  address: string;
  solBalance: number;
  lastActive: Date;
  userAgent?: string;
  status: 'active' | 'idle' | 'offline';
}

interface RaffleTicket {
  address: string;
  tickets: number;
  solSpent: number;
}

const AdminPanel = () => {
  const { publicKey } = useWallet();
  const { connectedUsers, removeConnectedUser } = useSession();
  const toast = useToast();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [raffleTickets, setRaffleTickets] = useState<RaffleTicket[]>([]);
  const [remainingTickets, setRemainingTickets] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const fetchUserBalances = async (user: { address: string; lastActive: Date; userAgent?: string }) => {
    const connection = new Connection(getCurrentEndpoint(), getConnectionConfig());
    
    try {
      // Get SOL balance
      const solBalance = await connection.getBalance(new PublicKey(user.address));
      
      return {
        address: user.address,
        solBalance: solBalance / LAMPORTS_PER_SOL,
        lastActive: user.lastActive,
        userAgent: user.userAgent,
        status: getUserStatus(user.lastActive)
      };
    } catch (error) {
      console.error('Error fetching balances for user:', user.address, error);
      return {
        address: user.address,
        solBalance: 0,
        lastActive: user.lastActive,
        userAgent: user.userAgent,
        status: getUserStatus(user.lastActive)
      };
    }
  };

  useEffect(() => {
    if (publicKey && isAdminWallet(publicKey.toString())) {
      fetchData();
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [publicKey, connectedUsers]);

  const getUserStatus = (lastActive: Date): 'active' | 'idle' | 'offline' => {
    const now = new Date();
    const diff = now.getTime() - lastActive.getTime();
    if (diff < 2 * 60 * 1000) return 'active';
    if (diff < 5 * 60 * 1000) return 'idle';
    return 'offline';
  };

  const getStatusColor = (status: 'active' | 'idle' | 'offline') => {
    switch (status) {
      case 'active': return 'green';
      case 'idle': return 'yellow';
      case 'offline': return 'red';
    }
  };

  const handleDisconnectUser = (address: string) => {
    removeConnectedUser(address);
    toast({
      title: 'User Disconnected',
      description: `Disconnected user: ${address}`,
      status: 'info',
      duration: 3000,
    });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (publicKey) {
        console.log('Fetching data for connected users:', connectedUsers); // Debug log
        const userDataPromises = connectedUsers.map(fetchUserBalances);
        const userData = await Promise.all(userDataPromises);
        console.log('User data fetched:', userData); // Debug log
        setOnlineUsers(userData);
      }

      setRaffleTickets([]);
      setRemainingTickets(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error fetching data',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartRaffle = async () => {
    // TODO: Implement raffle start functionality via smart contract
  };

  const handleEndRaffle = async () => {
    // TODO: Implement raffle end functionality via smart contract
  };

  const handleDrawWinner = async () => {
    // TODO: Implement winner drawing functionality via smart contract
  };

  if (!publicKey || !isAdminWallet(publicKey.toString())) {
    return (
      <VStack p={4} spacing={4}>
        <Text color="red.500">Access Denied</Text>
        <Text>Please connect with an authorized admin wallet to access this panel.</Text>
      </VStack>
    );
  }

  return (
    <VStack p={4} spacing={6} align="stretch">
      <Text fontSize="2xl" color="matrix.500">Admin Panel</Text>
      
      <Tabs variant="enclosed" colorScheme="green">
        <TabList>
          <Tab>Online Users</Tab>
          <Tab>Raffle Management</Tab>
          <Tab>Contract Info</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box borderWidth="1px" borderColor="matrix.500" p={4} borderRadius="md">
              <HStack justify="space-between" mb={4}>
                <Text fontSize="lg">Online Users</Text>
                <HStack>
                  <IconButton
                    aria-label="Refresh"
                    icon={<FiRefreshCw />}
                    size="sm"
                    onClick={fetchData}
                    isLoading={loading}
                  />
                  <Badge colorScheme="green">
                    {onlineUsers.filter(u => u.status === 'active').length} Active
                  </Badge>
                  <Badge colorScheme="yellow">
                    {onlineUsers.filter(u => u.status === 'idle').length} Idle
                  </Badge>
                  <Badge colorScheme="red">
                    {onlineUsers.filter(u => u.status === 'offline').length} Offline
                  </Badge>
                </HStack>
              </HStack>

              {loading ? (
                <VStack py={8}>
                  <Spinner color="matrix.500" />
                  <Text>Loading online users...</Text>
                </VStack>
              ) : onlineUsers.length > 0 ? (
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th color="matrix.500">Address</Th>
                      <Th color="matrix.500">SOL Balance</Th>
                      <Th color="matrix.500">Status</Th>
                      <Th color="matrix.500">Last Active</Th>
                      <Th color="matrix.500">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {onlineUsers.map((user) => (
                      <Tr key={user.address}>
                        <Td>
                          <Tooltip label={user.address}>
                            <Text>{user.address.slice(0, 4)}...{user.address.slice(-4)}</Text>
                          </Tooltip>
                        </Td>
                        <Td>{user.solBalance.toFixed(4)} SOL</Td>
                        <Td>
                          <Badge colorScheme={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </Td>
                        <Td>
                          <Tooltip label={new Date(user.lastActive).toLocaleString()}>
                            <Text>{new Date(user.lastActive).toLocaleTimeString()}</Text>
                          </Tooltip>
                        </Td>
                        <Td>
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              aria-label='Options'
                              icon={<FiMoreVertical />}
                              variant="ghost"
                              size="sm"
                            />
                            <MenuList>
                              <MenuItem
                                icon={<FiUserX />}
                                onClick={() => handleDisconnectUser(user.address)}
                              >
                                Disconnect
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              ) : (
                <Text>No online users available</Text>
              )}
            </Box>
          </TabPanel>

          <TabPanel>
            <Box borderWidth="1px" borderColor="matrix.500" p={4} borderRadius="md">
              <Text fontSize="lg" mb={4}>Raffle Management</Text>
              {loading ? (
                <VStack py={8}>
                  <Spinner color="matrix.500" />
                  <Text>Loading raffle data...</Text>
                </VStack>
              ) : (
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text mb={2}>Remaining Tickets: {remainingTickets || 0}</Text>
                    <Progress value={(remainingTickets || 0) / 1000 * 100} colorScheme="green" />
                  </Box>
                  
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Address</Th>
                        <Th isNumeric>Tickets</Th>
                        <Th isNumeric>SOL Spent</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {raffleTickets.map((ticket) => (
                        <Tr key={ticket.address}>
                          <Td>{ticket.address}</Td>
                          <Td isNumeric>{ticket.tickets}</Td>
                          <Td isNumeric>{ticket.solSpent} SOL</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </VStack>
              )}
            </Box>
          </TabPanel>

          <TabPanel>
            <Box borderWidth="1px" borderColor="matrix.500" p={4} borderRadius="md">
              <Text fontSize="lg" mb={4}>Contract Information</Text>
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text fontWeight="bold">Contract Address</Text>
                  <Text fontFamily="monospace">
                    {import.meta.env.VITE_CONTRACT_ADDRESS || 'Not configured'}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Admin Addresses</Text>
                  <VStack align="stretch" spacing={2}>
                    {[
                      import.meta.env.VITE_ADMIN_WALLET_1,
                      import.meta.env.VITE_ADMIN_WALLET_2,
                      import.meta.env.VITE_ADMIN_WALLET_3
                    ].filter(Boolean).map((address, index) => (
                      <Text key={index} fontFamily="monospace">{address}</Text>
                    ))}
                  </VStack>
                </Box>
                <Box>
                  <Text fontWeight="bold">Network</Text>
                  <Text>{import.meta.env.VITE_NETWORK || 'mainnet-beta'}</Text>
                </Box>
              </VStack>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default AdminPanel;
