import { Box, HStack, IconButton, Text, useToast } from '@chakra-ui/react';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
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
  const [localPosition, setLocalPosition] = useState(position);
  const [localSize, setLocalSize] = useState(size);

  // Throttle position updates
  useEffect(() => {
    if (!isDragging) {
      updateWindowPosition(id, localPosition);
    }
  }, [localPosition, isDragging, id, updateWindowPosition]);

  // Throttle size updates
  useEffect(() => {
    if (!isResizing) {
      updateWindowSize(id, localSize);
    }
  }, [localSize, isResizing, id, updateWindowSize]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && windowRef.current) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      setLocalPosition({ x: newX, y: newY });
    } else if (isResizing && windowRef.current) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      const newWidth = Math.max(300, resizeStart.width + deltaX);
      const newHeight = Math.max(400, resizeStart.height + deltaY);
      setLocalSize({ width: newWidth, height: newHeight });
    }
  }, [isDragging, isResizing, dragOffset, resizeStart]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      updateWindowPosition(id, localPosition);
    }
    if (isResizing) {
      updateWindowSize(id, localSize);
    }
    setIsDragging(false);
    setIsResizing(false);
  }, [isDragging, isResizing, id, localPosition, localSize, updateWindowPosition, updateWindowSize]);

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  }, []);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
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
  }, []);

  const isAdminWallet = useCallback((address: string | null) => {
    return address && ADMIN_WALLETS.includes(address);
  }, []);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    removeWindow(id);
  }, [isClosing, id, removeWindow]);

  const handleMinimize = useCallback(() => {
    minimizeWindow(id);
  }, [id, minimizeWindow]);

  // Memoize window styles
  const windowStyle = useMemo(() => ({
    position: 'absolute' as const,
    left: `${localPosition.x}px`,
    top: `${localPosition.y}px`,
    width: `${localSize.width}px`,
    height: `${localSize.height}px`,
    zIndex,
    bg: 'black',
    border: '1px solid',
    borderColor: 'matrix.500',
    borderRadius: 'md',
    overflow: 'hidden',
    transition: 'none',
  }), [localPosition.x, localPosition.y, localSize.width, localSize.height, zIndex]);

  // Check if the window should be accessible - only on mount
  useEffect(() => {
    if (appId === 'raffle' && !isAdminWallet(publicKey?.toString() || null)) {
      toast({
        title: 'Access Denied',
        description: 'Only admin wallets can access this feature.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      removeWindow(id);
    }
  }, [appId, publicKey, isAdminWallet, toast, removeWindow, id]);

  return (
    <Box ref={windowRef} {...windowStyle}>
      <HStack
        p={2}
        bg="black"
        borderBottom="1px solid"
        borderColor="matrix.500"
        onMouseDown={handleMouseDown}
        cursor="move"
        userSelect="none"
      >
        <Text flex="1" color="matrix.500">{title}</Text>
        <IconButton
          aria-label="Minimize"
          icon={<FaWindowMinimize />}
          size="sm"
          variant="ghost"
          color="matrix.500"
          onClick={handleMinimize}
        />
        <IconButton
          aria-label="Close"
          icon={<FaTimes />}
          size="sm"
          variant="ghost"
          color="matrix.500"
          onClick={handleClose}
        />
      </HStack>

      <Box p={4} height="calc(100% - 45px)" overflow="auto">
        {children}
      </Box>

      <Box
        position="absolute"
        bottom={0}
        right={0}
        width="15px"
        height="15px"
        cursor="nwse-resize"
        onMouseDown={handleResizeStart}
      />
    </Box>
  );
};

export default Window;
