import {atomFamily, selectorFamily} from 'recoil';
import Long from 'long';

export enum PendingPostEnum {
  'POST',
  'COMMENT',
}
// eslint-disable-next-line import/prefer-default-export
export const pendingPostsState = atomFamily<PendingPost[], PendingPostEnum>({
  key: 'pendingPosts',
  default: [],
});

export const hasPendingPosts = selectorFamily<boolean, PendingPostEnum>({
  key: 'hasPendingPosts',
  get:
    type =>
    ({get}) => {
      return get(pendingPostsState(type)).length > 0;
    },
});

export const pendingCommentsByPost = selectorFamily<PendingPost[], number>({
  key: 'pendingCommentsByPost',
  get:
    postID =>
    ({get}) => {
      const LONG_postID = Long.fromNumber(postID);

      const pendingComments = get(pendingPostsState(PendingPostEnum.COMMENT));

      console.log('pending:', pendingComments);

      console.log(
        'matching',
        pendingComments.filter(x => x.msg.value.conversationId.eq(LONG_postID)),
      );

      return pendingComments.filter(x =>
        x.msg.value.conversationId.eq(LONG_postID),
      );
    },
});
