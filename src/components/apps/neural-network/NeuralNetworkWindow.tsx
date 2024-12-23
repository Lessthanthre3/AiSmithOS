import { VStack, HStack, Text, Box, Progress, Tab, Tabs, TabList, TabPanels, TabPanel, Badge, Button, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { courses } from './courses';
import LearningMaterial from './LearningMaterial';
import QuizComponent from './QuizComponent';

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

interface Example {
  title: string;
  description: string;
}

interface LearningMaterial {
  title: string;
  introduction: string;
  keyPoints: string[];
  examples: Example[];
  summary: string;
}

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  learningMaterial: LearningMaterial;
  quiz: Quiz[];
}

export interface Course {
  id: string;
  title: string;
  level: CourseLevel;
  progress: number;
  modules: Module[];
}

const NeuralNetworkWindow = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const { isOpen, onToggle } = useDisclosure();

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'green';
      case 'Intermediate': return 'yellow';
      case 'Advanced': return 'red';
      default: return 'gray';
    }
  };

  const handleQuizComplete = (score: number) => {
    if (selectedModule && selectedCourse) {
      const updatedCourse = { ...selectedCourse };
      const moduleIndex = updatedCourse.modules.findIndex(m => m.id === selectedModule.id);
      
      if (moduleIndex !== -1) {
        updatedCourse.modules[moduleIndex].completed = score >= 70;
        const completedModules = updatedCourse.modules.filter(m => m.completed).length;
        updatedCourse.progress = (completedModules / updatedCourse.modules.length) * 100;
        
        const courseIndex = courses.findIndex(c => c.id === selectedCourse.id);
        if (courseIndex !== -1) {
          courses[courseIndex] = updatedCourse;
        }
        
        setSelectedCourse(updatedCourse);
      }
    }
  };

  return (
    <VStack spacing={4} p={4} color="matrix.500" align="stretch" h="100%" overflowY="auto">
      <Text fontSize="2xl" fontWeight="bold">Neural Network Training</Text>

      <Tabs variant="matrix" colorScheme="green">
        <TabList mb={4}>
          <Tab>Courses</Tab>
          <Tab>Progress</Tab>
          <Tab>Achievements</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack spacing={4} align="stretch">
              {courses.map((course) => (
                <Box
                  key={course.id}
                  p={4}
                  bg="rgba(0, 255, 0, 0.1)"
                  borderRadius="md"
                  cursor="pointer"
                  onClick={() => {
                    setSelectedCourse(course);
                    setSelectedModule(null);
                    setShowQuiz(false);
                    onToggle();
                  }}
                  _hover={{ bg: 'rgba(0, 255, 0, 0.2)' }}
                >
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="lg" fontWeight="bold">{course.title}</Text>
                    <Badge colorScheme={getLevelColor(course.level)}>{course.level}</Badge>
                  </HStack>
                  <Progress
                    value={course.progress}
                    size="sm"
                    colorScheme="green"
                    bg="rgba(0, 0, 0, 0.3)"
                  />
                  <Text mt={2} fontSize="sm">Progress: {course.progress.toFixed(0)}%</Text>
                </Box>
              ))}
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={4} align="stretch">
              <Box bg="rgba(0, 255, 0, 0.1)" p={4} borderRadius="md">
                <Text fontSize="lg" fontWeight="bold" mb={2}>Overall Progress</Text>
                <Progress
                  value={
                    (courses.reduce((acc, course) => acc + course.progress, 0) / courses.length)
                  }
                  size="lg"
                  colorScheme="green"
                  bg="rgba(0, 0, 0, 0.3)"
                />
                <HStack justify="space-between" mt={2}>
                  <Text>Completed Courses: {courses.filter(c => c.progress === 100).length}/{courses.length}</Text>
                  <Text>Average Score: {(courses.reduce((acc, course) => acc + course.progress, 0) / courses.length).toFixed(0)}%</Text>
                </HStack>
              </Box>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={4} align="stretch">
              <Box bg="rgba(0, 255, 0, 0.1)" p={4} borderRadius="md">
                <Text fontSize="lg" fontWeight="bold" mb={4}>Achievements</Text>
                <HStack spacing={4} wrap="wrap">
                  {courses.filter(c => c.progress === 100).map((course) => (
                    <Badge key={course.id} colorScheme={getLevelColor(course.level)} p={2}>
                      🎓 {course.title} Master
                    </Badge>
                  ))}
                  {courses.some(c => c.progress > 0) && (
                    <Badge colorScheme="purple" p={2}>🚀 First Steps</Badge>
                  )}
                  {courses.filter(c => c.progress >= 50).length >= 3 && (
                    <Badge colorScheme="blue" p={2}>⭐ Rising Star</Badge>
                  )}
                </HStack>
              </Box>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {selectedCourse && !selectedModule && (
        <Box
          p={4}
          bg="rgba(0, 255, 0, 0.05)"
          borderRadius="md"
          border="1px solid"
          borderColor="matrix.500"
        >
          <HStack justify="space-between" mb={4}>
            <Text fontSize="xl" fontWeight="bold">{selectedCourse.title}</Text>
            <Button
              size="sm"
              variant="matrix"
              onClick={() => {
                setSelectedCourse(null);
                setSelectedModule(null);
                setShowQuiz(false);
              }}
            >
              Close
            </Button>
          </HStack>
          <VStack align="stretch" spacing={3}>
            {selectedCourse.modules.map((module) => (
              <Box
                key={module.id}
                p={3}
                bg={module.completed ? 'rgba(0, 255, 0, 0.2)' : 'rgba(0, 255, 0, 0.1)'}
                borderRadius="md"
                cursor="pointer"
                onClick={() => {
                  setSelectedModule(module);
                  setShowQuiz(false);
                }}
              >
                <HStack justify="space-between">
                  <Text>{module.title}</Text>
                  {module.completed && <Text>✓</Text>}
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>
      )}

      {selectedModule && (
        <Box
          p={4}
          bg="rgba(0, 255, 0, 0.05)"
          borderRadius="md"
          border="1px solid"
          borderColor="matrix.500"
        >
          <HStack justify="space-between" mb={4}>
            <Text fontSize="xl" fontWeight="bold">{selectedModule.title}</Text>
            <Button
              size="sm"
              variant="matrix"
              onClick={() => {
                setSelectedModule(null);
                setShowQuiz(false);
              }}
            >
              Back
            </Button>
          </HStack>

          {!showQuiz ? (
            <LearningMaterial
              content={selectedModule.learningMaterial}
              onStartQuiz={() => setShowQuiz(true)}
            />
          ) : (
            <QuizComponent
              questions={selectedModule.quiz}
              onComplete={handleQuizComplete}
              moduleId={selectedModule.id}
            />
          )}
        </Box>
      )}
    </VStack>
  );
};

export default NeuralNetworkWindow;
