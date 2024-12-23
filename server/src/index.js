import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import { cleanupOldSessions } from './utils/dataStore.js';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import { authenticateToken, validateChatInput } from './middleware/auth.js';
import { validateEnv } from './utils/envValidator.js';

// Load environment variables
dotenv.config();

// Validate environment variables
validateEnv();

// Connect to MongoDB
connectDB();

const app = express();
const port = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Apply rate limiting to all routes
app.use(limiter);

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({
  limit: '10kb' // Limit payload size
}));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Routes
app.use('/api/auth', authRoutes);

// Protected chat endpoint
app.post('/api/chat', authenticateToken, validateChatInput, async (req, res) => {
  try {
    const { messages } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: "You are SmithOS AI Assistant, a helpful and knowledgeable AI integrated into the SmithOS desktop environment. You specialize in blockchain, Solana, and general computing topics. Keep responses concise and focused."
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    res.json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Clean up old sessions every hour
setInterval(cleanupOldSessions, 60 * 60 * 1000);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`SmithOS Server running on port ${port}`);
});
