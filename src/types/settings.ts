/**
 * Supported application themes.
 * - light: Light color schema.
 * - dark: Dark color schema (Future release).
 * - auto: Set the color schema according to the system (Future release).
 */
import { ChainInfo } from '@desmoslabs/desmjs';

type AppTheme = 'light' | 'dark' | 'auto';

/**
 * Type that represents the application settings
 */
export type AppSettings = {
  theme: AppTheme;
  biometrics: boolean;
  analytics: boolean;
  notifications: boolean;
  currentChain: ChainInfo;
  simplifyTxBroadcast: boolean;
};
