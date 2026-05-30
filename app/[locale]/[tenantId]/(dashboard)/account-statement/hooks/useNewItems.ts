import { useState, useEffect, useRef, useCallback } from "react";

export function useNewItems<T>(currentItems: T[], getKey: (item: T) => string) {
  const prevKeysRef = useRef<Set<string>>(new Set());
  const [newItemIds, setNewItemIds] = useState<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stabilize getKey reference to prevent unnecessary effect runs
  const stableGetKey = useCallback(getKey, [getKey]);

  useEffect(() => {
    const currentKeys = new Set(currentItems.map(stableGetKey));

    // Only flag items as "new" if they weren't in the previous set
    // This prevents false positives from polling refetches that return
    // the same data with different object references
    const addedKeys = new Set(
      [...currentKeys].filter((k) => !prevKeysRef.current.has(k))
    );

    // Only animate if we had a previous set (skip initial load) and there are genuinely new items
    if (addedKeys.size > 0 && prevKeysRef.current.size > 0) {
      setNewItemIds(addedKeys);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setNewItemIds(new Set()), 500);
    }

    prevKeysRef.current = currentKeys;
  }, [currentItems, stableGetKey]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { newItemIds };
}