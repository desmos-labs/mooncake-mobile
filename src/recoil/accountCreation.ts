import {atom} from 'recoil';
import {ChainAccountType} from 'types/chains';

export enum AccountCreationMode {
  IMPORT_MNEMONIC,
}

type AccountCreationAtom = {
  mnemonic: string;

  type: ChainAccountType;

  creationMode: AccountCreationMode;

  password?: string;
};

/**
 * An atom to persist values across screens during account creation.
 * Currently, it is only used for import recovery phrase flow where there are
 * no accounts found for the mnemonic, as other flows do not require persisting
 * the account creation data
 */
const accountCreationState = atom<AccountCreationAtom>({
  key: 'accountCreation',
  default: undefined,
});

export default accountCreationState;
