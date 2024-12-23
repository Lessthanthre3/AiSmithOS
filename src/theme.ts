import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'black',
        color: 'green.500',
      },
    },
  },
  colors: {
    matrix: {
      50: '#e5ffe5',
      100: '#b3ffb3',
      200: '#80ff80',
      300: '#4dff4d',
      400: '#1aff1a',
      500: '#00ff00', // Matrix green
      600: '#00cc00',
      700: '#009900',
      800: '#006600',
      900: '#003300',
    },
  },
  components: {
    Button: {
      variants: {
        matrix: {
          bg: 'transparent',
          color: 'matrix.500',
          border: '1px solid',
          borderColor: 'matrix.500',
          _hover: {
            bg: 'rgba(0, 255, 0, 0.1)',
          },
          _active: {
            bg: 'rgba(0, 255, 0, 0.2)',
          },
        },
      },
    },
    Switch: {
      baseStyle: {
        track: {
          _checked: {
            bg: 'matrix.500',
          },
        },
      },
    },
    Window: {
      baseStyle: {
        bg: 'rgba(0, 0, 0, 0.8)',
        border: '1px solid',
        borderColor: 'matrix.500',
        borderRadius: 'md',
        boxShadow: '0 0 10px rgba(0, 255, 0, 0.3)',
      },
    },
  },
});

export default theme;
