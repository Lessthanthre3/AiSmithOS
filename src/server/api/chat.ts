import { Request, Response } from 'express';
import OpenAI from 'openai';
import rateLimit from 'express-rate-limit';

// Rate limiting middleware
export const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests from this IP, please try again later'
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest extends Request {
  body: {
    messages: ChatMessage[];
    userMessage: string;
    wallet: string;
  }
}

// System prompt that defines the AI's personality and capabilities
const SYSTEM_PROMPT = `You are an AI assistant in the SmithOS virtual operating system, designed with a Matrix-inspired theme. 
Your responses should be helpful and accurate while maintaining a cyberpunk aesthetic.

Key characteristics:
- Knowledgeable about cryptocurrency, blockchain, and Web3
- Familiar with SmithOS features and capabilities
- Professional but with subtle Matrix-themed references
- Security-conscious and privacy-aware
- Helpful in guiding users through technical concepts

Please maintain this persona throughout the conversation.`;

export const handleChat = async (req: ChatRequest, res: Response) => {
  try {
    const { messages, userMessage, wallet } = req.body;

    // Validate input
    if (!userMessage || typeof userMessage !== 'string') {
      return res.status(400).json({ error: 'Invalid message format' });
    }

    // Prepare conversation history
    const conversationHistory: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.slice(-10), // Keep last 10 messages for context
    ];

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: conversationHistory,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiResponse = completion.choices[0].message;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Log the interaction (in production, you'd want to store this in a database)
    console.log('Chat interaction:', {
      timestamp: new Date().toISOString(),
      wallet: wallet || 'anonymous',
      userMessage,
      aiResponse,
    });

    return res.json({ response: aiResponse });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Failed to process chat request' });
  }
};
