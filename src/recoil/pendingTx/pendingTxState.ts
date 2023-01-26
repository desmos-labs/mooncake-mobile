import {selector} from 'recoil';
import {allPendingPostsState} from '@recoil/pendingTx/pendingPosts';

/**
 * A selector that returns all pending transactions
 */
const pendingTxState = selector<PendingTx[]>({
  key: 'pendingTx',
  get: ({get}) => {
    const pendingPosts = get(allPendingPostsState);

    return pendingPosts;
  },
});

export default pendingTxState;
