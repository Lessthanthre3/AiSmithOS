import { useState } from 'react';
import {
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Box,
} from '@chakra-ui/react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack height="100%" spacing={4}>
      <Box
        flex={1}
        width="100%"
        overflowY="auto"
        borderRadius="md"
        bg="rgba(0, 0, 0, 0.3)"
        p={2}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            bg={message.role === 'user' ? 'rgba(0, 255, 0, 0.1)' : 'transparent'}
            p={2}
            borderRadius="md"
            mb={2}
          >
            <Text color={message.role === 'user' ? 'matrix.400' : 'matrix.500'}>
              {message.role === 'user' ? 'You: ' : 'AI: '}
              {message.content}
            </Text>
          </Box>
        ))}
        {isLoading && (
          <Text color="matrix.400">AI is thinking...</Text>
        )}
      </Box>
      <HStack width="100%">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          bg="rgba(0, 0, 0, 0.3)"
          border="1px solid"
          borderColor="matrix.500"
          _focus={{
            borderColor: 'matrix.400',
            boxShadow: '0 0 0 1px var(--chakra-colors-matrix-400)',
          }}
        />
        <Button
          onClick={sendMessage}
          isLoading={isLoading}
          variant="matrix"
        >
          Send
        </Button>
      </HStack>
    </VStack>
  );
};

export default ChatWindow;
