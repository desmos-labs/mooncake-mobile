import Config from 'react-native-config';

const EnvConfig = {
  MMKV_ID: Config.MMKV_ID,
  GQL_ENDPOINT: {
    forbole: Config.FORBOLE_GQL,
    desmos: Config.DESMOS_GQL,
  },
  CHAIN_ID: Config.CHAIN_ID,
  FEE_GRANTER: Config.FEE_GRANTER,
};

export default EnvConfig;
