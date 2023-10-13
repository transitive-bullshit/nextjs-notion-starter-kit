import React, { useEffect, FC } from 'react';

const Favicon: FC = () => {
  useEffect(() => {
    const link: HTMLLinkElement = document.createElement('link');
    link.rel = 'icon';
    link.href = '/favicon.svg';
    document.head.appendChild(link);
  }, []);

  return null;
}

export default Favicon;