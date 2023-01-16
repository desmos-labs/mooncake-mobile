import {
  selector,
  useRecoilRefresher_UNSTABLE,
  useRecoilValueLoadable,
} from 'recoil';
import GetConfig from 'services/graphql/queries/GetConfig';
import client from 'services/graphql/client';

export interface ButterConfigState {
  // Desmos address of the account used by the APIs
  desmos_address: string;
  ibc: any;
}

/**
 * A recoil atom used to store the config details of the Butter app, retrieved
 * from API
 */
const butterConfigState = selector<ButterConfigState>({
  key: 'chainConfig',
  get: async () => {
    const {data} = await client.query({query: GetConfig});

    return data.config as ButterConfigState;
  },
});

/**
 * A hook that exposes the butterConfig recoil state, as well as an update function
 * to manually update the atom.
 */
export const useButterConfig = () => {
  const butterConfig = useRecoilValueLoadable(butterConfigState);

  const refetchButterConfig = useRecoilRefresher_UNSTABLE(butterConfigState);

  return {
    butterConfig:
      butterConfig.state === 'hasValue'
        ? butterConfig.contents
        : ({} as ButterConfigState),
    refetchButterConfig,
  };
};
