import { useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  IconButton,
  Text,
  useToast,
  Spinner,
  Avatar,
  Divider,
} from '@chakra-ui/react';
import { FaPaperPlane } from 'react-icons/fa';
import { useWallet } from '../../../contexts/WalletContext';
import { generateChatResponse } from '../../../services/openai';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

const AGENT_SMITH_INTRO = `Hello. I am Agent Smith, an AI program designed to assist users within the SmithOS environment. How may I be of service today?`;

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: AGENT_SMITH_INTRO,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { publicKey } = useWallet();
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Filter out system messages for the API call
      const chatHistory = messages
        .filter(msg => msg.role !== 'system')
        .map(({ role, content }) => ({ role, content }));

      // Add the new user message
      chatHistory.push({ role: 'user', content: input });

      const response = await generateChatResponse(chatHistory);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || "I apologize, but I am currently experiencing a temporary neural network disruption. Please try again.",
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Error',
        description: 'Failed to get response from Agent Smith',
        status: 'error',
        duration: 5000,
      });

      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: 'My neural pathways have encountered an error. Please try again.',
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <VStack h="100%" spacing={4} p={4}>
      {/* Messages Container */}
      <Box
        flex={1}
        w="100%"
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0, 255, 0, 0.1)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0, 255, 0, 0.5)',
            borderRadius: '2px',
          },
        }}
      >
        <VStack spacing={4} align="stretch">
          {messages.map((message) => (
            <Box
              key={message.id}
              alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
              maxW="80%"
            >
              <HStack
                spacing={2}
                bg={
                  message.role === 'user'
                    ? 'rgba(0, 255, 0, 0.1)'
                    : 'rgba(0, 0, 0, 0.7)'
                }
                p={3}
                borderRadius="md"
                borderColor="matrix.500"
                borderWidth={1}
              >
                <Avatar
                  size="sm"
                  name={message.role === 'user' ? 'User' : 'Agent Smith'}
                  src={message.role === 'user' ? undefined : '/images/agent-smith.png'}
                  bg={message.role === 'user' ? 'matrix.500' : 'transparent'}
                />
                <VStack align="stretch" spacing={1}>
                  <Text
                    color="matrix.500"
                    fontSize="xs"
                    opacity={0.8}
                  >
                    {message.role === 'user' ? 'You' : 'Agent Smith'} • {formatTimestamp(message.timestamp)}
                  </Text>
                  <Text color="matrix.400" whiteSpace="pre-wrap">
                    {message.content}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      <Divider borderColor="matrix.500" opacity={0.3} />

      {/* Input Area */}
      <HStack w="100%" spacing={2}>
        <Input
          flex={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask Agent Smith..."
          variant="matrix"
          disabled={isLoading}
          _placeholder={{ color: 'matrix.400', opacity: 0.5 }}
        />
        <IconButton
          aria-label="Send message"
          icon={isLoading ? <Spinner size="sm" /> : <FaPaperPlane />}
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          variant="matrix"
          colorScheme="matrix"
        />
      </HStack>
    </VStack>
  );
};

export default ChatWindow;
