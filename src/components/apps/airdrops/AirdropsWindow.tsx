import { VStack, Text, Box, Icon, Button } from '@chakra-ui/react';
import { FaGift } from 'react-icons/fa';

const AirdropsWindow = () => {
  return (
    <VStack
      spacing={6}
      p={6}
      h="100%"
      color="matrix.500"
      align="center"
      justify="center"
    >
      <Icon as={FaGift} boxSize={12} />
      <Text fontSize="2xl" fontWeight="bold">$AIS Airdrops</Text>
      
      <Box
        p={6}
        borderRadius="md"
        bg="rgba(0, 255, 0, 0.1)"
        border="1px solid"
        borderColor="matrix.500"
        textAlign="center"
        w="100%"
        maxW="500px"
      >
        <Text mb={4}>
          No active airdrops at the moment.
        </Text>
        <Text fontSize="sm" opacity={0.8}>
          Future airdrops will be tracked and displayed here through our upcoming airdrop tracking system.
        </Text>
      </Box>

      <Button
        variant="outline"
        colorScheme="green"
        size="sm"
        opacity={0.6}
        cursor="not-allowed"
        _hover={{ opacity: 0.6 }}
      >
        Coming Soon
      </Button>
    </VStack>
  );
};

export default AirdropsWindow;
