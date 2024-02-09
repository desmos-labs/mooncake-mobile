/* It's fine to disable the next line warning as the module is declared anyway */
/* eslint-disable import/no-unresolved */
import {
  APP_SUBSPACE_ID,
  GIPHY_API_KEY,
  POSTHOG_API_KEY,
  SENTRY_AUTH_TOKEN,
  SENTRY_DSN,
  WEB3_AUTH_CLIENT_ID_MAINNET,
  WEB3_AUTH_CLIENT_ID_TESTNET,
  WALLET_CONNECT_PROJECT_ID,
} from '@env';

const EnvConfig = {
  SENTRY_DSN,
  SENTRY_AUTH_TOKEN,
  APP_SUBSPACE_ID,
  WEB3_AUTH_CLIENT_ID_MAINNET,
  WEB3_AUTH_CLIENT_ID_TESTNET,
  POSTHOG_API_KEY,
  GIPHY_API_KEY,
  WALLET_CONNECT_PROJECT_ID,
};

export default EnvConfig;
