'use client';

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
  hydrated: boolean;
} {
  const [value, setValueState] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Merge with initialValue so new fields get defaults
        setValueState((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore parse errors
    }
    setHydrated(true);
  }, [key]);

  const setValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setValueState((prev) => {
      const resolved = typeof newValue === 'function'
        ? (newValue as (prev: T) => T)(prev)
        : newValue;
      try {
        localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        // ignore quota errors
      }
      return resolved;
    });
  }, [key]);

  const removeValue = useCallback(() => {
    setValueState(initialValue);
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }, [key, initialValue]);

  return { value, setValue, removeValue, hydrated };
}
