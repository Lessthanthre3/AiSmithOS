import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Session from '../models/Session.js';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });
};

// Verify wallet signature and authenticate user
export const authenticateWallet = async (req, res) => {
  try {
    const { walletAddress, signature } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    // Find or create user
    let user = await User.findOne({ walletAddress });
    if (!user) {
      user = await User.create({
        walletAddress,
        isAdmin: false // Set admin status based on your requirements
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Create session
    await Session.create({
      userId: user._id,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip
    });

    res.json({
      token,
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      await Session.deleteOne({ token });
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-__v');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
};
