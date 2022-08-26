import React from 'react';
import * as RNLocalize from 'react-native-localize';
import {useSetRecoilState} from 'recoil';
import appSettingsState from '@recoil/settings';
import {useGetProfileParams} from '@recoil/profileParams';
import {initializeAxiosInstance} from 'services/axios';
import {useGetButterConfig} from '@recoil/butterConfigState';

const useInitializeAppData = () => {
  const setAppSettings = useSetRecoilState(appSettingsState);

  const profileParams = useGetProfileParams();

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
    if (profileParams) {
      setAppSettings(prev => ({
        ...prev,
        // temporary timezone setting
        currentTimezone: RNLocalize.getTimeZone(),
        dataInitialized: true,
      }));
    }
  }, [profileParams]);
};

export default useInitializeAppData;
