import notifee, {AuthorizationStatus} from '@notifee/react-native';
import appSettingsState from '@recoil/settings';
import {useCallback, useEffect} from 'react';
import {useRecoilState} from 'recoil';

const useRequestNotificationsPermission = () => {
  const [settings, setSettings] = useRecoilState(appSettingsState);

  const requestUserPermission = useCallback(async () => {
    try {
      const notifeeAuth = await notifee.requestPermission();

      if (notifeeAuth.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
        setSettings({...settings, notificationsPermission: true});
      }
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  useEffect(() => {
    requestUserPermission().then(() => console.log('Permissions requested'));
  }, []);
};

export default useRequestNotificationsPermission;
