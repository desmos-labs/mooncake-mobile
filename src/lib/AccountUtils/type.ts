import { Account, Web3AuthAccount } from 'types/account';
import { WalletType } from 'types/wallet';

/**
 * Function that tells if the account have a private key.
 * @param account - The account to check.
 */
const isAccountWithPrivateKey = (account: Account): account is Web3AuthAccount => {
  return account.walletType === WalletType.PrivateKey || account.walletType === WalletType.Web3Auth;
};

export default isAccountWithPrivateKey;
