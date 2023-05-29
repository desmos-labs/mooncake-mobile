/* It's fine to disable the next line warning as the module is declared anyway */
/* eslint-disable import/no-unresolved */
import {
  APP_SUBSPACE_ID,
  BUTTER_GQL,
  BUTTER_REST,
  DESMOS_GQL,
  DEV_MNEMONIC,
  FORBOLE_GQL,
  POSTHOG_API_KEY,
  SENTRY_AUTH_TOKEN,
  SENTRY_DSN,
  WEB3_AUTH_CLIENT_ID_MAINNET,
  WEB3_AUTH_CLIENT_ID_TESTNET,
} from '@env';

const EnvConfig = {
  GQL_ENDPOINT: {
    forbole: FORBOLE_GQL,
    desmos: DESMOS_GQL,
    butter: BUTTER_GQL,
  },
  BUTTER_REST,
  SENTRY_DSN,
  SENTRY_AUTH_TOKEN,
  APP_SUBSPACE_ID,
  DEV_MNEMONIC,
  WEB3_AUTH_CLIENT_ID_MAINNET,
  WEB3_AUTH_CLIENT_ID_TESTNET,
  POSTHOG_API_KEY,
};

console.log(EnvConfig);

export default EnvConfig;
