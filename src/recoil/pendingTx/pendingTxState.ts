import {selector} from 'recoil';
import {pendingRelationshipsState} from '@recoil/pendingTx/pendingRelationships';
import {
  PendingPostEnum,
  pendingPostsState,
} from '@recoil/pendingTx/pendingPosts';

/**
 * A selector that returns all pending transactions
 */
const pendingTxState = selector<PendingTx[]>({
  key: 'pendingTx',
  get: ({get}) => {
    const pendingRelationships = get(pendingRelationshipsState);
    const pendingPosts = get(pendingPostsState(PendingPostEnum.POST));
    const pendingComments = get(pendingPostsState(PendingPostEnum.COMMENT));

    return [...pendingRelationships, ...pendingPosts, ...pendingComments];
  },
});

export default pendingTxState;
