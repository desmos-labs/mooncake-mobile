import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SIGNUP>;

const useHooks = () => {
  const {navigate} = useNavigation<NavProps['navigation']>();
  const {t} = useTranslation('passwordManipulation');

  const initialFormValues = {
    dTag: '',
    newPassword: '',
    confirmPassword: '',
    consent: false,
  };

  const handleFormSubmit = React.useCallback(
    (formValues: typeof initialFormValues) => {
      console.log(formValues);

      navigate(ROUTES.BROADCAST_TX);
    },
    [],
  );

  const openInfoModal = useCallback(() => {
    navigate(ROUTES.TEXTONLY_MODAL, {
      title: t('signup:profile dtag'),
      body: t('signup:dtag info'),
    });
  }, []);

  const validateForm = useCallback((values: typeof initialFormValues) => {
    const errors: any = {};

    if (!values.consent) {
      errors.consent = t('consent not checked');
    }

    return errors;
  }, []);

  const handlePressPP = useCallback(() => {
    // go to Privacy policy page
  }, []);

  const handlePressTOS = useCallback(() => {
    // go to Terms of Service page
  }, []);

  return {
    handlePressPP,
    handlePressTOS,
    handleFormSubmit,
    openInfoModal,
    validateForm,
    initialFormValues,
  };
};

export default useHooks;
