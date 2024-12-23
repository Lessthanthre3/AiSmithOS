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

// Secure session configuration
const SESSION_OPTIONS = {
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 2 // 2 hours
  }
};

// Admin wallet addresses (should be stored in a secure database in production)
const ADMIN_WALLETS = new Set([
  process.env.ADMIN_WALLET_1,
  process.env.ADMIN_WALLET_2
]);

// JWT secret (should be a strong, unique value in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

interface AuthRequest extends Request {
  body: {
    password: string;
    signature: string;
    publicKey: string;
    timestamp: number;
  }
}

export const authenticateAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { password, signature, publicKey, timestamp } = req.body;

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

    // Verify password (in production, use proper password hashing like bcrypt)
    const hashedPassword = nacl.hash(Buffer.from(password));
    if (hashedPassword.toString('hex') !== process.env.ADMIN_PASSWORD_HASH) {
      return res.status(401).json({ error: 'Invalid credentials' });
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
export const verifyAdminToken = (req: Request, res: Response, next: Function) => {
  const token = req.cookies.admin_token;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
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
