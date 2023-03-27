/**
 * Supported application themes.
 * - light: Light color schema.
 * - dark: Dark color schema (Future release).
 * - auto: Set the color schema according to the system (Future release).
 */
import { ChainInfo } from '@desmoslabs/desmjs/build/types/chains';

export type AppTheme = 'light' | 'dark' | 'auto';

/**
 * Type that represents the application settings
 */
export type AppSettings = {
  theme: AppTheme;
  biometrics: boolean;
  notifications: boolean;
  currentChain: ChainInfo;
  simplifyTxBroadcast: boolean;
};

/**
 * Enum that represents the supported biometrics
 * authorizations types.
 */
export enum BiometricAuthorizations {
  /**
   * Use biometrics to unlock the application at the first open.
   */
  Login = 'BiometricsLogin',
  /**
   * Use biometrics to unlock the user wallet.
   */
  UnlockWallet = 'BiometricsUnlockWallet',
}
