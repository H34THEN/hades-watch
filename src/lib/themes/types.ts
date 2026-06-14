export interface ThemeAssets {
  logo?: string;
  favicon?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  textureOverlay?: string;
  cursorImage?: string;
  loadingAnimation?: string;
  alertSound?: string;
  loginAmbience?: string;
  dashboardAmbience?: string;
}

export interface ThemeOverlays {
  scanlines?: boolean;
  glow?: boolean;
  noise?: boolean;
  vignette?: boolean;
}

export interface ThemeCssVariables {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  border: string;
  ring: string;
  glow: string;
}

export interface HadesTheme {
  id: string;
  name: string;
  description: string;
  cssVariables: ThemeCssVariables;
  overlays: ThemeOverlays;
  assets: ThemeAssets;
}

export const THEME_STORAGE_KEY = "hades-watch-theme";
