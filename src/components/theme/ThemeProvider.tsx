"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { useSession } from "next-auth/react";
import { applyThemeToDocument } from "@/lib/themes/apply-theme";
import { updateThemePreferenceAction } from "@/lib/actions/profile";
import {
  defaultThemeId,
  getThemeById,
  getThemeOrDefault,
  themes,
} from "@/lib/themes/registry";
import type { HadesTheme } from "@/lib/themes/types";
import { THEME_STORAGE_KEY } from "@/lib/themes/types";

interface ThemeContextValue {
  theme: HadesTheme;
  themeId: string;
  setThemeId: (id: string) => void;
  themes: HadesTheme[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

let themeListeners: Array<() => void> = [];

function notifyThemeListeners() {
  themeListeners.forEach((l) => l());
}

function subscribeToTheme(callback: () => void) {
  themeListeners.push(callback);
  return () => {
    themeListeners = themeListeners.filter((l) => l !== callback);
  };
}

function getThemeSnapshot(): string {
  if (typeof window === "undefined") return defaultThemeId;
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored && getThemeById(stored)) return stored;
  return defaultThemeId;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  userThemeId?: string | null;
  isAuthenticated?: boolean;
}

export function ThemeProvider({
  children,
  userThemeId,
  isAuthenticated,
}: ThemeProviderProps) {
  const { status } = useSession();
  const localThemeId = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    () => defaultThemeId,
  );

  const themeId = useMemo(() => {
    if (isAuthenticated && userThemeId && getThemeById(userThemeId)) {
      return userThemeId;
    }
    if (status === "authenticated" && userThemeId && getThemeById(userThemeId)) {
      return userThemeId;
    }
    return localThemeId;
  }, [isAuthenticated, userThemeId, localThemeId, status]);

  const theme = useMemo(() => getThemeOrDefault(themeId), [themeId]);

  useEffect(() => {
    applyThemeToDocument(theme);
    if (!isAuthenticated && status !== "authenticated") {
      localStorage.setItem(THEME_STORAGE_KEY, theme.id);
    }
  }, [theme, isAuthenticated, status]);

  const setThemeId = useCallback(
    (id: string) => {
      if (!getThemeById(id)) return;
      localStorage.setItem(THEME_STORAGE_KEY, id);
      notifyThemeListeners();
      if (isAuthenticated || status === "authenticated") {
        void updateThemePreferenceAction(id);
      }
    },
    [isAuthenticated, status],
  );

  const value = useMemo(
    () => ({ theme, themeId, setThemeId, themes }),
    [theme, themeId, setThemeId],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
