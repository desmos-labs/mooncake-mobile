import messaging from '@react-native-firebase/messaging';
import { useCallback } from 'react';
import axiosInstance from 'services/axios';
import PostNotificationToken from 'services/axios/requests/PostNotificationToken';
import RefreshSession from 'services/axios/requests/RefreshSession';
import { useAppStateValue } from '@recoil/appState';
import { err, ok, Result } from 'neverthrow';
import useRedirectToLogin from 'hooks/useRedirectToLogin';

/**
 * A hook that restores axios bearer token and redirects the user to the login screen
 * if it is invalid or cannot be found.
 */
const useRefreshSession = () => {
  const bearerToken = useAppStateValue('bearerToken');
  const handleLogin = useRedirectToLogin();

  return useCallback(async (): Promise<Result<void, Error>> => {
    // Bearer token refresh
    if (!bearerToken) {
      // TODO: Probably, it's better to just do nothing here. We can always refresh later anyway
      return err(new Error('No bearer token found'));
    }

    axiosInstance.defaults.headers.common = {
      Authorization: `Bearer ${bearerToken}`,
    };

    try {
      // Refresh the session
      const refreshResult = await RefreshSession();
      if (refreshResult.isErr()) {
        return err(refreshResult.error);
      }

      // Refresh the notification token
      const notificationsToken = await messaging().getToken();
      if (notificationsToken) {
        const postNotificationResult = await PostNotificationToken(notificationsToken);
        if (postNotificationResult.isErr()) {
          return err(postNotificationResult.error);
        }
      }

      // Return the ok result
      return ok(undefined);
    } catch (error: any) {
      handleLogin();
      return ok(undefined);
    }
  }, [bearerToken]);
};

export default useRefreshSession;
