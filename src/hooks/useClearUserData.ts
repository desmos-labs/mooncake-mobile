import { useNavigation } from '@react-navigation/native';
import { clearMMKV } from 'lib/MMKVStorage';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * A hook that clears all persisted user data and resets the navigation stack
 * to the Landing page.
 */
const useClearUserData = () => {
  const { t } = useTranslation('forgotPassword');

  const { navigate, pop, reset } = useNavigation<any>();

  const handleConfirmReset = React.useCallback(async () => {
    clearMMKV();

    reset({
      index: 0,
      routes: [
        {
          name: ROUTES.LANDING,
        },
      ],
    });
  }, [reset]);

  return React.useCallback(() => {
    navigate(ROUTES.CONFIRM_MODAL, {
      title: t('forgot password'),
      subtitle: t('description'),
      primaryButtonLabel: t('confirm', { ns: 'common' }),
      secondaryButtonLabel: t('cancel', { ns: 'common' }),
      onPressPrimary: handleConfirmReset,
      onPressSecondary: pop,
    });
  }, [handleConfirmReset, navigate, pop, t]);
};

export default useClearUserData;
