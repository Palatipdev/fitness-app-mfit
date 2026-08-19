/**
 * mfit design tokens.
 *
 * Three layers, in order:
 *   1. primitives  - raw values, never used directly in a screen
 *   2. semantic    - role-based colors that flip between light and dark
 *   3. scales      - spacing, radius, type, elevation shared by both themes
 *
 * Screens never hardcode a hex value. They read from `useTheme()`.
 */

import { Platform, TextStyle } from "react-native";

/* ------------------------------------------------------------------ *
 * 1. Primitives
 * ------------------------------------------------------------------ */

const palette = {
  // Brand cyan, carried over from the original mfit identity.
  cyan300: "#5FE0F5",
  cyan400: "#0CC0DF",
  cyan500: "#0AA6C2",
  cyan600: "#0E7A90",
  cyan900: "#04222A",

  // Neutral ramp, cool-shifted so it sits well next to the cyan.
  ink950: "#0B0D10",
  ink900: "#111620",
  ink850: "#171C25",
  ink800: "#1E2530",
  ink700: "#262E3A",
  ink600: "#333D4B",
  ink500: "#4A5666",
  ink400: "#78838F",
  ink300: "#9BA6B4",
  ink200: "#C6CDD6",
  ink100: "#E2E6EB",
  ink50: "#F1F3F6",
  white: "#FFFFFF",

  // Feedback. Green doubles as the "personal record" colour.
  green400: "#22C55E",
  green600: "#15803D",
  amber400: "#F59E0B",
  amber600: "#B45309",
  red400: "#F87171",
  red500: "#EF4444",
  red600: "#DC2626",
} as const;

/* ------------------------------------------------------------------ *
 * 2. Semantic colours
 * ------------------------------------------------------------------ */

export type ColorTokens = {
  background: string;
  backgroundElevated: string;
  surface: string;
  surfaceAlt: string;
  surfacePressed: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textFaint: string;
  textInverse: string;
  primary: string;
  primaryPressed: string;
  primarySoft: string;
  onPrimary: string;
  accent: string;
  accentSoft: string;
  onAccent: string;
  warning: string;
  danger: string;
  dangerSoft: string;
  onDanger: string;
  scrim: string;
  skeleton: string;
};

const dark: ColorTokens = {
  background: palette.ink950,
  backgroundElevated: palette.ink900,
  surface: palette.ink850,
  surfaceAlt: palette.ink800,
  surfacePressed: palette.ink700,
  border: palette.ink700,
  borderStrong: palette.ink600,
  text: "#F7F9FB",
  textMuted: palette.ink300,
  textFaint: palette.ink400,
  textInverse: palette.ink950,
  primary: palette.cyan400,
  primaryPressed: palette.cyan500,
  primarySoft: "rgba(12,192,223,0.14)",
  onPrimary: palette.cyan900,
  accent: palette.green400,
  accentSoft: "rgba(34,197,94,0.16)",
  onAccent: "#052E13",
  warning: palette.amber400,
  danger: palette.red400,
  dangerSoft: "rgba(248,113,113,0.16)",
  onDanger: palette.ink950,
  scrim: "rgba(0,0,0,0.72)",
  skeleton: palette.ink800,
};

const light: ColorTokens = {
  background: "#F6F7F9",
  backgroundElevated: palette.white,
  surface: palette.white,
  surfaceAlt: palette.ink50,
  surfacePressed: palette.ink100,
  border: palette.ink100,
  borderStrong: palette.ink200,
  text: "#0E1420",
  textMuted: "#5A6675",
  textFaint: "#79838F",
  textInverse: palette.white,
  primary: palette.cyan600,
  primaryPressed: "#0B6070",
  primarySoft: "rgba(14,122,144,0.12)",
  onPrimary: palette.white,
  accent: palette.green600,
  accentSoft: "rgba(21,128,61,0.12)",
  onAccent: palette.white,
  warning: palette.amber600,
  danger: palette.red600,
  dangerSoft: "rgba(220,38,38,0.10)",
  onDanger: palette.white,
  scrim: "rgba(11,13,16,0.45)",
  skeleton: palette.ink100,
};

export const palettes = { dark, light };

/* ------------------------------------------------------------------ *
 * 3. Shared scales
 * ------------------------------------------------------------------ */

/** 4pt rhythm. `space.md` (16) is the default gutter. */
export const space = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  pill: 999,
} as const;

/** Minimum tappable square. iOS asks 44pt, Android 48dp — take the larger. */
export const hitTarget = 48;

export const fonts = {
  display: "BarlowCondensed_700Bold",
  displayMedium: "BarlowCondensed_600SemiBold",
  bold: "Barlow_700Bold",
  semibold: "Barlow_600SemiBold",
  medium: "Barlow_500Medium",
  regular: "Barlow_400Regular",
} as const;

/**
 * Type roles. Every screen picks a role instead of inventing a size.
 * Line heights sit at 1.4–1.5 of font size for body copy.
 */
export const type = {
  display: {
    fontFamily: fonts.display,
    fontSize: 40,
    lineHeight: 42,
    letterSpacing: -0.5,
  },
  h1: {
    fontFamily: fonts.display,
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  h2: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  h3: { fontFamily: fonts.semibold, fontSize: 18, lineHeight: 24 },
  title: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24 },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 24 },
  small: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20 },
  smallStrong: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18 },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.8,
    textTransform: "uppercase" as const,
  },
  /** Tabular figures stop timers and weight columns from jittering. */
  numeric: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    lineHeight: 22,
    fontVariant: ["tabular-nums"] as TextStyle["fontVariant"],
  },
  numericLarge: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 34,
    fontVariant: ["tabular-nums"] as TextStyle["fontVariant"],
  },
} satisfies Record<string, TextStyle>;

export type TypeRole = keyof typeof type;

/**
 * Elevation. Android reads `elevation`, iOS reads the shadow triple, so both
 * are set and the platform picks what it understands.
 */
export const elevation = (level: 0 | 1 | 2 | 3) => {
  if (level === 0) return {};
  const spec = {
    1: { height: 1, radius: 3, opacity: 0.18 },
    2: { height: 4, radius: 10, opacity: 0.24 },
    3: { height: 10, radius: 22, opacity: 0.32 },
  }[level];
  return Platform.select({
    android: { elevation: level * 3 },
    default: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: spec.height },
      shadowRadius: spec.radius,
      shadowOpacity: spec.opacity,
    },
  });
};

/** Motion tokens. Exits run shorter than entrances so the UI feels responsive. */
export const motion = {
  instant: 90,
  fast: 150,
  base: 220,
  slow: 320,
  exit: 160,
} as const;

export type Theme = {
  scheme: "light" | "dark";
  colors: ColorTokens;
  space: typeof space;
  radius: typeof radius;
  type: typeof type;
  motion: typeof motion;
  elevation: typeof elevation;
  hitTarget: number;
};
