import { Connection, Commitment } from '@solana/web3.js';

// Primary RPC endpoints
const RPC_ENDPOINTS = {
  HELIUS: 'https://mainnet.helius-rpc.com',
  GENESYSGO: 'https://ssc-dao.genesysgo.net',
  QUICKNODE: import.meta.env.VITE_QUICKNODE_URL,
} as const;

// API Keys
const HELIUS_KEYS = {
  PRIMARY: import.meta.env.VITE_HELIUS_API_KEY,
  SECONDARY: import.meta.env.VITE_HELIUS_API_KEY_2
} as const;

// Debug log for API keys
console.log('Loaded API Keys:', {
  PRIMARY: HELIUS_KEYS.PRIMARY ? 'Present' : 'Missing',
  SECONDARY: HELIUS_KEYS.SECONDARY ? 'Present' : 'Missing'
});

// Token IDs
export const TOKEN_IDS = {
  AIS: 'F9Lw3ki3hJ7PF9HQXsBzoY8GyE6sPoEZZdXJBsTTD2rk'
} as const;

// Get appropriate endpoint based on method
export const getRpcEndpoint = (method: string) => {
  // Use either key for getAsset
  const key = HELIUS_KEYS.PRIMARY || HELIUS_KEYS.SECONDARY;

  if (!key) {
    console.error('No Helius API key available');
    throw new Error('No API key available');
  }

  return `${RPC_ENDPOINTS.HELIUS}/?api-key=${key}`;
};

export const getCurrentEndpoint = () => getRpcEndpoint('getAsset');

export const getConnectionConfig = () => ({
  commitment: 'confirmed' as const,
  confirmTransactionInitialTimeout: 60000,
  disableRetryOnRateLimit: false,
  httpHeaders: {
    'Content-Type': 'application/json'
  }
});

// Helper function for making RPC requests to Helius
export const heliusRpcRequest = async (method: string, params: any) => {
  const endpoint = getRpcEndpoint(method);
  
  // Debug log
  console.log(`Making ${method} request to Helius`);
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'my-id',
      method,
      params
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message || 'RPC Error');
  }

  return data;
};

const CONNECTION_TIMEOUT = 5000; // 5 seconds

const validateConnection = async (endpoint: string): Promise<boolean> => {
  try {
    const connection = new Connection(endpoint, {
      commitment: 'confirmed' as Commitment,
      confirmTransactionInitialTimeout: CONNECTION_TIMEOUT
    });

    // Try to get a recent blockhash to verify connection
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout')), CONNECTION_TIMEOUT);
    });

    await Promise.race([
      connection.getLatestBlockhash(),
      timeoutPromise
    ]);

    return true;
  } catch (error) {
    console.error('RPC connection validation failed:', error);
    return false;
  }
};

export const handleRpcError = async (error: any): Promise<boolean> => {
  console.error('RPC Error:', error);
  // TODO: Implement RPC fallback logic
  return false;
};
