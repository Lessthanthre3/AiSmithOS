import { PublicKey, Transaction } from '@solana/web3.js';

export interface PhantomProvider {
  isPhantom?: boolean;
  publicKey: PublicKey | null;
  isConnected: boolean;
  signTransaction(transaction: Transaction): Promise<Transaction>;
  signAndSendTransaction(transaction: Transaction): Promise<{ signature: string }>;
  connect(): Promise<{ publicKey: PublicKey }>;
  disconnect(): Promise<void>;
  on(event: string, callback: (args: any) => void): void;
  off(event: string, callback: (args: any) => void): void;
}
