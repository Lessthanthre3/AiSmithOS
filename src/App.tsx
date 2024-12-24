import { ChakraProvider } from '@chakra-ui/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import MatrixRain from './components/effects/MatrixRain';
import Desktop from './components/desktop/Desktop';
import Taskbar from './components/desktop/Taskbar';
import WindowManager from './components/windows/WindowManager';
import { WalletProvider } from './contexts/WalletContext';
import { WindowProvider } from './contexts/WindowContext';
import { SystemProvider } from './contexts/SystemContext';
import { SessionProvider } from './contexts/SessionContext';
import theme from './theme';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <ChakraProvider theme={theme}>
        <SystemProvider>
          <WalletProvider>
            <WindowProvider>
              <SessionProvider>
                <div className="app-container">
                  <div className="matrix-background">
                    <MatrixRain />
                  </div>
                  <div className="app-content">
                    <div className="desktop-area">
                      <Desktop />
                      <WindowManager />
                    </div>
                    <div className="taskbar">
                      <Taskbar />
                    </div>
                  </div>
                </div>
              </SessionProvider>
            </WindowProvider>
          </WalletProvider>
        </SystemProvider>
      </ChakraProvider>
    </DndProvider>
  );
}

export default App;
