import {atom} from 'recoil';

type AccountCreationAtom = {
  mnemonic: string;

  password?: string;

  useExternalAccount?: boolean;
};

/**
 * An atom to persist values across screens during account creation.
 * Currently, it is only used for import recovery phrase flow where there are
 * no accounts found for the mnemonic, as other flows do not require persisting
 * the account creation data
 */
const createLocalWalletState = atom<AccountCreationAtom>({
  key: 'accountCreation',
  default: undefined,
});

export default createLocalWalletState;
