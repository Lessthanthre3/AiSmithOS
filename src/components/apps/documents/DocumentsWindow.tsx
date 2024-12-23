import { VStack, Text, Box, HStack, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { useState } from 'react';
import { documentsData } from '../../../data/initialData';
import ReactMarkdown from 'react-markdown';

interface Document {
  id: number;
  title: string;
  content: string;
}

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
      
      {documentsData.map((doc) => (
        <Box
          key={doc.id}
          p={4}
          bg="rgba(0, 255, 0, 0.1)"
          borderRadius="md"
          cursor="pointer"
          _hover={{ bg: 'rgba(0, 255, 0, 0.2)' }}
          transition="all 0.2s"
          onClick={() => handleDocClick(doc)}
        >
          <HStack>
            <Text fontSize="lg">📄</Text>
            <Text>{doc.title}</Text>
          </HStack>
        </Box>
      ))}

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg="black" color="matrix.500" border="1px solid" borderColor="matrix.500">
          <ModalHeader>{selectedDoc?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box className="markdown-content">
              <ReactMarkdown>{selectedDoc?.content || ''}</ReactMarkdown>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default DocumentsWindow;
