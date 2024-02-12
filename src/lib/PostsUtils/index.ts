import { Posts } from '@desmoslabs/desmjs';
import {
  Media,
  PostReference as DesmJSPostReference,
  PostReferenceType,
} from '@desmoslabs/desmjs-types/desmos/posts/v3/models';
import { MsgCreatePost } from '@desmoslabs/desmjs-types/desmos/posts/v3/msgs';
import { Any } from '@desmoslabs/desmjs-types/google/protobuf/any';
import Long from 'long';
import {
  Post,
  PostAttachment,
  PostAttachmentSize,
  PostAttachmentType,
  PostReference,
} from 'types/posts';

/**
 * Gets the conversation id to be used when creating a post.
 * @param parent {Post | undefined} - The parent post, if any
 */
export const getConversationId = (parent?: Post): number => {
  if (!parent) {
    return 0;
  }

  if (!parent.conversationId) {
    return parent.id;
  }

  return parent.conversationId;
};

/**
 * Converts the given {@param attachment} into an {@link Any} object.
 */
const convertPostAttachment = (attachment: PostAttachment): Any => {
  switch (attachment.content.type) {
    case PostAttachmentType.MEDIA:
      return Posts.v3.mediaToAny({
        uri: attachment.content.uri,
        mimeType: attachment.content.mimeType,
      } as Media);
  }
};

/**
 * Converts the given {@param reference} to the DesmJS format.
 */
const convertPostReference = (reference: PostReference): DesmJSPostReference => {
  return {
    postId: Long.fromNumber(reference.postId),
    position: Long.fromNumber(reference.position),
    type: PostReferenceType[reference.type],
  };
};

/**
 * Converts the given {@param post} into a {@link Posts.v3.MsgCreatePostEncodeObject} object
 * that can be used to create a transaction.
 */
export const convertPostToMsgCreatePost = (post: Post): Posts.v3.MsgCreatePostEncodeObject => {
  return {
    typeUrl: Posts.v3.MsgCreatePostTypeUrl,
    value: MsgCreatePost.fromPartial({
      subspaceId: Long.fromNumber(post.subspaceId),
      sectionId: post.sectionId,
      externalId: post.externalId,
      text: post.text,
      entities: post.entities,
      tags: post.tags,
      attachments: post.attachments.map(convertPostAttachment),
      author: post.author.address,
      conversationId: Long.fromNumber(post.conversationId),
      replySettings: post.replySettings,
      referencedPosts: post.references.map(convertPostReference),
    }),
  } as Posts.v3.MsgCreatePostEncodeObject;
};

/**
 * Allows to find, within the given {@param posts} array, the index of the post that
 * is equals to the given {@param post}.
 *
 * <b>Note</b>
 * In order to be considered <i>equals</i>, two post must:
 * 1. have the same <code>subspaceId</code>, and
 * 2. have the same <code>externalId</code>.
 *
 * This comparison method is sufficiently safe because the server will <b>not</b> store
 * two posts that have the same <code>externalId</code> and <code>subspaceId</code>,
 * but have been created from two different authors. This guarantees that an attacker
 * cannot use the same <code>externalId</code> of another post made by another user in
 * order to try and replace the contents displayed inside the app with theirs.
 */
export const findSamePost = (posts: Post[], post: Post): number =>
  posts.findIndex(p => p.subspaceId === post.subspaceId && p.externalId === post.externalId);

/**
 * Allows sorting the given {@param posts} by creation date, from the most recent to the oldest.
 */
export const sortPostsByCreationDate = (posts: Post[]): Post[] => {
  return [...posts].sort((a, b) => b.creationDate.localeCompare(a.creationDate));
};

/**
 * Returns the media attachment of the given post, if any.
 * @param post
 */
const getMediaAttachment = (post: Post): PostAttachment | undefined => {
  return post.attachments.find(attachment => attachment.content.type === PostAttachmentType.MEDIA);
};

export interface PostPreviewURL {
  readonly url: string;
  readonly previewUrl: string;
  readonly text: string;
}

/**
 * Returns the URL to preview of the given post, if any.
 * @param post {Post} - The post to get the URL preview from
 * @return The URL to preview, if any
 */
export const getPostURLPreview = (post: Post): PostPreviewURL | undefined => {
  const urlToPreview = post.urls?.find(url => url.previewUrl !== undefined);
  if (!urlToPreview) {
    return undefined;
  }

  const regex = /^(https?:\/\/)?(([^:/?#]*)([^/?#]*))/;
  const match = urlToPreview.url.match(regex);
  if (match === null) {
    return undefined;
  }

  return {
    url: urlToPreview.url,
    previewUrl: urlToPreview.previewUrl!,
    text: `${match[1]}${match[2]}`,
  };
};

enum PostAttachmentDataType {
  MEDIA = 'MEDIA',
  URL = 'URL',
}

interface PostMediaAttachmentData {
  readonly type: PostAttachmentDataType.MEDIA;
  readonly attachment: PostAttachment;
  readonly size?: PostAttachmentSize;
}

interface PostURLAttachmentData {
  readonly type: PostAttachmentDataType.URL;
  readonly url: PostPreviewURL;
  readonly size?: PostAttachmentSize;
}

type PostAttachmentData = PostMediaAttachmentData | PostURLAttachmentData;

/**
 * Returns the attachment data of the given post, if any.
 * @param post {Post} - The post to get the attachment data from.
 */
export const getPostAttachmentData = (post: Post): PostAttachmentData | undefined => {
  const mediaAttachment = getMediaAttachment(post);
  if (mediaAttachment) {
    return {
      type: PostAttachmentDataType.MEDIA,
      attachment: mediaAttachment,
      size: mediaAttachment.size,
    };
  }

  const urlAttachment = getPostURLPreview(post);
  if (urlAttachment) {
    return {
      type: PostAttachmentDataType.URL,
      url: urlAttachment,
    };
  }

  return undefined;
};
