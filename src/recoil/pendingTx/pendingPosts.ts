import {atomFamily, selectorFamily} from 'recoil';
import Long from 'long';
import _ from 'lodash';

export enum PendingPostEnum {
  'POST',
  'COMMENT',
}

/**
 * An atomFamily that holds pending posts.
 */
export const pendingPostsState = atomFamily<PendingPost[], PendingPostEnum>({
  key: 'pendingPosts',
  default: [],
});

/**
 * Get all pending comments for a given postID
 */
export const pendingCommentsByPost = selectorFamily<PendingPost[], number>({
  key: 'pendingCommentsByPost',
  get:
    postID =>
    ({get}) => {
      const LONG_postID = Long.fromNumber(postID);

      const pendingComments = get(pendingPostsState(PendingPostEnum.COMMENT));

      return pendingComments.filter(x => {
        const referencedPosts = _.get(x, 'msg.value.referencedPosts');
        if (referencedPosts.length === 0) return false;

        return LONG_postID.eq(referencedPosts[0].postId);
      });
    },
});
