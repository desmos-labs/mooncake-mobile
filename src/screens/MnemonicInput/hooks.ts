import React from 'react';
import { validateMnemonic } from 'lib/ValidationUtils';
import { sanitizeMnemonic } from 'lib/FormatUtils';
import { useTranslation } from 'react-i18next';
import useSelectAccount from 'hooks/useSelectAccount';
import { WalletPickerMode } from 'screens/ImportAccountSelectAccount/components/AccountPicker/types';
import { useImportAccountState } from '@recoil/screens/importAccountState';

export interface FormField {
  /**
   * Mnemonic inserted from the user.
   */
  mnemonic: string;
}

/**
 * Hook that allows to get the initial field values of the mnemonic input form.
 */
export const useInitialFormFields = () => {
  return React.useMemo(
    () =>
      ({
        mnemonic: '',
      } as FormField),
    [],
  );
};

/**
 * Hook that allows to validate the mnemonic input form.
 */
export const useValidateForm = () => {
  const { t } = useTranslation('mnemonicInput');
  return React.useCallback(
    (values: FormField) => {
      const errors: any = {};

      if (!validateMnemonic(sanitizeMnemonic(values.mnemonic))) {
        errors.mnemonic = t('invalidMnemonic');
      }

      return errors;
    },
    [t],
  );
};

/**
 * Hooks for the MnemonicInput screen
 */
export const useOnSubmit = () => {
  const selectAccount = useSelectAccount();
  const importAccountState = useImportAccountState()!;

  return React.useCallback(
    (values: FormField) => {
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
    },
    [importAccountState, selectAccount],
  );
};
