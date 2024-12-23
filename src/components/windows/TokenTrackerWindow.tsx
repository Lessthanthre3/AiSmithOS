import React from 'react';
import TokenTracker from '../apps/TokenTracker';
import { Box } from '@chakra-ui/react';

const TokenTrackerWindow: React.FC = () => {
  return (
    <Box width="100%" height="100%" overflow="auto">
      <TokenTracker />
    </Box>
  );
};

export default TokenTrackerWindow;
