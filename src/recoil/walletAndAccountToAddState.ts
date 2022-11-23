import {atom} from 'recoil';
import {ChainAccount} from 'types/chains';

type WalletAndAccountToAddState = {
  accountWithWalletData: {
    chainAccount: ChainAccount;
    /**
     * serialized wallet data
     */
    wallet?: string;
  };
  mnemonic?: string;
  password?: string;
};

/**
 * An atom to persist values across screens during account creation.
 * Currently, it is only used to add a new chain account during the add profile phase
 */
const walletAndAccountToAddState = atom<WalletAndAccountToAddState>({
  key: 'walletAndAccountToAdd',
  default: undefined,
});

export default walletAndAccountToAddState;
