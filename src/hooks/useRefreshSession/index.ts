import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';
import {getMMKV, MMKVKEYS} from 'lib/MMKVStorage';
import ROUTES from 'navigation/routes';
import {useCallback} from 'react';
import axiosInstance from 'services/axios';
import PostNotificationToken from 'services/axios/requests/PostNotificationToken';
import RefreshSession from 'services/axios/requests/RefreshSession';

/**
 * A hook that restores axios bearer token and redirects the user to the login screen
 * if it is invalid or cannot be found.
 */
const useRefreshSession = () => {
  const {replace} = useNavigation<any>();

  const refreshSession = useCallback(async () => {
    const bearerToken = getMMKV(MMKVKEYS.REST_AUTH_TOKEN);

    // Bearer token refresh
    try {
      if (bearerToken) {
        console.log('Restoring bearer token');
        axiosInstance.defaults.headers.common = {
          Authorization: `Bearer ${bearerToken}`,
        };

        await RefreshSession();

        const notificationsToken = await messaging().getToken();
        if (notificationsToken) {
          await PostNotificationToken(notificationsToken);
        }
      } else {
        throw new Error('No bearer token found');
      }
    } catch (err: any) {
      console.error('REFRESH SESSION ERROR', err.toJSON());
      replace(ROUTES.LOGIN);
    }

    // Notifications token refresh
    try {
      console.log('Obtaining notifications token');
      const notificationsToken = await messaging().getToken();
      await PostNotificationToken(notificationsToken.toString());
      console.log('Posted notifications token');
    } catch (err: any) {
      console.error('NOTIFICATIONS TOKEN', err);
    }
  }, []);

  return {
    refreshSession,
  };
};

export default useRefreshSession;
