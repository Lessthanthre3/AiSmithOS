import jwt from 'jsonwebtoken';
import Session from '../models/Session.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if session exists
    const session = await Session.findOne({ token });
    if (!session) {
      return res.status(401).json({ error: 'Session expired' });
    }

    // Update session activity
    session.lastActivity = new Date();
    await session.save();

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(403).json({ error: 'Invalid token' });
  }
};
