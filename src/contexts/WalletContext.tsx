import { createContext, useContext, useEffect, useState } from 'react';
import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useToast } from '@chakra-ui/react';
import { PhantomProvider } from '../types/phantom';
import { getCurrentEndpoint, getConnectionConfig } from '../config/rpc';

interface WalletContextType {
  publicKey: PublicKey | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnected: boolean;
  isConnecting: boolean;
  provider: PhantomProvider | null;
  balance: number;
  sendTransaction: (transaction: Transaction) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const getProvider = (): PhantomProvider | null => {
  if (typeof window !== 'undefined' && 'solana' in window) {
    const provider = (window as any).solana;
    if (provider.isPhantom) {
      return provider;
    }
  }
  window.open('https://phantom.app/', '_blank');
  return null;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState<PhantomProvider | null>(null);
  const [balance, setBalance] = useState(0);
  const toast = useToast();

  const updateBalance = async () => {
    if (!publicKey) return;

    try {
      const connection = new Connection(getCurrentEndpoint(), getConnectionConfig());
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error('Error fetching balance:', error);
      toast({
        title: 'Error fetching balance',
        description: 'Please try again later',
        status: 'error',
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    const provider = getProvider();
    setProvider(provider);

    provider?.on('connect', (publicKey: PublicKey) => {
      setPublicKey(publicKey);
      toast({
        title: 'Wallet connected',
        status: 'success',
        duration: 2000,
      });
    });

    provider?.on('disconnect', () => {
      setPublicKey(null);
      setBalance(0);
      toast({
        title: 'Wallet disconnected',
        status: 'info',
        duration: 2000,
      });
    });

    return () => {
      provider?.disconnect();
    };
  }, [toast]);

  useEffect(() => {
    if (publicKey) {
      updateBalance();
      const intervalId = setInterval(updateBalance, 30000);
      return () => clearInterval(intervalId);
    }
  }, [publicKey]);

  const connect = async () => {
    try {
      setIsConnecting(true);
      if (!provider) {
        throw new Error('No provider found');
      }
      await provider.connect();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: 'Connection Error',
        description: 'Could not connect to wallet',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      if (provider) {
        await provider.disconnect();
        setPublicKey(null);
        setBalance(0);
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const sendTransaction = async (transaction: Transaction): Promise<string> => {
    if (!provider || !publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      const { signature } = await provider.signAndSendTransaction(transaction);
      return signature;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  };

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
        sendTransaction,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
