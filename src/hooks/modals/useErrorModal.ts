import useRootNavigator from 'hooks/navigation/useRootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Hook that displays an error modal and allow the user to retry the
 * failed operation.
 */
const useErrorModal = () => {
  const { t } = useTranslation('common');
  const navigation = useRootNavigator();

  return React.useCallback(
    (message: string, retryAction: () => void) => {
      navigation.navigate(ROUTES.CONFIRM_MODAL, {
        title: t('error'),
        subtitle: message,
        primaryButtonLabel: t('retry'),
        onPressPrimary: retryAction,
      });
    },
    [navigation, t],
  );
};

export default useErrorModal;
