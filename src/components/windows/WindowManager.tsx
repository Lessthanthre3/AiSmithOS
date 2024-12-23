import React, { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import Window from './Window';
import { useWindow } from '../../contexts/WindowContext';

interface WindowProps {
  children: ReactNode;
  id: string;
  appId: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

const WindowManager: React.FC = () => {
  const { windows } = useWindow();

  return (
    <Box position="relative" width="100%" height="100%">
      {windows.map((window) => (
        <Window
          key={window.id}
          id={window.id}
          appId={window.appId}
          title={window.title}
          position={window.position}
          size={window.size}
          zIndex={window.zIndex}
        >
          {window.content}
        </Window>
      ))}
    </Box>
  );
};

export default WindowManager;
