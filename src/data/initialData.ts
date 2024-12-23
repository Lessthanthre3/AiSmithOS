export const documentsData = [
  {
    id: 1,
    title: 'How to Install Phantom',
    content: `
# Installing Phantom Wallet

1. Visit the Chrome Web Store
2. Search for "Phantom Wallet"
3. Click "Add to Chrome"
4. Follow the setup instructions
5. Create a new wallet or import existing
    `
  },
  {
    id: 2,
    title: 'How to buy $AIS',
    content: `
# Buying $AIS Tokens

1. Connect your Phantom Wallet
2. Ensure you have SOL in your wallet
3. Click the Trade button
4. Enter the amount of $AIS you want to buy
5. Confirm the transaction
    `
  },
  {
    id: 3,
    title: 'Whitepaper',
    content: `
# SmithOS Whitepaper

## Introduction
SmithOS is a revolutionary desktop environment built on the Solana blockchain...

## Features
- Neural Network Training
- Token Integration
- Decentralized Applications
- Secure Communications
    `
  }
];

export const systemData = {
  version: '1.0.0',
  networkStatus: 'online',
  lastUpdate: new Date().toISOString(),
  features: [
    'Neural Network',
    'Token Integration',
    'Chat System',
    'Document Management'
  ]
};

export const neuralNetworkData = {
  courses: [
    {
      id: 1,
      title: 'Introduction to SmithOS',
      description: 'Learn the basics of SmithOS',
      completed: false
    },
    {
      id: 2,
      title: 'Advanced Features',
      description: 'Explore advanced SmithOS capabilities',
      completed: false
    }
  ]
};

export const tokenData = {
  name: 'AIS',
  symbol: '$AIS',
  decimals: 9,
  totalSupply: '1000000000',
  circulatingSupply: '100000000'
};
