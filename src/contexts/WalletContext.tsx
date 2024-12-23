import { createContext, useContext, useEffect, useState } from 'react';
import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useToast } from '@chakra-ui/react';
import { PhantomProvider } from '../types/phantom';
import { handleSolanaError, SolanaError } from '../utils/solanaErrors';
import { getCurrentEndpoint, handleRpcError } from '../config/rpc';

interface WalletContextType {
  publicKey: PublicKey | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnected: boolean;
  isConnecting: boolean;
  provider: PhantomProvider | null;
  balance: number;
  aisBalance: number;
  sendTransaction: (transaction: Transaction) => Promise<string>;
  connectionStatus: 'connected' | 'disconnected' | 'error';
  retryConnection: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const getProvider = (): PhantomProvider | null => {
  if ('solana' in window) {
    const provider = (window as any).solana;
    if (provider.isPhantom) {
      return provider;
    }
  }
  return null;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState<PhantomProvider | null>(null);
  const [balance, setBalance] = useState(0);
  const [aisBalance, setAisBalance] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  const toast = useToast();

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second

  const createConnection = async () => {
    try {
      const endpoint = getCurrentEndpoint();
      return new Connection(endpoint, {
        commitment: 'confirmed',
        confirmTransactionInitialTimeout: 60000, // 60 seconds
      });
    } catch (error) {
      const solanaError = handleSolanaError(error);
      throw new SolanaError(solanaError);
    }
  };

  const retryOperation = async <T,>(
    operation: () => Promise<T>,
    retries = MAX_RETRIES
  ): Promise<T> => {
    try {
      return await operation();
    } catch (error) {
      const shouldRetry = await handleRpcError(error);
      if (shouldRetry && retries > 0) {
        // Create new connection with potentially new endpoint
        await createConnection();
        return retryOperation(operation, retries - 1);
      }
      throw error;
    }
  };

  const updateBalance = async (walletPublicKey: PublicKey) => {
    if (!provider) return;
    
    try {
      const connection = await createConnection();
      const balance = await retryOperation(async () => 
        await connection.getBalance(walletPublicKey)
      );
      setBalance(balance / LAMPORTS_PER_SOL);
      setConnectionStatus('connected');
    } catch (error) {
      const solanaError = handleSolanaError(error);
      setConnectionStatus('error');
      toast({
        title: 'Balance Update Error',
        description: solanaError.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const connect = async () => {
    try {
      setIsConnecting(true);
      const provider = getProvider();
      if (!provider) {
        throw new Error('No provider found');
      }

      await retryOperation(async () => {
        await provider.connect();
        const response = await provider.connect();
        setPublicKey(new PublicKey(response.publicKey.toString()));
        setProvider(provider);
        setConnectionStatus('connected');
      });

    } catch (error) {
      const solanaError = handleSolanaError(error);
      setConnectionStatus('error');
      toast({
        title: 'Connection Error',
        description: solanaError.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      if (provider) {
        await provider.disconnect();
        setPublicKey(null);
        setProvider(null);
        setBalance(0);
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      const solanaError = handleSolanaError(error);
      toast({
        title: 'Disconnect Error',
        description: solanaError.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw error;
    }
  };

  const sendTransaction = async (transaction: Transaction): Promise<string> => {
    if (!provider || !publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      const connection = await createConnection();
      
      // Get recent blockhash
      const { blockhash } = await retryOperation(async () =>
        await connection.getLatestBlockhash()
      );
      
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign and send transaction
      const signed = await retryOperation(async () =>
        await provider.signTransaction(transaction)
      );
      
      const signature = await retryOperation(async () =>
        await connection.sendRawTransaction(signed.serialize())
      );

      // Wait for confirmation
      await retryOperation(async () =>
        await connection.confirmTransaction(signature)
      );

      return signature;
    } catch (error) {
      const solanaError = handleSolanaError(error);
      toast({
        title: 'Transaction Error',
        description: solanaError.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw error;
    }
  };

  const retryConnection = async () => {
    if (connectionStatus === 'error' && publicKey) {
      try {
        await connect();
      } catch (error) {
        const solanaError = handleSolanaError(error);
        toast({
          title: 'Retry Connection Error',
          description: solanaError.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  useEffect(() => {
    const provider = getProvider();
    if (provider) setProvider(provider);
  }, []);

  useEffect(() => {
    if (publicKey) {
      updateBalance(publicKey);
      const intervalId = setInterval(() => {
        updateBalance(publicKey);
      }, 30000); // Update every 30 seconds
      return () => clearInterval(intervalId);
    }
  }, [publicKey]);

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        connect,
        disconnect,
        isConnected: !!publicKey,
        isConnecting,
        provider,
        balance,
        aisBalance,
        sendTransaction,
        connectionStatus,
        retryConnection,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
