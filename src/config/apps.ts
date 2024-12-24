import React from 'react';
import { FaChartLine, FaUserShield, FaGift, FaComments, FaFile, FaDice, FaBrain, FaDatabase, FaWallet } from 'react-icons/fa';
import TokenDataWindow from '../components/apps/token-data/TokenDataWindow';
import AdminPanel from '../components/apps/admin/AdminPanel';
import AirdropsWindow from '../components/apps/airdrops/AirdropsWindow';
import ChatWindow from '../components/apps/chat/ChatWindow';
import DocumentsWindow from '../components/apps/documents/DocumentsWindow';
import GambaWindow from '../components/apps/gamba/GambaWindow';
import NeuralNetworkWindow from '../components/apps/neural-network/NeuralNetworkWindow';
import ZionWindow from '../components/apps/zion/ZionWindow';
import WalletWindow from '../components/apps/wallet/WalletWindow';

export const ADMIN_WALLETS = [
  import.meta.env.VITE_ADMIN_WALLET_1,  // Dev Wallet
  import.meta.env.VITE_ADMIN_WALLET_2,  // Treasury Wallet
  import.meta.env.VITE_ADMIN_WALLET_3,  // Raffle Wallet
];

export const isAdminWallet = (address: string | null) => {
  if (!address) return false;
  return ADMIN_WALLETS.includes(address);
};

export interface AppConfig {
  id: string;
  name: string;
  icon: React.ReactElement;
  component: React.ComponentType<any>;
  defaultSize: {
    width: number;
    height: number;
  };
}

const apps: AppConfig[] = [
  {
    id: "wallet",
    name: "Wallet",
    icon: React.createElement(FaWallet),
    component: WalletWindow,
    defaultSize: { width: 800, height: 600 }
  },
  {
    id: "token-data",
    name: "$AIS Data",
    icon: React.createElement(FaChartLine),
    component: TokenDataWindow,
    defaultSize: { width: 800, height: 600 }
  },
  {
    id: "admin",
    name: "Admin",
    icon: React.createElement(FaUserShield),
    component: AdminPanel,
    defaultSize: { width: 800, height: 600 }
  },
  {
    id: "airdrops",
    name: "Airdrops",
    icon: React.createElement(FaGift),
    component: AirdropsWindow,
    defaultSize: { width: 800, height: 600 }
  },
  {
    id: "chat",
    name: "Chat",
    icon: React.createElement(FaComments),
    component: ChatWindow,
    defaultSize: { width: 800, height: 600 }
  },
  {
    id: "documents",
    name: "Documents",
    icon: React.createElement(FaFile),
    component: DocumentsWindow,
    defaultSize: { width: 800, height: 600 }
  },
  {
    id: "gamba",
    name: "Gamba",
    icon: React.createElement(FaDice),
    component: GambaWindow,
    defaultSize: { width: 800, height: 600 }
  },
  {
    id: "neural-network",
    name: "Neural Network",
    icon: React.createElement(FaBrain),
    component: NeuralNetworkWindow,
    defaultSize: { width: 800, height: 600 }
  },
  {
    id: "zion",
    name: "Zion",
    icon: React.createElement(FaDatabase),
    component: ZionWindow,
    defaultSize: { width: 800, height: 600 }
  }
];

export default apps;
