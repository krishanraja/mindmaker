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
  const scrollLockCooldownRef = useRef(false);

  useEffect(() => {
    // Check if popup is expired
    if (new Date() > POPUP_EXPIRY_DATE) return;
    
    // Check if permanently dismissed
    if (localStorage.getItem(STORAGE_KEY) === 'true') return;
    
    // Check if already shown this session
    if (hasShownThisSession.current) return;

    const handleScroll = () => {
      // Don't trigger during scroll lock cooldown
      if (scrollLockCooldownRef.current) return;
      
      // Check if body has scroll lock styles (position: fixed means scroll is locked)
      const isScrollLocked = document.body.style.position === 'fixed';
      if (isScrollLocked) return;
      
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

    // Monitor for scroll lock releases to set cooldown
    const observer = new MutationObserver(() => {
      const wasLocked = scrollLockCooldownRef.current;
      const isLocked = document.body.style.position === 'fixed';
      
      // If transitioning from locked to unlocked, set cooldown
      if (!isLocked && document.body.style.overflow === '') {
        scrollLockCooldownRef.current = true;
        setTimeout(() => {
          scrollLockCooldownRef.current = false;
        }, 1000); // 1 second cooldown after scroll lock releases
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style'],
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [hasScrolledDeep]);

  const dismissPopup = (permanent: boolean = false) => {
    setShouldShowPopup(false);
    if (permanent) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
  };

  return { shouldShowPopup, dismissPopup };
};
