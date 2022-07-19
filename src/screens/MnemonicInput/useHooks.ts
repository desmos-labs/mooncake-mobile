import React from 'react';
import {validateMnemonic} from 'lib/ValidationUtils';
import {sanitizeMnemonic} from 'lib/FormatUtils';
import ROUTES from 'navigation/routes';
import {PASSWORD_MANIPULATION_MODE} from 'screens/PasswordManipulation';
import {MNEMONIC_INPUT_MODE, NavProps} from 'screens/MnemonicInput';
import {useTranslation} from 'react-i18next';
import {useNavigation, useRoute} from '@react-navigation/native';

/**
 * Hooks for the MnemonicInput screen
 */
const useHooks = () => {
  const {
    params: {mode},
  } = useRoute<NavProps['route']>();
  const {navigate} = useNavigation<NavProps['navigation']>();

  const {t} = useTranslation('mnemonicInput');

  const initialFormFields = React.useMemo(
    () => ({
      mnemonic: '',
      consent: mode !== MNEMONIC_INPUT_MODE.IMPORT_RECOVERY_PHRASE,
    }),
    [mode],
  );

  const headerText = React.useMemo(() => {
    switch (mode) {
      case MNEMONIC_INPUT_MODE.RESET_PASSWORD:
        return 'forgotPw';
      case MNEMONIC_INPUT_MODE.IMPORT_RECOVERY_PHRASE:
        return 'importMnemonic';
      default:
        return '';
    }
  }, [mode]);

  const validateForm = React.useCallback((values: typeof initialFormFields) => {
    const errors: any = {};

    if (!validateMnemonic(sanitizeMnemonic(values.mnemonic))) {
      errors.mnemonic = t('invalidMnemonic');
    }

    if (!values.consent) {
      errors.consent = 'Consent not checked';
    }

    // Additionally, check if the mnemonic matches that of the wallet depending on
    // mode (future feature)

    return errors;
  }, []);

  const onSubmit = React.useCallback(
    (values: typeof initialFormFields) => {
      console.log(values);

      if (mode === MNEMONIC_INPUT_MODE.RESET_PASSWORD) {
        navigate(ROUTES.PASSWORD_MANIPULATION, {
          mode: PASSWORD_MANIPULATION_MODE.RESET_PASSWORD,
        });
      }
    },
    [mode],
  );

  const buttonText = React.useMemo(() => {
    if (mode === MNEMONIC_INPUT_MODE.IMPORT_RECOVERY_PHRASE) {
      return 'common:next';
    }
    return 'common:confirm';
  }, [mode]);

  const handlePressPP = React.useCallback(() => {
    // go to Privacy policy page
  }, []);

  const handlePressTOS = React.useCallback(() => {
    // go to Terms of Service page
  }, []);

  return {
    headerText,
    buttonText,
    handlePressPP,
    handlePressTOS,
    onSubmit,
    validateForm,
    initialFormFields,
  };
};

export default useHooks;
