"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook that syncs state with localStorage
 * @param key - The localStorage key
 * @param initialValue - Default value if nothing in localStorage
 * @returns [state, setState] like useState
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialize state with lazy initialization from localStorage
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Sync to localStorage whenever state changes
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      if (error instanceof Error && error.name === "QuotaExceededError") {
        console.error(`localStorage quota exceeded for key "${key}"`);
      } else {
        console.error(`Error saving localStorage key "${key}":`, error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
