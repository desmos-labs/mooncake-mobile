import { Account, MnemonicAccount, Web3AuthAccount } from 'types/account';
import { WalletType } from 'types/wallet';

/**
 * Function that tells if the account have a private key.
 * @param account - The account to check.
 */
export const isAccountWithPrivateKey = (
  account: Account,
): account is MnemonicAccount | Web3AuthAccount => {
  return account.walletType === WalletType.Mnemonic || account.walletType === WalletType.Web3Auth;
};
