import { Theme } from '@react-navigation/native';

/**
 * Custom theme colors
 */
interface Colors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  primaryVariants: {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
  };
  secondaryVariants: {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
  };
  neutralVariants: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  card: string;
  text: string;
  border: string;
  notification: string;
  toast: {
    successBackground: string;
    successBorder: string;
    errorBackground: string;
    errorBorder: string;
  };
  feedback: {
    error: string;
    errorBg: string;
    success: string;
    successBg: string;
    warning: string;
    warningBg: string;
  };
  error: string;
  white: string;
  black: string;
  overlay: string;
}

/**
 * Custom theme spacings
 */
interface Spacings {
  xs: number;
  s: number;
  sm: number;
  m: number;
  ml: number;
  l: number;
  xl: number;
  xxl: number;
  roundness: number;
}

export interface ExtendedTheme extends Theme {
  colors: Colors;
  spacings: Spacings;
}

export const lightTheme: ExtendedTheme = {
  dark: false,
  colors: {
    primary: '#FEB027',
    secondary: '#FDD327',
    background: '#FFF',
    surface: '#EFEFEF',
    primaryVariants: {
      100: '#FFF3E0',
      200: '#FFE8C1',
      300: '#FED792',
      400: '#FEC054',
      500: '#FEB027',
      600: '#D08D17',
      700: '#9B6608',
    },
    secondaryVariants: {
      100: '#FFFCEF',
      200: '#FEF2C1',
      300: '#FEE892',
      400: '#FDDF64',
      500: '#FDD327',
      600: '#D9B317',
      700: '#A7890B',
    },
    neutralVariants: {
      50: '#fcfcfc',
      100: '#f7f7f7',
      200: '#ededed',
      300: '#e8e8e8',
      400: '#f5f5f5',
      500: '#b3b3b3',
      600: '#8f8f8f',
      700: '#5c5c5c',
      800: '#3b3b3b',
      900: '#0a0a0a',
    },

    white: '#FFFFFF',
    black: '#000000',
    overlay: 'rgba(0, 0, 0, 0.5)',
    toast: {
      successBackground: '#F1FFE1',
      successBorder: '#1EC490',
      errorBackground: '#FFF2F9',
      errorBorder: '#F9ACD4',
    },
    feedback: {
      error: '#F359A8',
      errorBg: '#FDDBEC',
      success: '#1EC490',
      successBg: '#DEF9E4',
      warning: '#FCB836',
      warningBg: '#FCE2B6',
    },
    card: '#FFFFFF',
    text: '#0a0a0a',
    border: '#0a0a0a',
    notification: '#FEB027',
    error: '#F359A8',
  },
  spacings: {
    xs: 4,
    s: 8,
    sm: 12,
    m: 16,
    ml: 20,
    l: 24,
    xl: 32,
    xxl: 40,
    roundness: 12,
  },
};

// TODO: Add dark theme
/* export constants darkTheme: ExtendedTheme = {
 dark: true,
 ...DefaultTheme.colors,
 }; */

/**
 * Extend the default theme
 */
declare module '@react-navigation/native' {
  export function useTheme(): ExtendedTheme;
}
