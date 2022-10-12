import Config from 'react-native-config';

const EnvConfig = {
  MMKV_ID: Config.MMKV_ID,
  GQL_ENDPOINT: {
    forbole: Config.FORBOLE_GQL,
    desmos: Config.DESMOS_GQL,
  },
  CHAIN_ID: Config.CHAIN_ID,
  FEE_GRANTER: Config.FEE_GRANTER,
  DESMOS_RPC: Config.DESMOS_RPC,
  // temporary way to keep track of base denoms for transactions on the
  // desmos chain
  BASE_DENOM: Config.BASE_DENOM,
  MAX_COMMENT_LENGTH: 500,
  DESMOS_REST: Config.DESMOS_REST,
  APP_SUBSPACE_ID: 5,
  POLLING_INTERVAL: 2000,
};

export default EnvConfig;
