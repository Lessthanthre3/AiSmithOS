import { VStack, Text, Box, HStack } from '@chakra-ui/react';

interface Document {
  title: string;
  content: string;
}

const documents: Document[] = [
  {
    title: 'How to Install Phantom',
    content: 'Step-by-step guide for installing Phantom wallet...'
  },
  {
    title: 'How to buy $AIS',
    content: 'Guide for purchasing $AIS tokens...'
  },
  {
    title: 'Whitepaper',
    content: 'SmithOS Whitepaper...'
  }
];

const DocumentsWindow = () => {
  return (
    <VStack spacing={4} p={4} color="matrix.500" align="stretch">
      <Text fontSize="2xl" fontWeight="bold">Documents</Text>
      
      {documents.map((doc, index) => (
        <Box
          key={index}
          p={4}
          bg="rgba(0, 255, 0, 0.1)"
          borderRadius="md"
          cursor="pointer"
          _hover={{ bg: 'rgba(0, 255, 0, 0.2)' }}
          transition="all 0.2s"
        >
          <HStack>
            <Text fontSize="lg">📄</Text>
            <Text>{doc.title}</Text>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
};

export default DocumentsWindow;
