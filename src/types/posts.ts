import { Media, Poll } from '@desmoslabs/desmjs-types/desmos/posts/v2/models';

export enum PostStatus {
  SYNCED = 'synced',
  CREATED_LOCALLY = 'created_locally',
  DELETED_LOCALLY = 'deleted_locally',
}

export interface Post {
  /**
   * Status of the post.
   */
  status: PostStatus;

  /**
   * ID of the subspace inside which this post has been created.
   */
  subspaceId: number;

  /**
   * ID of the post on-chain.
   * If the post has been created locally but is still being broadcast to the chain,
   * this will be
   */
  id: number;

  /**
   * External id associated to the post.
   * This should be generated in a unique way (i.e. using UUID) when creating
   * the post locally so that it can be later used as a reference to perform
   * the merge between posts that are on-chain and posts that are stored locally.
   */
  externalId: string;

  /**
   * ID of the conversation this post is part of.
   */
  conversationId: number;

  /**
   * Text of the post, if any.
   */
  text: string | undefined;

  /**
   * Attachments associated to this post, if any.
   */
  attachments: PostAttachment[] | undefined;

  /**
   * Date at which this post was created.
   */
  creationDate: string;

  /**
   * Author of this post.
   */
  author: PostAuthor;

  /**
   * Transactions that are associated to this post.
   * This is a list because they could be either MsgCreatePost or MsgEditPost transactions.
   */
  transactions: {
    hash: string;
  }[];
}

export const isPostPending = (post: Post): boolean => {
  return post.status !== PostStatus.SYNCED;
};

export interface PostAuthor {
  address: string;
  bio: string;
  dtag: string;
  profile_pic: string;
  nickname: string;
}

export interface PostAttachment {
  id: number;
  content: Media | Poll;
  size: { height: number; width: number }[];
}
