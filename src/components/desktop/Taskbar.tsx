import { HStack, Text, Box, useDisclosure, Popover, PopoverTrigger, PopoverContent, VStack, Badge, Button, Divider, Tooltip, IconButton } from '@chakra-ui/react';
import { useEffect, useState, useMemo, memo } from 'react';
import { useWindow } from '../../contexts/WindowContext';
import { useWallet } from '../../contexts/WalletContext';
import apps from '../../config/apps';
import { FaWallet, FaTelegramPlane } from 'react-icons/fa';

// Memoize the wallet display to prevent unnecessary re-renders
const WalletDisplay = memo(({ balance, isConnected, publicKey, onClick }: {
  balance: number;
  isConnected: boolean;
  publicKey: any;
  onClick: () => void;
}) => (
  <Tooltip label={isConnected ? 'Open Wallet' : 'Connect Wallet'}>
    <HStack spacing={2}>
      <IconButton
        aria-label={isConnected ? 'Open Wallet' : 'Connect Wallet'}
        icon={<FaWallet />}
        onClick={onClick}
        variant="ghost"
        color={isConnected ? "green.300" : "gray.400"}
        _hover={{ bg: 'rgba(0, 255, 0, 0.1)' }}
      />
      {isConnected && publicKey && (
        <Text color="green.300" fontSize="sm">
          {balance.toFixed(4)} SOL
        </Text>
      )}
    </HStack>
  </Tooltip>
));

WalletDisplay.displayName = 'WalletDisplay';

const Taskbar = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const { isOpen, onToggle, onClose } = useDisclosure();
  
  const notifications = [
    { id: 1, text: 'New raffle starting soon!', isNew: true },
    { id: 3, text: 'System update completed', isNew: false },
  ];

  const { windows, minimizeWindow, maximizeWindow, toggleWindow, getWindowByAppId } = useWindow();
  const { isConnected, publicKey, balance, connect, disconnect } = useWallet();

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAppClick = (app: typeof apps[0]) => {
    const randomPosition = {
      x: Math.random() * (window.innerWidth - app.defaultSize.width),
      y: Math.random() * (window.innerHeight - app.defaultSize.height - 48)
    };

    toggleWindow(app.id, {
      title: app.name,
      component: <app.component />,
      position: randomPosition,
      size: app.defaultSize,
      isMinimized: false
    });
  };

  const handleWalletClick = () => {
    if (!isConnected) {
      connect();
    } else {
      handleAppClick({
        id: 'wallet',
        name: 'Wallet',
        icon: <FaWallet />,
        component: apps.find(app => app.id === 'wallet')?.component || (() => <div>Wallet</div>),
        defaultSize: { width: 400, height: 300 }
      });
    }
  };

  // Memoize filtered apps to prevent unnecessary recalculations
  const filteredApps = useMemo(() => 
    apps.filter(app => app.id !== 'wallet'),
    []
  );

  return (
    <HStack
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      height="48px"
      bg="black"
      borderTop="1px solid"
      borderColor="matrix.500"
      px={4}
      justify="space-between"
      spacing={4}
    >
      {/* Left section - App Icons */}
      <HStack spacing={1} overflow="hidden" flex={1}>
        {filteredApps.map((app) => {
          const isOpen = getWindowByAppId(app.id);
          const isMinimized = isOpen?.isMinimized;
          
          return (
            <Tooltip key={app.id} label={app.name} placement="top">
              <Button
                size="sm"
                variant="ghost"
                p={1}
                minW="auto"
                h="auto"
                onClick={() => handleAppClick(app)}
                position="relative"
                color={isOpen && !isMinimized ? "matrix.500" : "whiteAlpha.700"}
                _hover={{
                  color: "matrix.500",
                  bg: "whiteAlpha.100"
                }}
              >
                <Text fontSize="xl">{app.icon}</Text>
                {isOpen && !isMinimized && (
                  <Box
                    position="absolute"
                    bottom="0"
                    left="50%"
                    transform="translateX(-50%)"
                    w="4px"
                    h="4px"
                    borderRadius="full"
                    bg="matrix.500"
                  />
                )}
              </Button>
            </Tooltip>
          );
        })}
      </HStack>

      {/* Middle section - Active Windows */}
      <HStack spacing={2} flex={2} justify="center">
        {windows.map((window) => (
          <Button
            key={window.id}
            size="sm"
            variant="ghost"
            color="matrix.500"
            opacity={window.isMinimized ? 0.5 : 1}
            onClick={() => window.isMinimized ? maximizeWindow(window.id) : minimizeWindow(window.id)}
            _hover={{ bg: 'rgba(0, 255, 0, 0.1)' }}
          >
            {window.title}
          </Button>
        ))}
      </HStack>

      {/* Right section - System Icons */}
      <HStack spacing={4} flex={1} justify="flex-end">
        <Tooltip label="Join our Telegram">
          <IconButton
            aria-label="Telegram"
            icon={<FaTelegramPlane />}
            onClick={() => window.open('https://t.me/agentsmithai', '_blank')}
            variant="ghost"
            color="whiteAlpha.700"
            _hover={{ 
              color: "matrix.500",
              bg: 'rgba(0, 255, 0, 0.1)'
            }}
          />
        </Tooltip>

        <Popover isOpen={isOpen} onClose={onClose} placement="top-end">
          <PopoverTrigger>
            <Box position="relative" cursor="pointer" onClick={onToggle}>
              <Text fontSize="lg">🔔</Text>
              {notifications.some(n => n.isNew) && (
                <Badge
                  position="absolute"
                  top="-2px"
                  right="-2px"
                  bg="matrix.500"
                  borderRadius="full"
                  boxSize="2"
                />
              )}
            </Box>
          </PopoverTrigger>
          <PopoverContent bg="black" borderColor="matrix.500" p={2} maxW="300px">
            <VStack align="stretch" spacing={2}>
              {notifications.map(notification => (
                <Box
                  key={notification.id}
                  p={2}
                  bg={notification.isNew ? 'rgba(0, 255, 0, 0.1)' : 'transparent'}
                  borderRadius="md"
                >
                  <Text color="matrix.500" fontSize="sm">
                    {notification.text}
                    {notification.isNew && (
                      <Badge ml={2} colorScheme="green">New</Badge>
                    )}
                  </Text>
                </Box>
              ))}
            </VStack>
          </PopoverContent>
        </Popover>

        <WalletDisplay
          balance={balance}
          isConnected={isConnected}
          publicKey={publicKey}
          onClick={handleWalletClick}
        />

        <Text color="matrix.500" fontSize="sm">
          {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}
        </Text>
      </HStack>
    </HStack>
  );
};

export default Taskbar;
