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

    try {
      if (bearerToken) {
        console.log('Restoring bearer token');
        axiosInstance.defaults.headers.common = {
          Authorization: `Bearer ${bearerToken}`,
        };

        await RefreshSession();

        const notificationsToken = await messaging().getToken();
        await PostNotificationToken(notificationsToken.toString());
      } else {
        throw new Error('No bearer token found');
      }
    } catch (err: any) {
      console.error(err);
      replace(ROUTES.LOGIN);
    }
  }, []);

  return {
    refreshSession,
  };
};

export default useRefreshSession;
