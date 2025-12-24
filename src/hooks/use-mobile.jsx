// Hook to detect if we're on a mobile device
// Uses matchMedia API for proper responsive detection
import * as React from "react";

// Breakpoint matches Tailwind's 'md' breakpoint
const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // Start with undefined to avoid hydration mismatches
  const [isMobile, setIsMobile] = React.useState(undefined);

  React.useEffect(() => {
    // Create a media query listener
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Listen for changes
    mql.addEventListener("change", onChange);
    
    // Set initial value
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    
    // Cleanup listener on unmount
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Convert to boolean (handles undefined case)
  return !!isMobile;
}