import { WalletError } from '@solana/wallet-adapter-base';

export enum SolanaErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TRANSACTION_ERROR = 'TRANSACTION_ERROR',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  WALLET_ERROR = 'WALLET_ERROR',
  RPC_ERROR = 'RPC_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR'
}

export interface SolanaErrorDetails {
  code: SolanaErrorCode;
  message: string;
  originalError?: any;
}

export class SolanaError extends Error {
  public code: SolanaErrorCode;
  public details?: any;

  constructor(details: SolanaErrorDetails) {
    super(details.message);
    this.name = 'SolanaError';
    this.code = details.code;
    this.details = details.originalError;
  }
}

export const handleSolanaError = (error: any): SolanaErrorDetails => {
  // Network connection errors
  if (error.message?.includes('Failed to fetch') || error.message?.includes('Network Error')) {
    return {
      code: SolanaErrorCode.NETWORK_ERROR,
      message: 'Unable to connect to Solana network. Please check your internet connection.',
      originalError: error
    };
  }

  // RPC errors
  if (error.message?.includes('Rate limit exceeded') || error.message?.includes('429')) {
    return {
      code: SolanaErrorCode.RPC_ERROR,
      message: 'Too many requests to Solana network. Please try again later.',
      originalError: error
    };
  }

  // Transaction errors
  if (error.message?.includes('Transaction failed') || error.message?.includes('0x1')) {
    return {
      code: SolanaErrorCode.TRANSACTION_ERROR,
      message: 'Transaction failed. Please try again.',
      originalError: error
    };
  }

  // Insufficient funds
  if (error.message?.includes('insufficient funds') || error.message?.includes('0x1')) {
    return {
      code: SolanaErrorCode.INSUFFICIENT_FUNDS,
      message: 'Insufficient funds for transaction.',
      originalError: error
    };
  }

  // Wallet errors
  if (error instanceof WalletError || error.name === 'WalletError') {
    return {
      code: SolanaErrorCode.WALLET_ERROR,
      message: 'Wallet error: ' + error.message,
      originalError: error
    };
  }

  // Timeout errors
  if (error.message?.includes('timeout') || error.code === 'ETIMEDOUT') {
    return {
      code: SolanaErrorCode.TIMEOUT_ERROR,
      message: 'Operation timed out. Please try again.',
      originalError: error
    };
  }

  // Default error
  return {
    code: SolanaErrorCode.TRANSACTION_ERROR,
    message: 'An unexpected error occurred. Please try again.',
    originalError: error
  };
};
