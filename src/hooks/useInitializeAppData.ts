import {useQuery} from '@apollo/client';
import EnvConfig from 'config/EnvConfig';
import React from 'react';
import * as RNLocalize from 'react-native-localize';
import {useSetRecoilState} from 'recoil';
import appSettingsState from '@recoil/settings';
import {useGetProfileParams} from '@recoil/profileParams';
import {initializeAxiosInstance} from 'services/axios';
import {useGetButterConfig} from '@recoil/butterConfigState';
import GetRegisteredReactions from 'services/graphql/queries/GetRegisteredReactions';
import {useInitializePostParams} from '@recoil/postParamsState';
import GetRegisteredReports from 'services/graphql/queries/GetRegisteredReports';

const useInitializeAppData = () => {
  const setAppSettings = useSetRecoilState(appSettingsState);
  const {data: registeredReactions, loading: registeredReactionsLoading} =
    useQuery(GetRegisteredReactions, {
      variables: {
        subspaceID: EnvConfig.APP_SUBSPACE_ID,
      },
    });

  const {data: registeredReports, loading: registeredReportsLoading} = useQuery(
    GetRegisteredReports,
    {
      variables: {
        subspaceID: EnvConfig.APP_SUBSPACE_ID,
      },
    },
  );
  const profileParams = useGetProfileParams();
  useInitializePostParams();

  const {getButterConfig} = useGetButterConfig();

  // Not the most elegant way, but it will do for now
  React.useEffect(() => {
    Promise.all([initializeAxiosInstance(), getButterConfig()]).then(() => {
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
      !registeredReactionsLoading
    ) {
      setAppSettings(prev => ({
        ...prev,
        // temporary timezone setting
        currentTimezone: RNLocalize.getTimeZone(),
        registeredReactions: registeredReactions?.subspace_registered_reaction,
        registeredReports: registeredReports?.subspace_report_reason,
        dataInitialized: true,
      }));
    }
  }, [profileParams, registeredReactions, registeredReports]);
};

export default useInitializeAppData;
