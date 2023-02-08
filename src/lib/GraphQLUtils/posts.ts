import { PostsParams } from 'types/desmos';
import {
  Post,
  PostAttachment,
  PostAttachmentContent,
  PostAttachmentSize,
  PostAttachmentType,
  PostMediaAttachment,
  PostStatus,
  PostTransaction,
} from 'types/posts';
import { convertGraphQLProfile } from 'lib/GraphQLUtils/profiles';
import { MediaTypeUrl } from '@desmoslabs/desmjs';

/**
 * Format an incoming posts params data from the server into a format that is easier to parse by the app.
 * @param {any} params - Desmos posts params fetched from the server.
 * @returns {PostsParams} - A formatted PostsParams object
 */
export const convertGraphQLPostsParams = (params: any) =>
  ({
    maxTextLength: params.max_text_length,
  } as PostsParams);

const convertGraphQLPostAttachmentSize = (size: any | undefined) => {
  return (size?.length ?? 0) === 0
    ? undefined
    : ({ height: size[0].height, width: size[0].width } as PostAttachmentSize);
};

const convertGraphQLPostAttachmentContent = (content: any): PostAttachmentContent => {
  switch (content['@type']) {
    case MediaTypeUrl:
      return {
        type: PostAttachmentType.MEDIA,
        uri: content.uri,
        mimeType: content.mime_type,
      } as PostMediaAttachment;

    default:
      throw new Error('Poll conversion not implemented');
  }
};

const convertGraphQLPostAttachment = (attachment: any) =>
  ({
    id: attachment.id,
    content: convertGraphQLPostAttachmentContent(attachment.content),
    size: convertGraphQLPostAttachmentSize(attachment.size),
  } as PostAttachment);

const convertGraphQLPostTransaction = (transaction: any) =>
  ({
    hash: transaction.hash,
  } as PostTransaction);

export interface GraphQLPost extends Post {
  /**
   * Identifies whether the current application user has reacted to this post or not.
   */
  readonly hasReacted: boolean;
  /**
   * Identifies whether the current application user has commented this post or not.
   */
  readonly hasCommented: boolean;
  /**
   * Identifies whether the current application user has tipped this post or not.
   */
  readonly hasTipped: boolean;
}

/**
 *
 * @param post
 */
export const convertGraphQLPost = (post: any): GraphQLPost => ({
  status: PostStatus.SYNCED,
  statusUpdateDate: new Date(Date.now()).toISOString(),
  subspaceId: post.subspace_id,
  id: post.id,
  externalId: post.external_id,
  conversationId: post.conversation_id ?? 0,
  text: post.text,
  attachments: post.attachments?.map(convertGraphQLPostAttachment),
  creationDate: post.creation_date,
  author: convertGraphQLProfile(post.author),
  transactions: (post.transactions ?? []).map(convertGraphQLPostTransaction),

  // Extension fields
  hasCommented: post.commentPresence.aggregate.count > 0,
  hasReacted: post.reactionPresence.aggregate.count > 0,
  hasTipped: post.tipPresence.aggregate.count > 0,
});
