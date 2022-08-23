import React from 'react';
import {useSetRecoilState} from 'recoil';
import appSettingsState from '@recoil/settings';
import {useGetProfileParams} from '@recoil/profileParams';
import {initializeAxiosInstance} from 'services/axios';
import {useInitializeButterConfig} from '@recoil/butterConfigState';

const useInitializeAppData = () => {
  const setAppSettings = useSetRecoilState(appSettingsState);

  const profileParams = useGetProfileParams();

  // initialize butter config
  useInitializeButterConfig();

  React.useEffect(() => {
    // initialize axios
    initializeAxiosInstance();
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
        dataInitialized: true,
      }));
    }
  }, [profileParams]);
};

export default useInitializeAppData;
