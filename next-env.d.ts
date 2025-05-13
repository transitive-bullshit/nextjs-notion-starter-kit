/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.

interface Window {
  dataLayer: any[];
  gtag: (command: string, target: string, params?: Record<string, any>) => void;
}
