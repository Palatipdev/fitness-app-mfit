import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";

import {
  elevation,
  hitTarget,
  motion,
  palettes,
  radius,
  space,
  type,
  type Theme,
} from "@/constants/theme";

export type SchemePreference = "system" | "light" | "dark";

const STORAGE_KEY = "mfit.theme";

type ThemeContextValue = {
  theme: Theme;
  preference: SchemePreference;
  setPreference: (next: SchemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function buildTheme(scheme: "light" | "dark"): Theme {
  return {
    scheme,
    colors: palettes[scheme],
    space,
    radius,
    type,
    motion,
    elevation,
    hitTarget,
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] =
    useState<SchemePreference>("dark");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored === "system" || stored === "light" || stored === "dark") {
          setPreferenceState(stored);
        }
      })
      .catch(() => {
        // A missing preference is not an error worth surfacing; keep the default.
      });
  }, []);

  const setPreference = useCallback((next: SchemePreference) => {
    setPreferenceState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const scheme: "light" | "dark" =
    preference === "system" ? (systemScheme === "light" ? "light" : "dark") : preference;

  const value = useMemo<ThemeContextValue>(
    () => ({ theme: buildTheme(scheme), preference, setPreference }),
    [scheme, preference, setPreference],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx.theme;
}

export function useThemePreference() {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    throw new Error("useThemePreference must be used inside <ThemeProvider>");
  return { preference: ctx.preference, setPreference: ctx.setPreference };
}

/**
 * Builds a StyleSheet from the active theme and memoises it per scheme, so
 * switching themes rebuilds styles but ordinary re-renders do not.
 */
export function useThemedStyles<T>(factory: (theme: Theme) => T): T {
  const theme = useTheme();
  return useMemo(() => factory(theme), [theme, factory]);
}
