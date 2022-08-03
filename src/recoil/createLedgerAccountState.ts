import {ChainAccount} from 'types/chains';
import {atom} from 'recoil';

type CreateLedgerAccountAtom = {
  account?: ChainAccount;
};

/**
 * An atom to persist the data required to create a new desmos profile from an
 * account imported from ledger
 */
const createLedgerAccountState = atom<CreateLedgerAccountAtom>({
  key: 'createLedgerAccount',
  default: undefined,
});

export default createLedgerAccountState;
