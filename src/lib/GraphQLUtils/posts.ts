import { Posts } from '@desmoslabs/desmjs';
import { ReplySetting } from '@desmoslabs/desmjs-types/desmos/posts/v3/models';
import { convertGraphQLProfile } from 'lib/GraphQLUtils/profiles';
import { PostsParams } from 'types/desmos';
import {
  Post,
  PostAttachment,
  PostAttachmentContent,
  PostAttachmentSize,
  PostAttachmentType,
  PostMediaAttachment,
  PostReference,
  PostReferenceType,
  PostStatus,
  PostTransaction,
  PostURL,
} from 'types/posts';

/**
 * Format an incoming posts params data from the server into a format that is easier to parse by the app.
 * @param {any} params - Desmos posts params fetched from the server.
 * @returns {PostsParams} - A formatted PostsParams object
 */
export const convertGraphQLPostsParams = (params: any): PostsParams => {
  return {
    maxTextLength: params.max_text_length,
  } as PostsParams;
};

const convertGraphQLPostAttachmentSize = (
  size: any | undefined,
): PostAttachmentSize | undefined => {
  if ((size?.length ?? 0) === 0) {
    return undefined;
  }
  return {
    height: size[0].height,
    width: size[0].width,
  } as PostAttachmentSize;
};

const convertGraphQLPostAttachmentContent = (content: any): PostAttachmentContent => {
  switch (content['@type']) {
    // Support posts created before desmjs 5.0.0
    case '/desmos.posts.v2.Media':
    case Posts.v3.MediaTypeUrl:
      return {
        type: PostAttachmentType.MEDIA,
        uri: content.uri,
        mimeType: content.mime_type,
      } as PostMediaAttachment;

    default:
      throw new Error('Poll conversion not implemented');
  }
};

export const convertGraphQLPostAttachment = (attachment: any): PostAttachment => {
  return {
    id: attachment.id,
    content: convertGraphQLPostAttachmentContent(attachment.content),
    size: convertGraphQLPostAttachmentSize(attachment.size),
    contentHash: attachment?.content_hash?.length > 0 ? attachment.content_hash[0].hash : undefined,
  } as PostAttachment;
};

const convertGraphQLPostReference = (reference: any): PostReference => {
  return {
    type: PostReferenceType[reference.type as keyof typeof PostReferenceType],
    postId: reference?.reference?.id,
    position: reference?.position_index,
  };
};

const convertGraphQLPostTransaction = (transaction: any): PostTransaction => {
  return {
    hash: transaction.hash,
  } as PostTransaction;
};

const convertGraphQLPostURL = (url: any): PostURL => {
  return {
    startIndex: url.start_index,
    endIndex: url.end_index,
    url: url.url,
    displayValue: url.display_value,
    previewUrl: url.preview_url,
  } as PostURL;
};

/**
 * Converts a post fetched from the GraphQL API into a format that is easier to parse by the app.
 * @param post The post to convert.
 */
export const convertGraphQLPost = (post: any): Post => {
  return {
    status: PostStatus.SYNCED,
    statusUpdateDate: new Date(Date.now()).toISOString(),
    subspaceId: post.subspace_id,
    sectionId: post?.section?.id ?? 0,
    id: post.id,
    externalId: post.external_id,
    conversationId: post.conversation?.id ?? 0,
    text: post.text,
    attachments: (post.attachments ?? []).map(convertGraphQLPostAttachment),
    references: (post.references ?? []).map(convertGraphQLPostReference),
    tags: post.tags,
    urls: (post.urls ?? []).map(convertGraphQLPostURL),

    // TODO: Check if these are parsed correctly
    entities: post.entities,
    replySettings: ReplySetting[post.reply_settings as keyof typeof ReplySetting],

    creationDate: post.creation_date,
    lastUpdatedDate: new Date(Date.now()).toISOString(),

    author: convertGraphQLProfile(post.author),
    transactions: (post.transactions ?? []).map(convertGraphQLPostTransaction),

    hasUserLiked: post.has_user_liked ?? false,
    likesCount: post.likes_count ?? 0,
    commentsCount: post.comments_count ?? 0,
  } as Post;
};
