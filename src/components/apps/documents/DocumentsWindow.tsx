import { VStack, Text, Box, HStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, Tooltip } from '@chakra-ui/react';
import { useState } from 'react';
import { WarningIcon } from '@chakra-ui/icons';

interface Document {
  title: string;
  content: string | JSX.Element;
  icon: string;
}

const TokenomicsContent = () => (
  <Box whiteSpace="pre-wrap">
    {`$AIS Token
Contract: ZNjDcVppJQV8Z9NECsuUhoM1VdJ3fvRtdFhDEaZpump

Supply:
Total Supply: 1,000,000,000 $AIS

Distribution:
• Treasury: 6.7%
• Dev: <3%
• Partner: 3.75%
• Unknown: 32.22% `}
    <Tooltip label="Snipers may hold a big supply, trade with caution" bg="orange.500" color="white">
      <WarningIcon color="orange.400" ml={1} mb={1} />
    </Tooltip>
    {`
• Tokens Burnt: 0%

Technical Details:
• Network: Solana
• Type: SPL Token
• Decimal: 9`}
  </Box>
);

const documents: Document[] = [
  {
    title: 'How to Install Phantom',
    content: `Getting Started with Phantom Wallet:

1. Visit phantom.app
   
2. Click "Add to Browser"
   
3. Follow installation steps
   
4. Create a new wallet or import existing

Note: 
Phantom is the recommended wallet for the best SmithOS experience.`,
    icon: '📱'
  },
  {
    title: 'How to buy $AIS',
    content: `Buying $AIS Token:

1. Connect Phantom wallet
   
2. Visit Jupiter Aggregator
   
3. Swap SOL for $AIS
   
4. Confirm transaction

Note:
Remember to always verify the token address before swapping.`,
    icon: '💰'
  },
  {
    title: 'Whitepaper',
    content: `SmithOS: The Next Generation Operating System

Vision:
Create a decentralized operating system that revolutionizes how we interact with blockchain technology.

Mission:
Our goal is to bridge the gap between traditional computing and blockchain, making decentralized applications accessible to everyone.

Technology:
SmithOS leverages cutting-edge blockchain technology to create a seamless, secure, and user-friendly experience.`,
    icon: '📄'
  },
  {
    title: 'Roadmap',
    content: `2024 - Q4:
• Launch $AIS token ✔ (Dec 11)
• Launch Website beta ✔ (Dec 12)
• Further develop website utility ⏳
• Audit and debug website ⏳

2025 - Q1:
Coming soon..`,
    icon: '🗺️'
  },
  {
    title: 'Tokenomics',
    content: <TokenomicsContent />,
    icon: '📊'
  }
];

const DocumentsWindow = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const handleDocClick = (doc: Document) => {
    setSelectedDoc(doc);
    onOpen();
  };

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
          onClick={() => handleDocClick(doc)}
        >
          <HStack>
            <Text fontSize="lg">{doc.icon}</Text>
            <Text>{doc.title}</Text>
          </HStack>
        </Box>
      ))}

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent bg="black" color="matrix.500" border="1px solid" borderColor="matrix.500">
          <ModalHeader>{selectedDoc?.icon} {selectedDoc?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box>
              {selectedDoc?.content}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default DocumentsWindow;
