import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      // Use requestAnimationFrame to batch layout reads and prevent forced reflows
      requestAnimationFrame(() => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      });
    };
    mql.addEventListener("change", onChange);
    // Initial check also wrapped in rAF
    requestAnimationFrame(() => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    });
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
