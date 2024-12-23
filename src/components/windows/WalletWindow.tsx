import React from 'react';
import {
  VStack,
  HStack,
  Button,
  Text,
  Box,
  Input,
  FormControl,
  FormLabel,
  Spinner,
} from '@chakra-ui/react';
import { useWallet } from '../../contexts/WalletContext';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

const WalletWindow: React.FC = () => {
  const { publicKey, connect, disconnect, balance, isConnecting, connectionStatus, aisBalance } = useWallet();

  const isConnected = connectionStatus === 'connected';

  return (
    <VStack spacing={6} align="stretch">
      {isConnecting ? (
        <HStack spacing={2}>
          <Spinner size="sm" />
          <Text>Connecting...</Text>
        </HStack>
      ) : isConnected && publicKey ? (
        <>
          <Box
            p={4}
            borderRadius="md"
            bg="rgba(0, 0, 0, 0.3)"
            border="1px solid"
            borderColor="matrix.500"
          >
            <VStack align="stretch" spacing={2}>
              <Text fontSize="sm" color="matrix.400">Wallet Address</Text>
              <Text fontSize="xs" wordBreak="break-all">
                {publicKey?.toString()}
              </Text>
            </VStack>
          </Box>

          <Box
            p={4}
            borderRadius="md"
            bg="rgba(0, 0, 0, 0.3)"
            border="1px solid"
            borderColor="matrix.500"
          >
            <VStack align="stretch" spacing={4}>
              {/* SOL Balance */}
              <VStack align="stretch" spacing={2}>
                <Text fontSize="sm" color="matrix.400">SOL Balance</Text>
                <HStack justify="space-between">
                  <Text fontSize="xl" fontWeight="bold">
                    {(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL
                  </Text>
                  <Text fontSize="sm" color="matrix.400">
                    ≈ ${(balance / LAMPORTS_PER_SOL * 0).toFixed(2)} USD
                  </Text>
                </HStack>
              </VStack>

              {/* AIS Balance */}
              <VStack align="stretch" spacing={2}>
                <Text fontSize="sm" color="matrix.400">$AIS Balance</Text>
                <HStack justify="space-between">
                  <Text fontSize="xl" fontWeight="bold">
                    {aisBalance.toLocaleString()} $AIS
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </Box>

          <FormControl>
            <FormLabel fontSize="sm" color="matrix.400">Send SOL</FormLabel>
            <HStack>
              <Input
                placeholder="Recipient address"
                bg="rgba(0, 0, 0, 0.3)"
                border="1px solid"
                borderColor="matrix.500"
                _focus={{
                  borderColor: 'matrix.400',
                  boxShadow: '0 0 0 1px var(--chakra-colors-matrix-400)',
                }}
              />
              <Input
                placeholder="Amount"
                type="number"
                width="100px"
                bg="rgba(0, 0, 0, 0.3)"
                border="1px solid"
                borderColor="matrix.500"
                _focus={{
                  borderColor: 'matrix.400',
                  boxShadow: '0 0 0 1px var(--chakra-colors-matrix-400)',
                }}
              />
              <Button variant="matrix">Send</Button>
            </HStack>
          </FormControl>

          <Button
            onClick={disconnect}
            variant="outline"
            colorScheme="red"
            size="md"
          >
            Disconnect Wallet
          </Button>
        </>
      ) : (
        <Button
          onClick={connect}
          variant="matrix"
          size="lg"
          width="100%"
        >
          Connect Phantom Wallet
        </Button>
      )}
    </VStack>
  );
};

export default WalletWindow;
