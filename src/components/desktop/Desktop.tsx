import { Box, IconButton, VStack, useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { FaChartLine } from 'react-icons/fa';
import MatrixRain from '../effects/MatrixRain';
import { useWindow } from '../../contexts/WindowContext';
import { useSystem } from '../../contexts/SystemContext';
import { useWallet } from '../../contexts/WalletContext';
import TokenTrackerWindow from '../windows/TokenTrackerWindow';
import { ADMIN_WALLETS } from '../../config/apps';

const Desktop = () => {
  const { addWindow } = useWindow();
  const { isMatrixEnabled } = useSystem();
  const { publicKey } = useWallet();
  const toast = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Handle escape key
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isAdminWallet = (address: string | null) => {
    return address && ADMIN_WALLETS.includes(address);
  };

  const launchTokenTracker = () => {
    addWindow({
      appId: 'token-tracker',
      title: '$AIS Token Tracker',
      component: <TokenTrackerWindow />,
      position: { x: 100, y: 100 },
      size: { width: 400, height: 500 },
      isMinimized: false,
    });
  };

  return (
    <Box
      position="relative"
      width="100vw"
      height="100vh"
      bg="black"
      overflow="hidden"
    >
      {/* Background Layer */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={0}
      >
        {isMatrixEnabled && (
          <MatrixRain
            config={{
              speed: 0.3,
              density: 0.985,
              fontSize: 16,
              glowStrength: 5
            }}
          />
        )}
      </Box>
      
      {/* Content Layer */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={1}
      >
        {/* Desktop Icons */}
        <VStack
          position="absolute"
          top={4}
          left={4}
          spacing={4}
          align="center"
        >
          <IconButton
            aria-label="Launch Token Tracker"
            icon={<FaChartLine />}
            onClick={launchTokenTracker}
            size="lg"
            variant="ghost"
            color="#00ff00"
            _hover={{ bg: 'rgba(0, 255, 0, 0.2)' }}
            _active={{ bg: 'rgba(0, 255, 0, 0.3)' }}
          />
        </VStack>
      </Box>
    </Box>
  );
};

export default Desktop;
