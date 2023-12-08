import { Web3AuthLoginProvider } from 'types/web3auth';

export enum WalletPickerMode {
  Mnemonic,
  Ledger,
  Web3Auth,
}

interface BaseWalletPickerParams {
  readonly mode: WalletPickerMode;
  readonly addressPrefix: string;
  /**
   * List of addresses that shouldn't be displayed in the
   * list.
   */
  readonly ignoreAddresses?: string[];
}

interface WalletPickerWeb3AuthParams extends BaseWalletPickerParams {
  readonly mode: WalletPickerMode.Web3Auth;
  readonly loginProvider: Web3AuthLoginProvider;
  readonly privateKey: Uint8Array;
}

export type AccountPickerParams = WalletPickerWeb3AuthParams;
