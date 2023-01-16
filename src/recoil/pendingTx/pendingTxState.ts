import {selector} from 'recoil';
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
    const pendingPosts = get(pendingPostsState(PendingPostEnum.POST));
    const pendingComments = get(pendingPostsState(PendingPostEnum.COMMENT));

    return [...pendingPosts, ...pendingComments];
  },
});

export default pendingTxState;
