import { useEffect, useState, useRef } from 'react';

const POPUP_EXPIRY_DATE = new Date('2026-01-31');
const STORAGE_KEY = 'whitepaper-popup-dismissed';
const SESSION_KEY = 'whitepaper-popup-shown-session';

export const useScrollBackToTop = () => {
  const [shouldShowPopup, setShouldShowPopup] = useState(false);
  const [hasScrolledDeep, setHasScrolledDeep] = useState(false);
  const hasShownThisSession = useRef(
    sessionStorage.getItem(SESSION_KEY) === 'true'
  );

  useEffect(() => {
    // Check if popup is expired
    if (new Date() > POPUP_EXPIRY_DATE) return;
    
    // Check if permanently dismissed
    if (localStorage.getItem(STORAGE_KEY) === 'true') return;
    
    // Check if already shown this session
    if (hasShownThisSession.current) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollableHeight = pageHeight - viewportHeight;
      
      // User must scroll at least 40% down the page OR past 800px
      const scrollDepthThreshold = Math.max(scrollableHeight * 0.4, 800);
      
      if (scrollY > scrollDepthThreshold && !hasScrolledDeep) {
        setHasScrolledDeep(true);
      }

      // Trigger: scrolled deep, now near top, hasn't shown yet
      if (scrollY < 200 && hasScrolledDeep && !hasShownThisSession.current) {
        hasShownThisSession.current = true;
        sessionStorage.setItem(SESSION_KEY, 'true');
        setShouldShowPopup(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolledDeep]);

  const dismissPopup = (permanent: boolean = false) => {
    setShouldShowPopup(false);
    if (permanent) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
  };

  return { shouldShowPopup, dismissPopup };
};
