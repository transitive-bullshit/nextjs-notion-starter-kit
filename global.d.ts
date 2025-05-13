interface Window {
  gtag: (command: string, target: string, params?: Record<string, any>) => void;
  dataLayer: any[];
} 