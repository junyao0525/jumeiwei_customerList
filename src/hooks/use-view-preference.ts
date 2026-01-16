"use client";

import type { ViewMode } from "@/types/customer";
import { useLocalStorage } from "./use-local-storage";

/**
 * Custom hook to persist user's view mode preference (table or card)
 * @returns [viewMode, setViewMode] like useState
 */
export function useViewPreference(): [
  ViewMode,
  (mode: ViewMode) => void
] {
  return useLocalStorage<ViewMode>("viewMode", "table");
}
