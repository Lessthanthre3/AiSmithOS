import { VStack, Text, Box, Heading, UnorderedList, ListItem, Divider, Button, Link } from '@chakra-ui/react';

const REFERRAL_URL = "https://bcgosh.com/i-lad0y2qp-n/";

const GambaWindow = () => {
  return (
    <VStack spacing={6} p={6} color="matrix.500" align="stretch">
      <Heading as="h1" size="xl" mb={4}>Gamba Protocol Integration</Heading>

      <Box bg="rgba(0, 255, 0, 0.1)" p={4} borderRadius="md">
        <Text fontSize="lg" fontWeight="bold" mb={2}>🎰 What is Gamba?</Text>
        <Text>
          Through partnership and referall systems, SmithOS users can help generate revenue for the $AIS ecosystem by meeting wagering requirements on any casino we add to our list.
        </Text>
      </Box>

      <Box bg="rgba(0, 255, 0, 0.1)" p={4} borderRadius="md">
        <Text fontSize="lg" fontWeight="bold" mb={2}>💰 Revenue Generation</Text>
        <UnorderedList spacing={2}>
          <ListItem>70% of all gambling profits using our referral code goes to the $AIS treasury</ListItem>
          <ListItem>30% is used for buy back & burns</ListItem>
        </UnorderedList>
      </Box>

      <Divider borderColor="matrix.500" opacity={0.3} />

      <Box bg="rgba(0, 255, 0, 0.1)" p={4} borderRadius="md">
        <Text fontSize="lg" fontWeight="bold" mb={2}>🎲 How to Participate</Text>
        <UnorderedList spacing={2}>
          <ListItem>Register to: {REFERRAL_URL}</ListItem>
          <ListItem>Start playing and earning rewards</ListItem>
        </UnorderedList>
        <Button
          as={Link}
          href={REFERRAL_URL}
          variant="matrix"
          size="sm"
          mt={4}
          isExternal
        >
          Click here to join
        </Button>
      </Box>

      <Box bg="rgba(0, 255, 0, 0.1)" p={4} borderRadius="md">
        <Text fontSize="lg" fontWeight="bold" mb={2}>⚠️ Responsible Gaming</Text>
        <Text>
          Please gamble responsibly. Never bet more than you can afford to lose. If you need help with gambling addiction, please seek professional assistance.
        </Text>
      </Box>
    </VStack>
  );
};

export default GambaWindow;
