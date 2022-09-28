/**
 * Supported application themes.
 * - light: Light color schema.
 * - dark: Dark color schema (Future release).
 * - auto: Set the color schema according to the system (Future release).
 */
export type AppTheme = 'light' | 'dark' | 'auto';

/**
 * Type that represents the application settings
 */
export type AppSettings = {
  theme: AppTheme;

  // use MMKV to control these as they need to be persisted across
  // app sessions
  biometrics: boolean;
  notifications: boolean;
  notificationsPermission: boolean;

  // Has app data been initialized yet?
  dataInitialized: boolean;
  currentTimezone: string;
  registeredReactions: any[];
  registeredReports: any[];
};
