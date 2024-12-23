import { VStack, Text, Box } from '@chakra-ui/react';
import { useState } from 'react';

interface DesktopIconProps {
  name: string;
  icon: string;
  description?: string;
  onClick: () => void;
}

const DesktopIcon = ({ name, icon, description, onClick }: DesktopIconProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <VStack
      spacing={0.5}
      p={1}
      cursor="pointer"
      borderRadius="md"
      transition="all 0.2s"
      _hover={{
        bg: 'rgba(0, 255, 0, 0.1)',
        transform: 'scale(1.05)',
      }}
      onClick={onClick}
      title={description}
      align="center"
      maxW="100%"
    >
      <Text fontSize="xl" mb={0.5}>{icon}</Text>
      <Text
        color="matrix.500"
        fontSize="xs"
        textAlign="center"
        noOfLines={2}
        wordBreak="break-word"
      >
        {name}
      </Text>
    </VStack>
  );
};

export default DesktopIcon;
