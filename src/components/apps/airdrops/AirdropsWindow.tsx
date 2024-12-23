import { VStack, Text, Table, Thead, Tbody, Tr, Th, Td, Badge, Box, Stat, StatLabel, StatNumber, StatGroup } from '@chakra-ui/react';
import { useState } from 'react';
import { useWallet } from '../../../contexts/WalletContext';

interface AirdropEntry {
  id: string;
  address: string;
  timestamp: string;
  amount: number;
}

const AirdropsWindow = () => {
  const { publicKey, isConnected } = useWallet();
  const [entries, setEntries] = useState<AirdropEntry[]>([]);

  return (
    <VStack spacing={6} p={4} color="matrix.500" align="stretch">
      <Text fontSize="2xl" fontWeight="bold">$AIS Airdrops</Text>

      {/* Summary Stats */}
      <StatGroup width="100%" bg="rgba(0, 255, 0, 0.1)" p={4} borderRadius="md">
        <Stat>
          <StatLabel>Next Airdrop</StatLabel>
          <StatNumber>TBA</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Last Airdrop</StatLabel>
          <StatNumber>TBA</StatNumber>
        </Stat>
      </StatGroup>

      {/* Airdrop Table */}
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th color="matrix.500">Date</Th>
            <Th color="matrix.500">Amount</Th>
            <Th color="matrix.500">Recipients</Th>
            <Th color="matrix.500">Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {entries.length > 0 ? (
            entries.map((entry) => (
              <Tr key={entry.id}>
                <Td>{entry.timestamp}</Td>
                <Td isNumeric>{entry.amount.toLocaleString()} $AIS</Td>
                <Td>{entry.address}</Td>
                <Td>Completed</Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={4} textAlign="center">No airdrop data available</Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      {/* Information Box */}
      <Box width="100%" bg="rgba(0, 255, 0, 0.1)" p={4} borderRadius="md">
        <Text fontWeight="bold" mb={2}>Airdrop Information</Text>
        <Text>• Airdrops are distributed to eligible wallets</Text>
        <Text>• Eligibility is based on $AIS holdings and activity</Text>
        <Text>• Distribution dates will be announced in advance</Text>
        <Text>• Connect your wallet to check eligibility</Text>
      </Box>
    </VStack>
  );
};

export default AirdropsWindow;
