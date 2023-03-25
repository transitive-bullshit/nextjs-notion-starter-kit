import { init } from '@waline/client';
import '@waline/client/dist/waline-meta.css';
// import '@waline/client/dist/waline.css';
import React, { useEffect, useRef } from 'react';
import styles from './styles.module.css';

import type { WalineInitOptions, WalineInstance } from '@waline/client';

export type WalineOptions = Omit<WalineInitOptions, 'el'> & { path: string };

export const Waline = (props: WalineOptions) => {
  const walineInstanceRef = useRef<WalineInstance | null>(null);
  const containerRef = React.createRef<HTMLDivElement>();
  useEffect(() => {
    walineInstanceRef.current = init({
      ...props,
      el: containerRef.current,
      
    });
    return () => walineInstanceRef.current?.destroy();
  });

  useEffect(() => {
    walineInstanceRef.current?.update(props);
  }, [props]);

  return (
  <div 
    ref={containerRef}
    className={styles.comments}
    />
   );
};