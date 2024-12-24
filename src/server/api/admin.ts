import { Request, Response } from 'express';
import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

// Rate limiting middleware
export const adminAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many authentication attempts, please try again later'
});

interface AuthenticatedRequest extends Request {
  user?: {
    publicKey: string;
    role: string;
  };
}

// Admin wallet addresses from environment variables
const ADMIN_WALLETS = new Set([
  process.env.VITE_ADMIN_WALLET_1, // Dev Wallet
  process.env.VITE_ADMIN_WALLET_2, // Treasury Wallet
  process.env.VITE_ADMIN_WALLET_3  // Raffle Wallet
]);

// JWT secret (should be a strong, unique value in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

interface AuthRequest extends Request {
  body: {
    signature: string;
    publicKey: string;
    timestamp: number;
  }
}

// Admin authentication
export const authenticateAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { signature, publicKey, timestamp } = req.body;

    // Verify timestamp to prevent replay attacks
    const now = Date.now();
    if (Math.abs(now - timestamp) > 30000) { // 30 seconds window
      return res.status(401).json({ error: 'Invalid timestamp' });
    }

    // Verify wallet ownership
    if (!ADMIN_WALLETS.has(publicKey)) {
      return res.status(401).json({ error: 'Unauthorized wallet' });
    }

    // Verify signature
    const message = `Admin authentication request at ${timestamp}`;
    const isValidSignature = nacl.sign.detached.verify(
      Buffer.from(message),
      Buffer.from(signature, 'base64'),
      new PublicKey(publicKey).toBytes()
    );

    if (!isValidSignature) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        publicKey,
        role: 'admin',
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 2) // 2 hours
      },
      JWT_SECRET
    );

    // Set secure cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 2 // 2 hours
    });

    return res.json({ success: true });
  } catch (error) {
    console.error('Admin authentication error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Middleware to verify admin JWT token
export const verifyAdminToken = (req: AuthenticatedRequest, res: Response, next: Function) => {
  const token = req.cookies.admin_token;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { publicKey: string; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Admin logout
export const logoutAdmin = (req: Request, res: Response) => {
  res.clearCookie('admin_token');
  return res.json({ success: true });
};

// Get admin statistics
export const getAdminStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !ADMIN_WALLETS.has(req.user.publicKey)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // TODO: Implement actual statistics gathering
    const stats = {
      totalUsers: 1234,
      activeUsers: 567,
      totalTransactions: 89012
    };

    return res.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Emergency stop
export const emergencyStop = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !ADMIN_WALLETS.has(req.user.publicKey)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // TODO: Implement emergency stop functionality
    // This could include:
    // - Pausing all transactions
    // - Stopping certain smart contracts
    // - Logging the emergency action
    
    return res.json({ success: true });
  } catch (error) {
    console.error('Error executing emergency stop:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
