export interface AppConfig {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType;
  defaultSize: {
    width: number;
    height: number;
  };
  defaultPosition: {
    x: number;
    y: number;
  };
  description?: string;
}

export interface AppWindowProps {
  onClose: () => void;
  onMinimize: () => void;
}
