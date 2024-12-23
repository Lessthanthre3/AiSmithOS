import { VStack, Text, Box, Button, Divider, List, ListItem, ListIcon } from '@chakra-ui/react';
import { CheckCircleIcon, InfoIcon } from '@chakra-ui/icons';

interface LearningMaterialProps {
  content: {
    title: string;
    introduction: string;
    keyPoints: string[];
    examples: Array<{
      title: string;
      description: string;
    }>;
    summary: string;
  };
  onStartQuiz: () => void;
}

const LearningMaterial = ({ content, onStartQuiz }: LearningMaterialProps) => {
  return (
    <VStack spacing={6} align="stretch" p={4}>
      <Box bg="rgba(0, 255, 0, 0.1)" p={6} borderRadius="md">
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          {content.title}
        </Text>
        <Text mb={4}>{content.introduction}</Text>
        
        <Divider my={4} borderColor="matrix.500" opacity={0.3} />
        
        <Text fontSize="lg" fontWeight="bold" mb={3}>
          Key Points
        </Text>
        <List spacing={3} mb={6}>
          {content.keyPoints.map((point, index) => (
            <ListItem key={index} display="flex" alignItems="center">
              <ListIcon as={CheckCircleIcon} color="matrix.500" />
              <Text>{point}</Text>
            </ListItem>
          ))}
        </List>
        
        <Text fontSize="lg" fontWeight="bold" mb={3}>
          Examples
        </Text>
        {content.examples.map((example, index) => (
          <Box key={index} mb={4} bg="rgba(0, 255, 0, 0.05)" p={4} borderRadius="md">
            <Text fontWeight="bold" mb={2}>
              {example.title}
            </Text>
            <Text>{example.description}</Text>
          </Box>
        ))}
        
        <Divider my={4} borderColor="matrix.500" opacity={0.3} />
        
        <Box bg="rgba(0, 255, 0, 0.05)" p={4} borderRadius="md" mb={6}>
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Summary
          </Text>
          <Text>{content.summary}</Text>
        </Box>
        
        <Box bg="rgba(0, 0, 0, 0.2)" p={4} borderRadius="md" mb={4}>
          <Text fontSize="sm" display="flex" alignItems="center">
            <InfoIcon mr={2} />
            Pro Tip: Review the key points and examples before taking the quiz!
          </Text>
        </Box>
        
        <Button
          onClick={onStartQuiz}
          variant="matrix"
          size="lg"
          width="100%"
        >
          Start Quiz
        </Button>
      </Box>
    </VStack>
  );
};

export default LearningMaterial;
