/* It's fine to disable the next line warning as the module is declared anyway */
/* eslint-disable import/no-unresolved */
import {
  APP_SUBSPACE_ID,
  BUTTER_GQL,
  BUTTER_REST,
  DESMOS_GQL,
  DEV_MNEMONIC,
  FORBOLE_GQL,
} from '@env';

const EnvConfig = {
  GQL_ENDPOINT: {
    forbole: FORBOLE_GQL,
    desmos: DESMOS_GQL,
    butter: BUTTER_GQL,
  },
  BUTTER_REST,
  APP_SUBSPACE_ID,
  DEV_MNEMONIC,
};

export default EnvConfig;
