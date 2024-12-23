import { PublicKey } from '@solana/web3.js';

interface Window {
  phantom?: PhantomProvider;
}

export interface PhantomProvider {
  isPhantom: boolean;
  publicKey: PublicKey | null;
  isConnected: boolean;
  connect: (params?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: any) => Promise<any>;
  signMessage: (message: Uint8Array, encoding?: string) => Promise<{ signature: Uint8Array }>;
  on: (event: string, callback: (args: any) => void) => void;
  removeAllListeners: () => void;
}
