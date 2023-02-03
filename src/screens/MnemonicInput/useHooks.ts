import React from 'react';
import { validateMnemonic } from 'lib/ValidationUtils';
import { sanitizeMnemonic } from 'lib/FormatUtils';
import { MNEMONIC_INPUT_MODE, NavProps } from 'screens/MnemonicInput';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import useSelectAccount from 'hooks/useSelectAccount';
import { WalletPickerMode } from 'screens/SelectAccount/components/AccountPicker/types';
import { useImportAccountState } from '@recoil/importAccountState';

export interface FormField {
  /**
   * Mnemonic inserted from the user.
   */
  mnemonic: string;
  /**
   * Tells if the user have accepted the Terms of Service and the Privacy Polices.
   */
  consent: boolean;
}

/**
 * Hooks for the MnemonicInput screen
 */
const useHooks = () => {
  const {
    params: { mode },
  } = useRoute<NavProps['route']>();
  const { navigate } = useNavigation<NavProps['navigation']>();
  const { t } = useTranslation('mnemonicInput');
  const selectAccount = useSelectAccount();
  const importAccountState = useImportAccountState()!;

  const initialFormFields = React.useMemo<FormField>(
    () => ({
      mnemonic: '',
      // only ask for consent if in import mode
      consent: mode !== MNEMONIC_INPUT_MODE.IMPORT_RECOVERY_PHRASE,
    }),
    [mode],
  );

  const headerText = React.useMemo(() => {
    switch (mode) {
      case MNEMONIC_INPUT_MODE.RESET_PASSWORD:
        return t('forgotPw');
      case MNEMONIC_INPUT_MODE.IMPORT_RECOVERY_PHRASE:
        return t('importMnemonic');
      default:
        return '';
    }
  }, [mode]);

  const validateForm = React.useCallback((values: FormField) => {
    const errors: any = {};

    if (!validateMnemonic(sanitizeMnemonic(values.mnemonic))) {
      errors.mnemonic = t('invalidMnemonic');
    }

    if (!values.consent) {
      errors.consent = t('consent not checked');
    }

    return errors;
  }, []);

  const onSubmit = React.useCallback(
    (values: typeof initialFormFields) => {
      if (mode === MNEMONIC_INPUT_MODE.RESET_PASSWORD) {
        // TODO: Implement reset password logic.
        console.warn('Implement Reset password');
      } else if (mode === MNEMONIC_INPUT_MODE.IMPORT_RECOVERY_PHRASE) {
        // Go to import account screen.
        selectAccount(
          {
            mode: WalletPickerMode.Mnemonic,
            addressPrefix: importAccountState.selectedChain!.prefix,
            mnemonic: sanitizeMnemonic(values.mnemonic),
            ignoreAddresses: importAccountState.ignoreAddresses,
            masterHdPath: importAccountState!.selectedChain!.masterHDPath!,
          },
          {
            onSuccess: account => {
              importAccountState!.onSuccess({ account, chain: importAccountState!.selectedChain! });
            },
          },
        );
      }
    },
    [mode],
  );

  const buttonText = React.useMemo(() => {
    if (mode === MNEMONIC_INPUT_MODE.IMPORT_RECOVERY_PHRASE) {
      return t('common:next');
    }
    return t('common:confirm');
  }, [mode]);

  const handlePressPrivacyPolicy = React.useCallback(() => {
    // TODO: Implement Privacy policy visualization.
    console.warn('Implement Privacy policy visualization.');
  }, []);

  const handlePressTermOfService = React.useCallback(() => {
    // TODO: Implement Term of Service visualization.
    console.warn('Implement Term of Service visualization.');
  }, []);

  return {
    headerText,
    buttonText,
    handlePressPrivacyPolicy,
    handlePressTermOfService,
    onSubmit,
    validateForm,
    initialFormFields,
  };
};

export default useHooks;
