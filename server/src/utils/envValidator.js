const requiredEnvVars = {
  // OpenAI
  OPENAI_API_KEY: {
    required: true,
    validate: (value) => value.startsWith('sk-'),
    message: 'OpenAI API key must start with "sk-"'
  },
  
  // MongoDB
  MONGODB_URI: {
    required: true,
    validate: (value) => value.includes('mongodb'),
    message: 'MongoDB URI must be a valid connection string'
  },
  
  // Security
  JWT_SECRET: {
    required: true,
    validate: (value) => value.length >= 32,
    message: 'JWT secret must be at least 32 characters long'
  },
  SESSION_SECRET: {
    required: true,
    validate: (value) => value.length >= 32,
    message: 'Session secret must be at least 32 characters long'
  },

  // Solana Wallet Addresses
  VITE_ADMIN_WALLET_1: {
    required: true,
    validate: (value) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value),
    message: 'Admin wallet address must be a valid Solana address'
  },
  VITE_ADMIN_WALLET_2: {
    required: true,
    validate: (value) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value),
    message: 'Treasury wallet address must be a valid Solana address'
  },
  VITE_ADMIN_WALLET_3: {
    required: true,
    validate: (value) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value),
    message: 'Raffle wallet address must be a valid Solana address'
  }
};

export function validateEnv() {
  const errors = [];
  
  // Check each required variable
  for (const [key, config] of Object.entries(requiredEnvVars)) {
    const value = process.env[key];
    
    // Check if required variable exists
    if (config.required && !value) {
      errors.push(`Missing required environment variable: ${key}`);
      continue;
    }
    
    // Run custom validation if provided
    if (value && config.validate && !config.validate(value)) {
      errors.push(`Invalid ${key}: ${config.message}`);
    }
  }
  
  // Check for development-specific requirements
  if (process.env.NODE_ENV === 'development') {
    // Add any development-specific checks here
  }
  
  // Check for production-specific requirements
  if (process.env.NODE_ENV === 'production') {
    // Ensure stricter requirements for production
    if (!process.env.JWT_SECRET?.length >= 64) {
      errors.push('Production JWT_SECRET should be at least 64 characters');
    }
    if (!process.env.SESSION_SECRET?.length >= 64) {
      errors.push('Production SESSION_SECRET should be at least 64 characters');
    }
  }
  
  // If any errors were found, log them and exit
  if (errors.length > 0) {
    console.error('❌ Environment validation failed:');
    errors.forEach(error => console.error(`  - ${error}`));
    process.exit(1);
  }
  
  console.log('✅ Environment validation passed');
  return true;
}
