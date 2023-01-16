import {DesmosMainnet} from '@desmoslabs/desmjs';
import {DesmosTestnet} from '@desmoslabs/desmjs/build/types/chains';
import EnvConfig from 'config/EnvConfig';
import React from 'react';
import * as RNLocalize from 'react-native-localize';
import {useSetRecoilState} from 'recoil';
import appSettingsState from '@recoil/settings';
import {profileParamsState} from '@recoil/profileParams';
import {useButterConfig} from '@recoil/butterConfigState';
import {postParamsState} from '@recoil/postParamsState';
import {useInitializeAxios} from 'services/axios';
import {useLazyQuery} from '@apollo/client';
import GetSubspaceConfig from 'services/graphql/queries/GetSubspaceConfig';
import _ from 'lodash';
import GetDesmosParams from 'services/graphql/queries/GetDesmosParams';

const useInitializeAppData = () => {
  const setAppSettings = useSetRecoilState(appSettingsState);
  const setProfileParams = useSetRecoilState(profileParamsState);
  const setPostParams = useSetRecoilState(postParamsState);
  useInitializeAxios();

  const [getSubspaceConfig] = useLazyQuery(GetSubspaceConfig, {
    variables: {
      subspaceID: String(EnvConfig.APP_SUBSPACE_ID),
    },
    fetchPolicy: 'no-cache',
  });

  const [getDesmosParams] = useLazyQuery(GetDesmosParams, {
    fetchPolicy: 'no-cache',
  });

  // this will also fetch butterConfig for the first time as it is undefined
  useButterConfig();

  // Not the most elegant way, but it will do for now
  React.useEffect(() => {
    const initAppData = async () => {
      const desmosParams = await getDesmosParams();

      const [appConfig] = await Promise.all([getSubspaceConfig()]);

      const {subspace_report_reason, subspace_registered_reaction, contract} =
        appConfig.data;
      const _postParams = _.get(desmosParams.data, 'posts_params.[0].params');
      const _profileParams = _.get(
        desmosParams.data,
        'profiles_params.[0].params',
      );

      setProfileParams(_profileParams);
      setPostParams(_postParams);
      setAppSettings(prev => ({
        ...prev,
        // temporary timezone setting
        currentTimezone: RNLocalize.getTimeZone(),
        registeredReactions: subspace_registered_reaction,
        registeredReports: subspace_report_reason,
        contractsConfig: contract,
        dataInitialized: true,
        currentChain:
          EnvConfig.CHAIN === 'mainnet' ? DesmosMainnet : DesmosTestnet,
      }));
    };

    initAppData();
  }, []);
};

export default useInitializeAppData;
