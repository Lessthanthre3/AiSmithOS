import { PublicKey } from '@solana/web3.js';
import DOMPurify from 'dompurify';

export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML allowed
    ALLOWED_ATTR: [] // No attributes allowed
  });
};

export const validatePublicKey = (publicKey: string): boolean => {
  try {
    new PublicKey(publicKey);
    return true;
  } catch {
    return false;
  }
};

export const validateTransaction = (transaction: any): boolean => {
  // Basic transaction validation
  if (!transaction || typeof transaction !== 'object') return false;
  
  // Check for required fields
  const requiredFields = ['feePayer', 'recentBlockhash', 'instructions'];
  return requiredFields.every(field => transaction.hasOwnProperty(field));
};

export const validateAmount = (amount: number): boolean => {
  return !isNaN(amount) && isFinite(amount) && amount > 0;
};

// Rate limiting for wallet operations
const operationTimestamps: { [key: string]: number[] } = {};
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_OPERATIONS = 10;

export const checkRateLimit = (operation: string): boolean => {
  const now = Date.now();
  const timestamps = operationTimestamps[operation] || [];
  
  // Remove timestamps outside the window
  const validTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW);
  operationTimestamps[operation] = validTimestamps;
  
  if (validTimestamps.length >= MAX_OPERATIONS) {
    return false;
  }
  
  operationTimestamps[operation] = [...validTimestamps, now];
  return true;
};

// Secure storage utilities
export const secureStorage = {
  set: (key: string, value: any) => {
    try {
      const serializedValue = JSON.stringify(value);
      sessionStorage.setItem(sanitizeInput(key), serializedValue);
    } catch (error) {
      console.error('Error storing data:', error);
    }
  },
  
  get: (key: string) => {
    try {
      const item = sessionStorage.getItem(sanitizeInput(key));
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  },
  
  remove: (key: string) => {
    try {
      sessionStorage.removeItem(sanitizeInput(key));
    } catch (error) {
      console.error('Error removing data:', error);
    }
  },
  
  clear: () => {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
};
