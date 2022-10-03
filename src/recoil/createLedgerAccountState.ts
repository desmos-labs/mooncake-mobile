import {ChainAccount} from 'types/chains';
import {atom} from 'recoil';
import ROUTES from 'navigation/routes';

type CreateLedgerAccountAtom = {
  account?: ChainAccount;

  source?: ROUTES.ADD_PROFILE | undefined;
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
