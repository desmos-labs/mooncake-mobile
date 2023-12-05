/**
 * Interface that represents the feature flags supported from the application.
 */
export interface AppFeatureFlags {
  /**
   * Feature flag that tells on which version of the app the user
   * will be allowed to login only with the private key.
   */
  loginWithPrivateKeyOnVersion: string;
}

/**
 * Interface that represents the feature flags returned
 * from posthog.
 */
export interface PostHogFeatureFlags extends Record<string, string | boolean> {
  loginWithPrivateKeyOnVersion: string;
}

/**
 * Default feature flags values if not provided from posthog.
 */
export const DefaultPosthogFeatureFlags: PostHogFeatureFlags = {
  loginWithPrivateKeyOnVersion: '',
};
