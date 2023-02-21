import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { SupportedChain } from 'types/chains';
import { WalletType } from 'types/wallet';
import { useSetImportAccountState } from '@recoil/screens/importAccountState';
import { SelectedAccount } from 'types/account';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';

export interface ImportAccountOptions {
  /**
   * List of chain from which the account can be imported.
   * If the length of the list is 1, the chain selection screen will be
   * skipped.
   */
  chains: SupportedChain[];
  /**
   * Tells if should be displayed the balance of the address.
   * If undefined will be considered as false.
   */
  showBalances?: boolean;
  /**
   * Tells the minimum amount of tokens that the account must have to be selected.
   * If zero or undefined any account can be selected.
   */
  minAccountBalance?: number;
  /**
   * Defines the type of account to import, if this is undefined will be displayed the
   * account type selection screen.
   */
  accountType?: WalletType;
  /**
   * List of addresses that will be ignored during the generation to prevent the
   * import of a duplicate addresses.
   */
  ignoreAddresses?: string[];
}

export interface ImportAccountCallbacks {
  onSelect: (account: SelectedAccount, chain: SupportedChain) => any;
  onCancel?: () => any;
}

/**
 * Hook that provides a function to start the flow to import an account.
 * The flow is:
 * 1. Select chain, if options.chains len is === 1 this screen will be skipped;
 * 2. Select the import mode, if options.accountType !== undefined
 * this screen will be skipped;
 *
 * Since the import mode can be different from here the flow have some
 * ramifications.
 *
 * Case Mnemonic:
 * 3a. Input the mnemonic;
 * 4a. Show the list of addresses from which the user can select the account
 * to import.
 *
 * Case Ledger:
 * 3b. Select the Ledger app that be used to connect to the selected chain;
 * 4b. Connect to Ledger;
 * 5b. Show the list of addresses from which the user can select the account
 * to import.
 *
 * Case Web3Auth:
 * 3b. Select the login provider;
 * 4b. Display the account that can be imported.
 *
 * @param options - Import account options.
 */
const useImportAccount = (options: ImportAccountOptions) => {
  const navigation = useNavigation<NavigationProp<RootNavigatorParamList>>();
  const setImportAccountState = useSetImportAccountState();

  return React.useCallback(
    ({ onSelect, onCancel }: ImportAccountCallbacks) => {
      const selectedChain: SupportedChain | undefined =
        options.chains.length === 1 ? options.chains[0] : undefined;
      const onCancelFunction = onCancel ?? (() => {});

      // Set the import account state according to the provided options.
      setImportAccountState({
        chains: options.chains,
        ignoreAddresses: options.ignoreAddresses ?? [],
        importMode: options.accountType,
        selectedChain,
        onSuccess: account => onSelect(account.account, account.chain),
        onCancel: onCancelFunction,
      });

      if (selectedChain === undefined) {
        navigation.navigate(ROUTES.IMPORT_ACCOUNT_SELECT_CHAIN);
        return;
      }

      if (options.accountType === undefined) {
        navigation.navigate(ROUTES.IMPORT_ACCOUNT_SELECT_MODE);
      } else {
        switch (options.accountType) {
          case WalletType.Mnemonic:
            navigation.navigate(ROUTES.IMPORT_ACCOUNT_MNEMONIC_INPUT);
            break;
          case WalletType.Ledger:
            navigation.navigate(ROUTES.IMPORT_ACCOUNT_SELECT_LEDGER_APP);
            break;
          case WalletType.Web3Auth:
            // TODO: Implement navigation to web3auth login provider selection.
            console.warn('Import with Web3Auth not supported');
            onCancelFunction();
            break;
        }
      }
    },
    [navigation, options, setImportAccountState],
  );
};

export default useImportAccount;
