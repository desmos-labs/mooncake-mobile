import React from 'react';
import { validateMnemonic } from 'lib/ValidationUtils';
import { sanitizeMnemonic } from 'lib/FormatUtils';
import { MNEMONIC_INPUT_MODE, NavProps } from 'screens/MnemonicInput';
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';
import useSelectAccount from 'hooks/useSelectAccount';
import { WalletPickerMode } from 'screens/SelectAccount/components/AccountPicker/types';
import { useImportAccountState } from '@recoil/screens/importAccountState';

export interface FormField {
  /**
   * Mnemonic inserted from the user.
   */
  mnemonic: string;
}

/**
 * Hooks for the MnemonicInput screen
 */
const useHooks = () => {
  const {
    params: { mode },
  } = useRoute<NavProps['route']>();
  const { t } = useTranslation('mnemonicInput');
  const selectAccount = useSelectAccount();
  const importAccountState = useImportAccountState()!;

  const initialFormFields = React.useMemo<FormField>(
    () => ({
      mnemonic: '',
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
  }, [mode, t]);

  const validateForm = React.useCallback(
    (values: FormField) => {
      const errors: any = {};

      if (!validateMnemonic(sanitizeMnemonic(values.mnemonic))) {
        errors.mnemonic = t('invalidMnemonic');
      }

      return errors;
    },
    [t],
  );

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
    [importAccountState, mode, selectAccount],
  );

  const buttonText = React.useMemo(() => {
    if (mode === MNEMONIC_INPUT_MODE.IMPORT_RECOVERY_PHRASE) {
      return t('common:next');
    }
    return t('common:confirm');
  }, [mode, t]);

  return {
    headerText,
    buttonText,
    onSubmit,
    validateForm,
    initialFormFields,
  };
};

export default useHooks;
