// Simple debounce hook to avoid hammering the search on every keystroke
// Waits for the user to stop typing before actually updating the search
import { useState, useEffect } from 'react';

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value changes before the delay is up
    // This is the key part - it prevents the old timer from firing
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Re-run when value or delay changes

  return debouncedValue;
}