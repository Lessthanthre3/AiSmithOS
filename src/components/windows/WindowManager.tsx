import { Box } from '@chakra-ui/react';
import { useWindow } from '../../contexts/WindowContext';
import Window from './Window';

const WindowManager = () => {
  const { windows } = useWindow();

  return (
    <Box position="absolute" top={0} left={0} right={0} bottom={0}>
      {windows.map((window) => (
        !window.isMinimized && (
          <Window
            key={window.id}
            id={window.id}
            appId={window.id}
            title={window.title}
            position={window.position}
            size={window.size}
            zIndex={window.zIndex}
          >
            {window.component}
          </Window>
        )
      ))}
    </Box>
  );
};

export default WindowManager;
