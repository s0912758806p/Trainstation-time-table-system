import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

/**
 * 監聽視窗寬度，回傳是否為行動裝置
 */
const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < MOBILE_BREAKPOINT
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

export default useIsMobile;
