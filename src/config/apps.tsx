import { AppConfig } from '../types/apps';
import AdminWindow from '../components/apps/admin/AdminWindow';
import AirdropsWindow from '../components/apps/airdrops/AirdropsWindow';
import ChatWindow from '../components/apps/chat/ChatWindow';
import DocumentsWindow from '../components/apps/documents/DocumentsWindow';
import GambaWindow from '../components/apps/gamba/GambaWindow';
import NeuralNetworkWindow from '../components/apps/neural-network/NeuralNetworkWindow';
import TokenDataWindow from '../components/apps/token-data/TokenDataWindow';
import WalletWindow from '../components/apps/wallet/WalletWindow';
import ZionWindow from '../components/apps/zion/ZionWindow';

// Whitelisted admin wallets
const ADMIN_WALLETS = [
  '25NcM1z7dxbRZE9JptiBVec9XySd8MGCnxZKMvzDP5T5', // Dev wallet
  '4qKmxCGme3oDMbn5EidEJ22cMx1EWAXHsVXPMctCiHwZ', // Treasury wallet
  'F2NMjJX7xHfKWfgAEv9uATcgx2nabzDFkKtk8szoJASN'  // Raffle Wallet
];

const apps: AppConfig[] = [
  {
    id: 'admin',
    name: 'Admin',
    icon: '🔑',
    component: AdminWindow,
    defaultSize: { width: 800, height: 600 },
    defaultPosition: { x: 50, y: 50 },
    description: 'Admin control panel',
    isAdminOnly: true,
    showInTaskbar: true
  },
  {
    id: 'airdrops',
    name: 'Airdrops',
    icon: '🪂',
    component: AirdropsWindow,
    defaultSize: { width: 400, height: 500 },
    defaultPosition: { x: 100, y: 100 },
    description: 'Airdrop tracking and claims',
    showInTaskbar: true
  },
  {
    id: 'chat',
    name: 'Chat',
    icon: '💬',
    component: ChatWindow,
    defaultSize: { width: 400, height: 600 },
    defaultPosition: { x: 150, y: 150 },
    description: 'AI-powered chat assistant',
    showInTaskbar: true
  },
  {
    id: 'documents',
    name: 'Documents',
    icon: '📄',
    component: DocumentsWindow,
    defaultSize: { width: 500, height: 600 },
    defaultPosition: { x: 200, y: 100 },
    description: 'Project documentation',
    showInTaskbar: true
  },
  {
    id: 'gamba',
    name: 'Gamba',
    icon: '🎰',
    component: GambaWindow,
    defaultSize: { width: 450, height: 600 },
    defaultPosition: { x: 250, y: 150 },
    description: 'Solana-based gaming platform',
    showInTaskbar: true
  },
  {
    id: 'neural-network',
    name: 'Neural Network',
    icon: '🧠',
    component: NeuralNetworkWindow,
    defaultSize: { width: 800, height: 600 },
    defaultPosition: { x: 300, y: 100 },
    description: 'AI learning platform',
    showInTaskbar: true
  },
  {
    id: 'token-data',
    name: '$AIS Data',
    icon: '📊',
    component: TokenDataWindow,
    defaultSize: { width: 450, height: 600 },
    defaultPosition: { x: 300, y: 100 },
    description: 'Token data and analytics',
    showInTaskbar: true
  },
  {
    id: 'wallet',
    name: 'Wallet',
    icon: '💰',
    component: WalletWindow,
    defaultSize: { width: 350, height: 500 },
    defaultPosition: { x: 350, y: 150 },
    description: 'Wallet connection and management',
    showInTaskbar: true
  },
  {
    id: 'zion',
    name: 'Zion',
    icon: '🌐',
    component: ZionWindow,
    defaultSize: { width: 800, height: 600 },
    defaultPosition: { x: 100, y: 50 },
    description: 'Zion network interface',
    showInTaskbar: true
  }
].map(app => ({ ...app, order: app.id === 'wallet' ? -1 : 0 })).sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

export default apps;
export { ADMIN_WALLETS };
