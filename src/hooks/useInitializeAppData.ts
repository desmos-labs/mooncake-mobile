import React from 'react';
import {useSetRecoilState} from 'recoil';
import appSettingsState from '@recoil/settings';
import {useGetProfileParams} from '@recoil/profileParams';

const useInitializeAppData = () => {
  const setAppSettings = useSetRecoilState(appSettingsState);

  const profileParams = useGetProfileParams();

  /**
   * Check if the initialization queries have produced a value and mark
   * initialization as finished.
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
