import React from 'react';
import axiosInstance from 'services/axios';
import {useNavigation} from '@react-navigation/native';
import ROUTES from 'navigation/routes';
import {useToast} from 'react-native-toast-notifications';
import ToastConfig from 'config/ToastConfig';

/**
 * Refresh the user's token validity
 * @deprecated Use useRefreshSession hook instead.
 */
const RefreshSession = async () => {
  const _response = await axiosInstance.post('/session');

  if (_response.status !== 200) {
    throw new Error(
      `There was an issue refreshing the session:\n\n${JSON.stringify(
        _response.data,
      )}`,
    );
  } else {
    console.log('session refreshed');
  }
};

export const useRefreshSession = () => {
  const {navigate} = useNavigation<any>();
  const toast = useToast();

  const refreshSession = React.useCallback(async () => {
    try {
      await axiosInstance.post('/session');
    } catch (err: any) {
      // if any error occurs during session refresh, it's likely due to an issue
      // with the Bearer token. The easiest way to resolve this is to get a fresh
      // one by having the user login again.
      toast.show(
        t('toast:errorInvalidSession', {type: ToastConfig.ERROR_NO_RETRY}),
      );
      console.log('[RefreshSession]:', err.toString(), err.response.data);
      navigate(ROUTES.LOGIN);
    }
  }, [axiosInstance]);

  return {
    refreshSession,
  };
};

export default RefreshSession;
