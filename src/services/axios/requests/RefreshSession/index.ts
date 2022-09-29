import React from 'react';
import axiosInstance from 'services/axios';
import {useNavigation} from '@react-navigation/native';
import ROUTES from 'navigation/routes';
import {useToast} from 'react-native-toast-notifications';
import ToastConfig from 'config/ToastConfig';
import {useTranslation} from 'react-i18next';
import useAuthenticatedAPIRequest from 'hooks/useAuthenticatedAPIRequest';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';

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

type NavProps = StackScreenProps<RootNavigatorParamList, any>;

export const useRefreshSession = () => {
  const toast = useToast();
  const {navigate} = useNavigation<NavProps['navigation']>();
  const {t} = useTranslation();
  const authenticatedRequest = useAuthenticatedAPIRequest();

  const refreshSession = React.useCallback(async () => {
    return authenticatedRequest({
      request: () => axiosInstance.post('/session'),
      onErrorOverride: () => {
        navigate(ROUTES.LOGIN);
        toast.show(t('toast:errorInvalidSession'), {
          type: ToastConfig.ERROR_NO_RETRY,
        });
      },
    });
  }, [axiosInstance]);

  return {
    refreshSession,
  };
};

export default RefreshSession;
