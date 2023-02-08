import { DesmosProfile } from 'types/desmos';

export enum PostStatus {
  SYNCED = 'synced',
  CREATED_LOCALLY = 'created',
  EDITED_LOCALLY = 'edited',
  DELETED_LOCALLY = 'deleted',
}

export interface Post {
  /**
   * Status of the post.
   */
  readonly status: PostStatus;

  /**
   * Last date in which the status of a post was updated.
   */
  readonly statusUpdateDate: string;

  /**
   * ID of the subspace inside which this post has been created.
   */
  readonly subspaceId: number;

  /**
   * ID of the post on-chain.
   * If the post has been created locally but is still being broadcast to the chain,
   * this will be
   */
  readonly id: number;

  /**
   * External id associated to the post.
   * This should be generated in a unique way (i.e. using UUID) when creating
   * the post locally so that it can be later used as a reference to perform
   * the merge between posts that are on-chain and posts that are stored locally.
   */
  readonly externalId: string;

  /**
   * ID of the conversation this post is part of.
   */
  readonly conversationId: number;

  /**
   * Text of the post, if any.
   */
  readonly text: string | undefined;

  /**
   * Attachments associated to this post, if any.
   */
  readonly attachments: PostAttachment[] | undefined;

  /**
   * Date at which this post was created.
   */
  readonly creationDate: string;

  /**
   * Author of this post.
   */
  readonly author: DesmosProfile;

  /**
   * Transactions that are associated to this post.
   * This is a list because they could be either MsgCreatePost or MsgEditPost transactions.
   */
  readonly transactions: PostTransaction[];
}

export const isPostPending = (post: Post): boolean => {
  return post.status !== PostStatus.SYNCED;
};

export interface PostAttachmentSize {
  readonly height: number;
  readonly width: number;
}

export enum PostAttachmentType {
  MEDIA,
  POLL,
}

export interface PostMediaAttachment {
  readonly type: PostAttachmentType.MEDIA;
  readonly uri: string;
  readonly mimeType: string;
}

// TODO: add the PostPollAttachment as well
export type PostAttachmentContent = PostMediaAttachment;

export interface PostAttachment {
  id: number;
  content: PostAttachmentContent;
  size: PostAttachmentSize | undefined;
}

export interface PostTransaction {
  readonly hash: string;
}
