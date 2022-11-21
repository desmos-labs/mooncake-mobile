import {useCallback} from 'react';
import {getMMKV, MMKVKEYS} from 'lib/MMKVStorage';
import axiosInstance from 'services/axios';
import RefreshSession from 'services/axios/requests/RefreshSession';
import ROUTES from 'navigation/routes';
import {useNavigation} from '@react-navigation/native';

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
      } else {
        throw new Error('No bearer token found');
      }
    } catch (err) {
      replace(ROUTES.LOGIN);
    }
  }, []);

  return {
    refreshSession,
  };
};

export default useRefreshSession;
