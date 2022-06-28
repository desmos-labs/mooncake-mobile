import {atom} from 'recoil';
import {ChainLink} from 'types/link';

/**
 * Recoil atom for the user's chain links
 */
const chainLinkState = atom<ChainLink[]>({
  key: 'chainLink',
  default: [],
});

export default chainLinkState;
