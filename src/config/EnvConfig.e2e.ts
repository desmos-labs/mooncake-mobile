import Config from 'react-native-config';

declare module 'react-native-config' {
  interface NativeConfig {
    MMKV_ID: string;
    GQL_ENDPOINT: {[index: string]: string};
    CHAIN: string;
    DESMOS_RPC: string;
    BASE_DENOM: string;
    MAX_COMMENT_LENGTH: number;
    BUTTER_REST: string;
    APP_SUBSPACE_ID: number;
    POLLING_INTERVAL: number;
    DEV_MNEMONIC: string;
  }
}

const EnvConfig = {
  MMKV_ID: Config.MMKV_ID,
  GQL_ENDPOINT: {
    forbole: 'http://localhost:4000',
    desmos: 'http://localhost:4000',
    butter: 'http://localhost:4000',
  },
  CHAIN: Config.CHAIN,
  DESMOS_RPC: Config.DESMOS_RPC,
  // temporary way to keep track of base denoms for transactions on the
  // desmos chain
  BASE_DENOM: Config.BASE_DENOM,
  MAX_COMMENT_LENGTH: 500,
  BUTTER_REST: Config.BUTTER_REST,
  APP_SUBSPACE_ID: 5,
  POLLING_INTERVAL: 2000,
  DEV_MNEMONIC: Config.DEV_MNEMONIC,
};

export default EnvConfig;
