import { Post, PostAttachment, PostAttachmentType, PostReference, PostStatus } from 'types/posts';
import Long from 'long';
import { Any } from '@desmoslabs/desmjs-types/google/protobuf/any';
import { mediaToAny } from '@desmoslabs/desmjs/build/aminomessages/posts';
import {
  Media,
  PostReference as DesmJSPostReference,
  PostReferenceType,
} from '@desmoslabs/desmjs-types/desmos/posts/v2/models';
import { MsgCreatePostEncodeObject, MsgCreatePostTypeUrl } from '@desmoslabs/desmjs';

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
      return mediaToAny({
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
 * Converts the given {@param post} into a {@link MsgCreatePostEncodeObject} object
 * that can be used to create a transaction.
 */
export const convertPostToMsgCreatePost = (post: Post): MsgCreatePostEncodeObject => {
  return {
    typeUrl: MsgCreatePostTypeUrl,
    value: {
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
    },
  } as MsgCreatePostEncodeObject;
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
 * Allows to sort the given {@param posts} by creation date, from the most recent to the oldest.
 */
export const sortPostsByCreationDate = (posts: Post[]): Post[] => {
  return posts.sort((a, b) => Date.parse(b.creationDate) - Date.parse(a.creationDate));
};

export enum PostUpdateType {
  CREATE,
  REPLACE,
  DELETE,
}

export interface PostCreatedUpdate {
  readonly type: PostUpdateType.CREATE;
  readonly post: Post;
}

export interface PostUpdatedUpdate {
  readonly type: PostUpdateType.REPLACE;
  readonly original: Post;
  readonly updated: Post;
}

export interface PostDeletedUpdate {
  readonly type: PostUpdateType.DELETE;
  readonly post: Post;
}

export type PostUpdate = PostCreatedUpdate | PostUpdatedUpdate | PostDeletedUpdate;

/**
 * Allows to merge two lists of posts together.
 * @param existingPosts {Post[]} - List of posts that already exist.
 * @param externalPosts {Post[]} - List of posts that are coming from an external source.
 * @return A tuple of <code>[]Post</code> representing the new merged posts, and <code>[]PostUpdate</code>
 * representing how the {@param existingPosts} should be updated.
 */
export const mergePosts = (
  existingPosts: Post[],
  externalPosts: Post[],
): [Post[], PostUpdate[]] => {
  if (existingPosts.length === 0) {
    return [externalPosts, []];
  }

  // Create the array to be stored.
  // This is copied so that if the object is frozen by someone (i.e. Recoil), we can still edit it
  let postsToStore = [...existingPosts];
  const postsUpdates: PostUpdate[] = [];

  // First of all, update all the posts that have either been edited or created
  externalPosts.forEach(post => {
    const cachedPostIndex = findSamePost(existingPosts, post);
    if (cachedPostIndex === -1) {
      // The post was not cached locally, it means it was created by another user.
      // For this reason, just add it to the list of posts to store
      postsUpdates.push({
        type: PostUpdateType.CREATE,
        post,
      });
      postsToStore.push(post);
    } else {
      // The post was cached locally. We now need to act differently based on the
      // status that it has locally, and was has happened on the chain in the meanwhile
      const cachedPost = existingPosts[cachedPostIndex];
      switch (cachedPost.status) {
        case PostStatus.CREATED_LOCALLY:
          // The post was created locally, and now it's on-chain.
          // Replace the local post data with the new one from the chain
          postsUpdates.push({
            type: PostUpdateType.REPLACE,
            original: postsToStore[cachedPostIndex],
            updated: post,
          });
          postsToStore[cachedPostIndex] = post;
          break;

        case PostStatus.EDITED_LOCALLY:
          // TODO: This should be handled by checking the edits that have been made
          break;

        case PostStatus.DELETED_LOCALLY:
          // Ignore: this will be handled later
          break;
      }
    }
  });

  // Check the posts that have been deleted locally.
  const deletedPosts = postsToStore.filter(p => p.status === PostStatus.DELETED_LOCALLY);
  deletedPosts.forEach((deletedPost, index) => {
    const updateDate = Date.parse(deletedPost.statusUpdateDate);
    if (Date.now() - updateDate < 30 * 1000) {
      // If the post was updated locally less than 30 seconds ago, do nothing.
      // The operation might be still being carried out on-chain, or there might be some delays
      return;
    }

    // The post was updated more than 30 seconds ago, now we need to update the cache
    const onChainIndex = findSamePost(externalPosts, deletedPost);
    switch (onChainIndex) {
      case -1:
        // The post is not found on chain: we can now safely remove it from the cache as well
        postsUpdates.push({
          type: PostUpdateType.DELETE,
          post: deletedPost,
        });
        postsToStore = postsToStore.splice(index, 1);
        break;

      default:
        // The post is found on chain: we can revert the local changes by overriding them
        postsUpdates.push({
          type: PostUpdateType.REPLACE,
          original: postsToStore[index],
          updated: externalPosts[onChainIndex],
        });
        postsToStore[index] = externalPosts[onChainIndex];
    }
  });

  // Order the posts to store based on their creation date descending
  return [sortPostsByCreationDate(postsToStore), postsUpdates];
};
