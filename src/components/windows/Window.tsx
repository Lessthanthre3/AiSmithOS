import { Box, HStack, IconButton, Text, useToast } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { FaWindowMinimize, FaWindowMaximize, FaTimes } from 'react-icons/fa';
import { useWindow } from '../../contexts/WindowContext';
import { useWallet } from '../../contexts/WalletContext';
import { ADMIN_WALLETS } from '../../config/apps';

interface WindowProps {
  id: string;
  appId: string;
  title: string;
  children: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

const Window = ({ id, appId, title, children, position, size, zIndex }: WindowProps) => {
  const { removeWindow, minimizeWindow, updateWindowPosition, updateWindowSize } = useWindow();
  const { publicKey } = useWallet();
  const toast = useToast();
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && windowRef.current) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        updateWindowPosition(id, { x: newX, y: newY });
      } else if (isResizing && windowRef.current) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const newWidth = Math.max(300, resizeStart.width + deltaX); // Minimum width
        const newHeight = Math.max(400, resizeStart.height + deltaY); // Minimum height
        updateWindowSize(id, { width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart, id, updateWindowPosition, updateWindowSize]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (windowRef.current) {
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: windowRef.current.offsetWidth,
        height: windowRef.current.offsetHeight,
      });
      setIsResizing(true);
    }
  };

  const isAdminWallet = (address: string | null) => {
    return address && ADMIN_WALLETS.includes(address);
  };

  const handleClose = () => {
    if (isClosing) return; // Prevent multiple close attempts
    setIsClosing(true);
    removeWindow(id);
  };

  const handleMinimize = () => {
    minimizeWindow(id);
  };

  // Check if the window should be accessible - only on mount
  useEffect(() => {
    if (appId === 'raffle' && !isAdminWallet(publicKey?.toString() || null)) {
      toast({
        title: 'Access Denied',
        description: 'This application requires admin privileges.',
        status: 'error',
        duration: 5000,
      });
      handleClose();
    }
  }, []); // Empty dependency array - only run on mount

  return (
    <Box
      ref={windowRef}
      position="absolute"
      left={position.x}
      top={position.y}
      width={size.width}
      height={size.height}
      bg="rgba(0, 0, 0, 0.9)"
      borderRadius="md"
      border="1px solid rgba(0, 255, 0, 0.3)"
      boxShadow="0 0 10px rgba(0, 255, 0, 0.1)"
      zIndex={zIndex}
      overflow="hidden"
      transition="border-color 0.2s"
      _hover={{
        borderColor: 'rgba(0, 255, 0, 0.5)',
      }}
    >
      {/* Window Title Bar */}
      <HStack
        px={4}
        h={10}
        bg="rgba(0, 255, 0, 0.1)"
        borderBottom="1px solid rgba(0, 255, 0, 0.2)"
        onMouseDown={handleMouseDown}
        cursor="move"
        userSelect="none"
        justify="space-between"
      >
        <Text color="green.300" fontSize="sm" fontWeight="medium">
          {title}
        </Text>
        <HStack spacing={2}>
          <IconButton
            aria-label="Minimize"
            icon={<FaWindowMinimize />}
            size="xs"
            variant="ghost"
            color="green.300"
            onClick={handleMinimize}
          />
          <IconButton
            aria-label="Maximize"
            icon={<FaWindowMaximize />}
            size="xs"
            variant="ghost"
            color="green.300"
            onClick={() => {}}
          />
          <IconButton
            aria-label="Close"
            icon={<FaTimes />}
            size="xs"
            variant="ghost"
            color="green.300"
            onClick={handleClose}
          />
        </HStack>
      </HStack>

      {/* Window Content */}
      <Box p={4} height="calc(100% - 40px)" overflow="auto">
        {children}
      </Box>

      {/* Resize Handle */}
      <Box
        position="absolute"
        right={0}
        bottom={0}
        width="15px"
        height="15px"
        cursor="nwse-resize"
        onMouseDown={handleResizeStart}
        _before={{
          content: '""',
          position: 'absolute',
          right: '2px',
          bottom: '2px',
          width: '10px',
          height: '10px',
          borderRight: '2px solid',
          borderBottom: '2px solid',
          borderColor: 'green.400',
          opacity: 0.7,
        }}
      />
    </Box>
  );
};

export default Window;
