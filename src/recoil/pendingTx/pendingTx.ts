import {selector} from 'recoil';
import {pendingRelationshipsState} from '@recoil/pendingTx/pendingRelationships';

/**
 * A selector that returns all pending transactions
 */
const pendingTx = selector<PendingTx[]>({
  key: 'pendingTx',
  get: ({get}) => {
    const pendingRelationships = get(pendingRelationshipsState);

    return [...pendingRelationships];
  },
});

export default pendingTx;
