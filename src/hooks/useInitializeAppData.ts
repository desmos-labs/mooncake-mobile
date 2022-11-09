import {useQuery} from '@apollo/client';
import {DesmosMainnet} from '@desmoslabs/desmjs';
import {DesmosTestnet} from '@desmoslabs/desmjs/build/types/chains';
import EnvConfig from 'config/EnvConfig';
import React from 'react';
import * as RNLocalize from 'react-native-localize';
import {useSetRecoilState} from 'recoil';
import appSettingsState from '@recoil/settings';
import {useGetProfileParams} from '@recoil/profileParams';
import {useGetButterConfig} from '@recoil/butterConfigState';
import GetContractsConfig from 'services/graphql/queries/GetContractsConfig';
import GetRegisteredReactions from 'services/graphql/queries/GetRegisteredReactions';
import {useInitializePostParams} from '@recoil/postParamsState';
import GetRegisteredReports from 'services/graphql/queries/GetRegisteredReports';
import {useInitializeAxios} from 'services/axios';

const useInitializeAppData = () => {
  const setAppSettings = useSetRecoilState(appSettingsState);
  const {data: registeredReactions, loading: registeredReactionsLoading} =
    useQuery(GetRegisteredReactions, {
      variables: {
        subspaceID: EnvConfig.APP_SUBSPACE_ID,
      },
      fetchPolicy: 'no-cache',
    });

  const {data: registeredReports, loading: registeredReportsLoading} = useQuery(
    GetRegisteredReports,
    {
      variables: {
        subspaceID: EnvConfig.APP_SUBSPACE_ID,
      },
      fetchPolicy: 'no-cache',
    },
  );

  const {data: contractsConfig, loading: contractsConfigLoading} = useQuery(
    GetContractsConfig,
    {
      variables: {
        config: {
          subspace_id: EnvConfig.APP_SUBSPACE_ID,
        },
      },
      fetchPolicy: 'no-cache',
    },
  );

  const profileParams = useGetProfileParams();
  useInitializePostParams();
  useInitializeAxios();

  const {getButterConfig} = useGetButterConfig();

  // Not the most elegant way, but it will do for now
  React.useEffect(() => {
    Promise.all([getButterConfig()]).then(() => {
      console.log('app initialized');
    });
  }, []);

  /**
   * Check if the initialization queries have produced a value and mark
   * initialization as finished.
   *
   * This is a naive solution. There is most likely a better way to do this.
   */
  React.useEffect(() => {
    if (
      profileParams &&
      !registeredReportsLoading &&
      !registeredReactionsLoading &&
      !contractsConfigLoading
    ) {
      setAppSettings(prev => ({
        ...prev,
        // temporary timezone setting
        currentTimezone: RNLocalize.getTimeZone(),
        registeredReactions: registeredReactions?.subspace_registered_reaction,
        registeredReports: registeredReports?.subspace_report_reason,
        contractsConfig: contractsConfig?.contract,
        dataInitialized: true,
        currentChain:
          EnvConfig.CHAIN === 'mainnet' ? DesmosMainnet : DesmosTestnet,
      }));
    }
  }, [profileParams, registeredReactions, registeredReports, contractsConfig]);
};

export default useInitializeAppData;
