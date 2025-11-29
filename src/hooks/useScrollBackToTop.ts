import { useEffect, useState } from 'react';

const POPUP_EXPIRY_DATE = new Date('2026-01-31');
const STORAGE_KEY = 'whitepaper-popup-dismissed';

export const useScrollBackToTop = () => {
  const [shouldShowPopup, setShouldShowPopup] = useState(false);
  const [hasScrolledDown, setHasScrolledDown] = useState(false);

  useEffect(() => {
    // Check if popup is expired
    if (new Date() > POPUP_EXPIRY_DATE) {
      return;
    }

    // Check if user has permanently dismissed
    const isDismissed = localStorage.getItem(STORAGE_KEY) === 'true';
    if (isDismissed) {
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;

      // User has scrolled down past threshold
      if (scrollY > 500 && !hasScrolledDown) {
        setHasScrolledDown(true);
      }

      // User scrolled back to top after being down
      if (scrollY < 100 && hasScrolledDown && !shouldShowPopup) {
        setShouldShowPopup(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolledDown, shouldShowPopup]);

  const dismissPopup = (permanent: boolean = false) => {
    setShouldShowPopup(false);
    if (permanent) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
  };

  return { shouldShowPopup, dismissPopup };
};
