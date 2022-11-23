import ROUTES from 'navigation/routes';
import {atom} from 'recoil';

type AccountCreationAtom = {
  mnemonic?: string;

  password?: string;

  source?:
    | ROUTES.ADD_PROFILE_SELECT_ADDRESS_GENERAL
    | ROUTES.ADD_PROFILE_SELECT_ADDRESS_ADVANCED
    | undefined;
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
