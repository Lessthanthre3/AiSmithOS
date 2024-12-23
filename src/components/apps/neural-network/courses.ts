export const courses = [
  {
    id: 'crypto-basics',
    title: 'Cryptocurrency Fundamentals',
    level: 'Beginner',
    progress: 0,
    modules: [
      {
        id: 'intro',
        title: 'Introduction to Cryptocurrency',
        description: 'Learn the basics of blockchain and cryptocurrency',
        completed: false,
        learningMaterial: {
          title: 'Understanding Cryptocurrency Basics',
          introduction: 'Cryptocurrency is a digital or virtual form of currency that uses cryptography for security. Unlike traditional currencies, cryptocurrencies are decentralized systems based on blockchain technology.',
          keyPoints: [
            'Cryptocurrencies are digital assets that can be used for transactions',
            'Blockchain is the underlying technology that powers cryptocurrencies',
            'Transactions are verified by network nodes through cryptography',
            'Most cryptocurrencies have a limited supply to maintain value'
          ],
          examples: [
            {
              title: 'Bitcoin: The First Cryptocurrency',
              description: 'Bitcoin was created in 2009 by Satoshi Nakamoto. It introduced the concept of a decentralized digital currency that operates without a central authority.'
            },
            {
              title: 'Blockchain Example',
              description: 'Think of blockchain as a digital ledger that records all transactions. Each block contains multiple transactions, and once verified, cannot be altered.'
            }
          ],
          summary: 'Cryptocurrencies represent a revolutionary approach to finance, offering secure, decentralized transactions without intermediaries. Understanding these basics is crucial for anyone looking to enter the crypto space.'
        },
        quiz: [
          {
            id: 'q1',
            question: 'What is the main technology behind cryptocurrencies?',
            options: ['Blockchain', 'SQL Database', 'Cloud Computing', 'Traditional Banking Systems'],
            correctAnswer: 0,
            explanation: 'Blockchain is the fundamental technology that enables cryptocurrencies to operate in a decentralized and secure manner.'
          },
          {
            id: 'q2',
            question: 'Which of these is a key feature of cryptocurrency?',
            options: ['Centralized Control', 'Limited Supply', 'Physical Coins', 'Government Backing'],
            correctAnswer: 1,
            explanation: 'Many cryptocurrencies have a limited supply to maintain value and prevent inflation, unlike traditional fiat currencies.'
          },
          {
            id: 'q3',
            question: 'Who created Bitcoin?',
            options: ['Vitalik Buterin', 'Satoshi Nakamoto', 'Charlie Lee', 'Mark Zuckerberg'],
            correctAnswer: 1,
            explanation: 'Satoshi Nakamoto is the pseudonymous creator of Bitcoin who published the Bitcoin whitepaper in 2008.'
          }
        ]
      },
      {
        id: 'wallets',
        title: 'Digital Wallets',
        description: 'How to set up and secure your crypto wallet',
        completed: false,
        learningMaterial: {
          title: 'Understanding Crypto Wallets',
          introduction: 'A cryptocurrency wallet is a digital tool that allows you to store, send, and receive cryptocurrencies. It\'s essential to understand how they work and how to keep them secure.',
          keyPoints: [
            'Wallets store your private keys, not actual coins',
            'Different types: Hot wallets (online) and Cold wallets (offline)',
            'Each wallet has a unique public address',
            'Security is crucial for protecting your assets'
          ],
          examples: [
            {
              title: 'Hot Wallet Example',
              description: 'MetaMask is a popular browser-based wallet that allows you to interact with Web3 applications and store Ethereum and other tokens.'
            },
            {
              title: 'Cold Storage',
              description: 'Ledger and Trezor are hardware wallets that store your private keys offline, providing maximum security for your cryptocurrencies.'
            }
          ],
          summary: 'Choosing and securing your crypto wallet is one of the most important decisions in your crypto journey. Understanding the different types and best practices for security is essential.'
        },
        quiz: [
          {
            id: 'w1',
            question: 'What do cryptocurrency wallets actually store?',
            options: ['Actual Coins', 'Private Keys', 'Blockchain', 'Bank Details'],
            correctAnswer: 1,
            explanation: 'Crypto wallets store private keys, which are used to access and manage your cryptocurrencies on the blockchain.'
          },
          {
            id: 'w2',
            question: 'Which type of wallet is considered more secure?',
            options: ['Hot Wallet', 'Cold Wallet', 'Mobile Wallet', 'Web Wallet'],
            correctAnswer: 1,
            explanation: 'Cold wallets (hardware wallets) are considered more secure as they store private keys offline, away from potential online threats.'
          }
        ]
      }
    ]
  },
  {
    id: 'trading-basics',
    title: 'Trading Fundamentals',
    level: 'Beginner',
    progress: 0,
    modules: [
      {
        id: 'spot-trading',
        title: 'Spot Trading Basics',
        description: 'Learn how to trade cryptocurrencies',
        completed: false,
        learningMaterial: {
          title: 'Understanding Spot Trading',
          introduction: 'Spot trading is the process of buying or selling a cryptocurrency for immediate delivery. It\'s essential to understand the basics of spot trading to navigate the crypto market.',
          keyPoints: [
            'Spot trading involves buying or selling cryptocurrencies at the current market price',
            'It\'s a type of trading that settles immediately, unlike futures or options',
            'Spot trading is available on most cryptocurrency exchanges',
            'It\'s essential to understand market volatility and risk management'
          ],
          examples: [
            {
              title: 'Spot Trading Example',
              description: 'Buying 1 Bitcoin at the current market price of $40,000 is an example of spot trading.'
            },
            {
              title: 'Market Volatility',
              description: 'Cryptocurrency markets can be highly volatile, with prices fluctuating rapidly. It\'s essential to understand how to manage risk in spot trading.'
            }
          ],
          summary: 'Spot trading is a fundamental concept in cryptocurrency trading. Understanding how it works and how to manage risk is crucial for anyone looking to trade cryptocurrencies.'
        },
        quiz: [
          {
            id: 'st1',
            question: 'What is spot trading in cryptocurrency?',
            options: ['Buying or selling cryptocurrencies for immediate delivery', 'Trading cryptocurrencies with leverage', 'Investing in cryptocurrency futures', 'Holding cryptocurrencies for long-term investment'],
            correctAnswer: 0,
            explanation: 'Spot trading involves buying or selling cryptocurrencies at the current market price for immediate delivery.'
          },
          {
            id: 'st2',
            question: 'What is a key characteristic of spot trading?',
            options: ['It settles immediately', 'It\'s a type of futures trading', 'It\'s a type of options trading', 'It\'s a type of margin trading'],
            correctAnswer: 0,
            explanation: 'Spot trading settles immediately, unlike futures or options trading which may have a delayed settlement.'
          }
        ]
      },
      {
        id: 'market-orders',
        title: 'Order Types',
        description: 'Different types of market orders',
        completed: false,
        learningMaterial: {
          title: 'Understanding Order Types',
          introduction: 'In cryptocurrency trading, there are different types of orders that can be used to buy or sell cryptocurrencies. Understanding these order types is essential to navigate the crypto market.',
          keyPoints: [
            'Market order: Buy or sell at the current market price',
            'Limit order: Buy or sell at a specified price',
            'Stop-loss order: Sell at a specified price to limit losses',
            'Take-profit order: Sell at a specified price to lock in profits'
          ],
          examples: [
            {
              title: 'Market Order Example',
              description: 'Buying 1 Bitcoin at the current market price of $40,000 is an example of a market order.'
            },
            {
              title: 'Limit Order Example',
              description: 'Buying 1 Bitcoin at a price of $38,000 is an example of a limit order.'
            }
          ],
          summary: 'Understanding different order types is essential to navigate the crypto market. Each order type has its own advantages and disadvantages, and it\'s crucial to understand how to use them effectively.'
        },
        quiz: [
          {
            id: 'ot1',
            question: 'What is a market order in cryptocurrency trading?',
            options: ['Buy or sell at the current market price', 'Buy or sell at a specified price', 'Sell at a specified price to limit losses', 'Sell at a specified price to lock in profits'],
            correctAnswer: 0,
            explanation: 'A market order is an order to buy or sell a cryptocurrency at the current market price.'
          },
          {
            id: 'ot2',
            question: 'What is a limit order in cryptocurrency trading?',
            options: ['Buy or sell at the current market price', 'Buy or sell at a specified price', 'Sell at a specified price to limit losses', 'Sell at a specified price to lock in profits'],
            correctAnswer: 1,
            explanation: 'A limit order is an order to buy or sell a cryptocurrency at a specified price.'
          }
        ]
      }
    ]
  },
  {
    id: 'defi-basics',
    title: 'DeFi Fundamentals',
    level: 'Intermediate',
    progress: 0,
    modules: [
      {
        id: 'defi-intro',
        title: 'What is DeFi?',
        description: 'Introduction to Decentralized Finance',
        completed: false,
        learningMaterial: {
          title: 'Understanding DeFi',
          introduction: 'DeFi, or Decentralized Finance, refers to the use of blockchain and cryptocurrency technologies to create decentralized financial systems. It\'s essential to understand the basics of DeFi to navigate the crypto space.',
          keyPoints: [
            'DeFi is a decentralized financial system that operates on blockchain technology',
            'It\'s a peer-to-peer system that eliminates intermediaries',
            'DeFi applications include lending, borrowing, and trading',
            'It\'s essential to understand the risks and benefits of DeFi'
          ],
          examples: [
            {
              title: 'DeFi Example',
              description: 'MakerDAO is a decentralized lending platform that allows users to borrow DAI, a stablecoin pegged to the US dollar.'
            },
            {
              title: 'DeFi Risks',
              description: 'DeFi applications can be vulnerable to smart contract risks, liquidity risks, and regulatory risks.'
            }
          ],
          summary: 'DeFi is a rapidly growing space that offers a range of financial applications and services. Understanding the basics of DeFi is essential to navigate the crypto space and make informed investment decisions.'
        },
        quiz: [
          {
            id: 'df1',
            question: 'What is DeFi?',
            options: ['Decentralized Finance', 'Decentralized Exchange', 'Decentralized Wallet', 'Decentralized Mining'],
            correctAnswer: 0,
            explanation: 'DeFi, or Decentralized Finance, refers to the use of blockchain and cryptocurrency technologies to create decentralized financial systems.'
          },
          {
            id: 'df2',
            question: 'What is a key characteristic of DeFi?',
            options: ['It\'s a centralized financial system', 'It\'s a peer-to-peer system that eliminates intermediaries', 'It\'s a type of cryptocurrency', 'It\'s a type of blockchain'],
            correctAnswer: 1,
            explanation: 'DeFi is a peer-to-peer system that eliminates intermediaries, such as banks and financial institutions.'
          }
        ]
      },
      {
        id: 'lending',
        title: 'Lending and Borrowing',
        description: 'DeFi lending platforms and strategies',
        completed: false,
        learningMaterial: {
          title: 'Understanding DeFi Lending',
          introduction: 'DeFi lending platforms allow users to lend and borrow cryptocurrencies in a decentralized manner. It\'s essential to understand the basics of DeFi lending to navigate the crypto space.',
          keyPoints: [
            'DeFi lending platforms use smart contracts to facilitate lending and borrowing',
            'Users can lend cryptocurrencies to earn interest',
            'Users can borrow cryptocurrencies to access liquidity',
            'It\'s essential to understand the risks and benefits of DeFi lending'
          ],
          examples: [
            {
              title: 'DeFi Lending Example',
              description: 'Compound is a decentralized lending platform that allows users to lend and borrow cryptocurrencies, such as Ethereum and DAI.'
            },
            {
              title: 'DeFi Lending Risks',
              description: 'DeFi lending platforms can be vulnerable to smart contract risks, liquidity risks, and regulatory risks.'
            }
          ],
          summary: 'DeFi lending is a rapidly growing space that offers a range of lending and borrowing opportunities. Understanding the basics of DeFi lending is essential to navigate the crypto space and make informed investment decisions.'
        },
        quiz: [
          {
            id: 'dl1',
            question: 'What is DeFi lending?',
            options: ['A type of cryptocurrency', 'A type of blockchain', 'A decentralized lending platform', 'A centralized lending platform'],
            correctAnswer: 2,
            explanation: 'DeFi lending refers to the use of decentralized lending platforms to lend and borrow cryptocurrencies.'
          },
          {
            id: 'dl2',
            question: 'What is a key characteristic of DeFi lending?',
            options: ['It uses smart contracts to facilitate lending and borrowing', 'It\'s a type of cryptocurrency', 'It\'s a type of blockchain', 'It\'s a centralized lending platform'],
            correctAnswer: 0,
            explanation: 'DeFi lending platforms use smart contracts to facilitate lending and borrowing in a decentralized manner.'
          }
        ]
      }
    ]
  },
  {
    id: 'advanced-trading',
    title: 'Advanced Trading Strategies',
    level: 'Advanced',
    progress: 0,
    modules: [
      {
        id: 'leverage',
        title: 'Leverage Trading',
        description: 'Understanding margin and leverage',
        completed: false,
        learningMaterial: {
          title: 'Understanding Leverage Trading',
          introduction: 'Leverage trading allows users to trade with borrowed funds, amplifying potential gains and losses. It\'s essential to understand the basics of leverage trading to navigate the crypto space.',
          keyPoints: [
            'Leverage trading uses borrowed funds to amplify trading positions',
            'It\'s a high-risk strategy that can result in significant losses',
            'Users can use leverage to trade cryptocurrencies, such as Bitcoin and Ethereum',
            'It\'s essential to understand the risks and benefits of leverage trading'
          ],
          examples: [
            {
              title: 'Leverage Trading Example',
              description: 'Using 10x leverage to trade Bitcoin can amplify potential gains, but also increases the risk of significant losses.'
            },
            {
              title: 'Leverage Trading Risks',
              description: 'Leverage trading can result in significant losses if the market moves against the user.'
            }
          ],
          summary: 'Leverage trading is a high-risk strategy that can result in significant gains or losses. Understanding the basics of leverage trading is essential to navigate the crypto space and make informed investment decisions.'
        },
        quiz: [
          {
            id: 'lt1',
            question: 'What is leverage trading?',
            options: ['A type of cryptocurrency', 'A type of blockchain', 'A trading strategy that uses borrowed funds', 'A type of investment strategy'],
            correctAnswer: 2,
            explanation: 'Leverage trading is a trading strategy that uses borrowed funds to amplify trading positions.'
          },
          {
            id: 'lt2',
            question: 'What is a key characteristic of leverage trading?',
            options: ['It\'s a low-risk strategy', 'It\'s a high-risk strategy that can result in significant losses', 'It\'s a type of cryptocurrency', 'It\'s a type of blockchain'],
            correctAnswer: 1,
            explanation: 'Leverage trading is a high-risk strategy that can result in significant losses if the market moves against the user.'
          }
        ]
      },
      {
        id: 'technical-analysis',
        title: 'Technical Analysis',
        description: 'Chart patterns and indicators',
        completed: false,
        learningMaterial: {
          title: 'Understanding Technical Analysis',
          introduction: 'Technical analysis is a method of evaluating securities by analyzing charts and patterns. It\'s essential to understand the basics of technical analysis to navigate the crypto space.',
          keyPoints: [
            'Technical analysis uses charts and patterns to evaluate securities',
            'It\'s a method of predicting future price movements',
            'Users can use technical indicators, such as moving averages and RSI',
            'It\'s essential to understand the risks and benefits of technical analysis'
          ],
          examples: [
            {
              title: 'Technical Analysis Example',
              description: 'Using the RSI indicator to identify overbought and oversold conditions in the Bitcoin market.'
            },
            {
              title: 'Technical Analysis Risks',
              description: 'Technical analysis is not a foolproof method and can result in incorrect predictions.'
            }
          ],
          summary: 'Technical analysis is a method of evaluating securities by analyzing charts and patterns. Understanding the basics of technical analysis is essential to navigate the crypto space and make informed investment decisions.'
        },
        quiz: [
          {
            id: 'ta1',
            question: 'What is technical analysis?',
            options: ['A type of cryptocurrency', 'A type of blockchain', 'A method of evaluating securities by analyzing charts and patterns', 'A type of investment strategy'],
            correctAnswer: 2,
            explanation: 'Technical analysis is a method of evaluating securities by analyzing charts and patterns.'
          },
          {
            id: 'ta2',
            question: 'What is a key characteristic of technical analysis?',
            options: ['It\'s based on fundamental data', 'It\'s based on chart patterns and indicators', 'It\'s based on market sentiment', 'It\'s based on company financials'],
            correctAnswer: 1,
            explanation: 'Technical analysis is primarily based on analyzing chart patterns and technical indicators to predict future price movements.'
          }
        ]
      }
    ]
  }
];

export default courses;
