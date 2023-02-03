import { WalletType } from 'types/wallet';
import { AccountWithWallet } from 'types/account';
import { SupportedChain } from 'types/chains';
import { LedgerApp } from 'types/ledger';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

export interface ImportAccountState {
  /**
   * Chains from which the account can be imported.
   */
  readonly chains: SupportedChain[];
  /**
   * List of addresses that should be ignored while presenting the list of address
   * to the user.
   */
  readonly ignoreAddresses: string[];
  /**
   * Tells if should be displayed the balance of the address.
   */
  readonly showBalances: boolean;
  /**
   * Tells the minimum amount of tokens that the account must have to be selected.
   * If zero or undefined any account can be selected.
   */
  readonly minAccountBalance: number | undefined;
  /**
   * Function called after the user have selected the account that want to import.
   */
  readonly onSuccess: (data: { account: AccountWithWallet; chain: SupportedChain }) => any;
  /**
   * Function called if the user cancel the import flow.
   */
  readonly onCancel: () => any;
  /**
   * Chain selected from the user.
   */
  readonly selectedChain?: SupportedChain;
  /**
   * Import mode selected from the user.
   */
  readonly importMode?: WalletType;
  /**
   * User mnemonic.
   */
  readonly mnemonic?: string;
  /**
   * Ledger app selected from the user.
   */
  readonly ledgerApp?: LedgerApp;
}

/**
 * Atom that contains the import account state.
 */
const importAccountAppState = atom<ImportAccountState | undefined>({
  key: 'importAccountState',
  default: undefined,
});

/**
 * Hook that provides a function to update the import account state.
 */
export const useSetImportAccountState = () => useSetRecoilState(importAccountAppState);

/**
 * Hook that provides the import account state.
 */
export const useImportAccountState = () => useRecoilValue(importAccountAppState);
