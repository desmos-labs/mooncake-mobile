/**
 * This file is used to declare the types of the environment variables.
 * @ts-ignore
 * @internal
 */
declare module '@env' {
  export const SENTRY_DSN: string;
  export const SENTRY_AUTH_TOKEN: string;
  export const APP_SUBSPACE_ID: string;
  export const WEB3_AUTH_CLIENT_ID_MAINNET: string;
  export const WEB3_AUTH_CLIENT_ID_TESTNET: string;
  export const POSTHOG_API_KEY: string;
  export const GIPHY_API_KEY: string;
  export const WALLET_CONNECT_PROJECT_ID: string;
}
