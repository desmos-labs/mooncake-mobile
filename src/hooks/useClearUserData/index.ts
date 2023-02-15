import React from 'react';
import { clearMMKV } from 'lib/MMKVStorage';
import { resetSecureStorage } from 'lib/SecureStorage';
import { useNavigation } from '@react-navigation/native';
import ROUTES from 'navigation/routes';
import { useTranslation } from 'react-i18next';

/**
 * A hook that clears all persisted user data and resets the navigation stack
 * to the Landing page.
 */
const useClearUserData = () => {
  const { navigate, pop, reset } = useNavigation<any>();

  const { t } = useTranslation('forgotPassword');

  const handleConfirmReset = React.useCallback(async () => {
    clearMMKV();
    await resetSecureStorage();

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
      title: t('forgotPw'),
      subtitle: t('description'),
      primaryButtonLabel: t('common:confirm'),
      secondaryButtonLabel: t('common:cancel'),
      onPressPrimary: handleConfirmReset,
      onPressSecondary: pop,
    });
  }, [handleConfirmReset, navigate, pop, t]);
};

export default useClearUserData;
