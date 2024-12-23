import { Connection, Commitment } from '@solana/web3.js';

// List of reliable Solana mainnet RPC endpoints with weights
const RPC_ENDPOINTS = [
  {
    url: 'https://solana-mainnet.g.alchemy.com/v2/demo',
    weight: 3, // Higher weight = higher priority
  },
  {
    url: 'https://api.mainnet-beta.solana.com',
    weight: 2,
  },
  {
    url: 'https://rpc.ankr.com/solana',
    weight: 2,
  },
  {
    url: 'https://solana-api.projectserum.com',
    weight: 1,
  }
];

let currentEndpointIndex = 0;
let failureCount = 0;
const MAX_FAILURES = 2;
const CONNECTION_TIMEOUT = 5000; // 5 seconds

export const getCurrentEndpoint = () => RPC_ENDPOINTS[currentEndpointIndex].url;

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
    console.warn(`RPC endpoint ${endpoint} validation failed:`, error);
    return false;
  }
};

export const rotateEndpoint = async (): Promise<string> => {
  let attempts = RPC_ENDPOINTS.length;
  
  while (attempts > 0) {
    currentEndpointIndex = (currentEndpointIndex + 1) % RPC_ENDPOINTS.length;
    const endpoint = RPC_ENDPOINTS[currentEndpointIndex].url;
    
    // Validate the new endpoint before returning it
    if (await validateConnection(endpoint)) {
      console.log(`Switched to RPC endpoint: ${endpoint}`);
      return endpoint;
    }
    
    attempts--;
  }
  
  throw new Error('No valid RPC endpoints available');
};

export const handleRpcError = async (error: any) => {
  const isRateLimitError = error.message?.includes('403') || 
                          error.message?.includes('429') ||
                          error.message?.includes('exceeded') ||
                          error.message?.includes('too many requests');
                          
  const isTimeoutError = error.message?.includes('timeout') || 
                        error.message?.includes('timed out');
                        
  const isConnectionError = error.message?.includes('failed to fetch') ||
                           error.message?.includes('network error') ||
                           error.message?.includes('connection refused');

  if (isRateLimitError || isTimeoutError || isConnectionError) {
    failureCount++;
    if (failureCount >= MAX_FAILURES) {
      failureCount = 0;
      await rotateEndpoint();
    }
    
    // Add exponential backoff
    const backoffMs = Math.min(1000 * Math.pow(2, failureCount), 10000);
    await new Promise(resolve => setTimeout(resolve, backoffMs));
    return true; // Indicate retry is needed
  }
  
  return false; // Don't retry for other errors
};
