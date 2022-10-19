import {useQuery} from '@apollo/client';
import EnvConfig from 'config/EnvConfig';
import useActiveAccount from 'hooks/useActiveAccount';
import React from 'react';
import {atom, useSetRecoilState} from 'recoil';
import GetAppConnectedByUser from 'services/graphql/queries/GetAppConnectedByUser';

export const connectedAppsState = atom<ConnectedApps[]>({
  key: 'connectedApps',
  default: [],
});

/**
 * Get the list of followed accounts for the active account
 */
export const useGetConnectedAppsPolling = () => {
  const {activeAddress} = useActiveAccount();
  const setConnectedApps = useSetRecoilState(connectedAppsState);

  const {data} = useQuery<ConnectedAppsQueryData>(GetAppConnectedByUser, {
    variables: {
      address: activeAddress,
    },
    pollInterval: EnvConfig.POLLING_INTERVAL,
    fetchPolicy: 'no-cache',
  });

  React.useEffect(() => {
    if (!data) return;
    setConnectedApps(data.application_link);
  }, [data]);
};
