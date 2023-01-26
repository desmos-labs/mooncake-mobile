import {atom, selector, selectorFamily} from 'recoil';
import Long from 'long';
import _ from 'lodash';
import {getMMKV, MMKVKEYS, setMMKV} from 'lib/MMKVStorage';

export enum PendingPostEnum {
  'POST',
  'COMMENT',
}

/**
 * An atomFamily that holds pending posts.
 */
export const allPendingPostsState = atom<PendingPost[]>({
  key: 'allPendingPosts',
  default: getMMKV(MMKVKEYS.PENDING_POSTS) || [],
  effects: [
    ({onSet}) => {
      onSet(newValue => {
        setMMKV(MMKVKEYS.PENDING_POSTS, newValue);
      });
    },
  ],
});

export const pendingPostsState = selector<PendingPost[]>({
  key: 'pendingPosts',
  get: ({get}) => {
    const allPendingPosts = get(allPendingPostsState);

    return allPendingPosts.filter(x => x.postType === PendingPostEnum.POST);
  },
});

export const pendingCommentsState = selector<PendingPost[]>({
  key: 'pendingComments',
  get: ({get}) => {
    const allPendingPosts = get(allPendingPostsState);

    return allPendingPosts.filter(x => x.postType === PendingPostEnum.COMMENT);
  },
});

/**
 * Get all pending comments for a given postID
 */
export const pendingCommentsByPost = selectorFamily<PendingPost[], number>({
  key: 'pendingCommentsByPost',
  get:
    referencePostID =>
    ({get}) => {
      const pendingComments = get(pendingCommentsState);

      return pendingComments.filter(x => {
        const referencedPosts = _.get(x, 'msg.value.referencedPosts');
        if (referencedPosts.length === 0) return false;

        return Long.fromNumber(referencePostID).eq(referencedPosts[0].postId);
      });
    },
});
