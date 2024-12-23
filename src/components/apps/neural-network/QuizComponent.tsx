import { useState } from 'react';
import {
  VStack,
  Box,
  Text,
  Button,
  RadioGroup,
  Radio,
  Progress,
  Alert,
  AlertIcon,
  HStack,
  useToast,
} from '@chakra-ui/react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizProps {
  questions: Question[];
  onComplete: (score: number) => void;
  moduleId: string;
}

const QuizComponent = ({ questions, onComplete, moduleId }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const toast = useToast();

  const handleAnswer = () => {
    const isCorrect = parseInt(selectedAnswer) === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: 'Correct!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
    
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    setSelectedAnswer('');
    setShowExplanation(false);
    
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsCompleted(true);
      const finalScore = ((score + (parseInt(selectedAnswer) === questions[currentQuestion].correctAnswer ? 1 : 0)) / questions.length) * 100;
      onComplete(finalScore);
    }
  };

  if (isCompleted) {
    return (
      <Box p={6} bg="rgba(0, 255, 0, 0.1)" borderRadius="md">
        <Text fontSize="xl" mb={4}>Quiz Completed! 🎉</Text>
        <Text>Your score: {score} out of {questions.length}</Text>
        <Progress
          value={(score / questions.length) * 100}
          colorScheme="green"
          size="lg"
          mt={4}
        />
        <Text mt={4} fontSize="sm" color="matrix.500">
          {score === questions.length 
            ? "Perfect score! You've mastered this module!" 
            : "Review the material and try again to improve your score!"}
        </Text>
      </Box>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Text fontSize="sm" mb={2}>Question {currentQuestion + 1} of {questions.length}</Text>
        <Progress value={(currentQuestion / questions.length) * 100} size="sm" colorScheme="green" />
      </Box>

      <Box p={6} bg="rgba(0, 255, 0, 0.1)" borderRadius="md">
        <Text fontSize="lg" mb={4}>{questions[currentQuestion].question}</Text>

        <RadioGroup onChange={setSelectedAnswer} value={selectedAnswer}>
          <VStack align="stretch" spacing={3}>
            {questions[currentQuestion].options.map((option, index) => (
              <Radio
                key={index}
                value={index.toString()}
                isDisabled={showExplanation}
                colorScheme="green"
              >
                {option}
              </Radio>
            ))}
          </VStack>
        </RadioGroup>

        {showExplanation && (
          <Alert status={parseInt(selectedAnswer) === questions[currentQuestion].correctAnswer ? 'success' : 'error'} mt={4}>
            <AlertIcon />
            {questions[currentQuestion].explanation}
          </Alert>
        )}
      </Box>

      <HStack justify="flex-end" spacing={4}>
        {!showExplanation ? (
          <Button
            onClick={handleAnswer}
            isDisabled={!selectedAnswer}
            variant="matrix"
          >
            Check Answer
          </Button>
        ) : (
          <Button
            onClick={nextQuestion}
            variant="matrix"
          >
            {currentQuestion + 1 === questions.length ? 'Complete Quiz' : 'Next Question'}
          </Button>
        )}
      </HStack>
    </VStack>
  );
};

export default QuizComponent;
