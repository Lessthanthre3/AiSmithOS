import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from './WalletContext';

interface ConnectedUser {
  address: string;
  connectedAt: Date;
  lastActive: Date;
  userAgent?: string;
}

interface SessionContextType {
  connectedUsers: ConnectedUser[];
  updateUserActivity: (address: string) => void;
  addConnectedUser: (address: string) => void;
  removeConnectedUser: (address: string) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
  const { publicKey } = useWallet();

  // Add current user when wallet connects
  useEffect(() => {
    if (publicKey) {
      addConnectedUser(publicKey.toString());
    }
  }, [publicKey]);

  // Clean up inactive users every minute
  useEffect(() => {
    const cleanup = setInterval(() => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      setConnectedUsers(prev => 
        prev.filter(user => user.lastActive > fiveMinutesAgo)
      );
    }, 60000);

    return () => clearInterval(cleanup);
  }, []);

  const addConnectedUser = (address: string) => {
    setConnectedUsers(prev => {
      if (prev.some(user => user.address === address)) {
        return prev;
      }
      return [...prev, {
        address,
        connectedAt: new Date(),
        lastActive: new Date(),
        userAgent: navigator.userAgent
      }];
    });
  };

  const removeConnectedUser = (address: string) => {
    setConnectedUsers(prev => prev.filter(user => user.address !== address));
  };

  const updateUserActivity = (address: string) => {
    setConnectedUsers(prev => prev.map(user => 
      user.address === address 
        ? { ...user, lastActive: new Date() }
        : user
    ));
  };

  return (
    <SessionContext.Provider value={{
      connectedUsers,
      updateUserActivity,
      addConnectedUser,
      removeConnectedUser
    }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
