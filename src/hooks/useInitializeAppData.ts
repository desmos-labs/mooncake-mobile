import React from 'react';
import * as RNLocalize from 'react-native-localize';
import {useSetRecoilState} from 'recoil';
import appSettingsState from '@recoil/settings';
import {useGetProfileParams} from '@recoil/profileParams';

const useInitializeAppData = () => {
  const setAppSettings = useSetRecoilState(appSettingsState);

  const profileParams = useGetProfileParams();

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
