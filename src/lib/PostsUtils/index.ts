import { Post, PostStatus } from 'types/posts';

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
 * Allows to merge two lists of posts together.
 * @param existingPosts {Post[]} - List of posts that already exist.
 * @param externalPosts {Post[]} - List of posts that are coming from an external source.
 */
export const mergePosts = (existingPosts: Post[], externalPosts: Post[]): Post[] => {
  if (existingPosts.length === 0) {
    return externalPosts;
  }

  // Create the array to be stored.
  // This is copied so that if the object is frozen by someone (i.e. Recoil), we can still edit it
  let postsToStore = [...existingPosts];

  // First of all, update all the posts that have either been edited or created
  externalPosts.forEach(post => {
    const cachedPostIndex = findSamePost(existingPosts, post);
    if (cachedPostIndex === -1) {
      // The post was not cached locally, it means it was created by another user.
      // For this reason, just add it to the list of posts to store
      postsToStore.push(post);
    } else {
      // The post was cached locally. We now need to act differently based on the
      // status that it has locally, and was has happened on the chain in the meanwhile
      const cachedPost = existingPosts[cachedPostIndex];
      switch (cachedPost.status) {
        case PostStatus.CREATED_LOCALLY:
          // The post was created locally, and now it's on-chain.
          // Replace the local post data with the new one from the chain
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
        postsToStore = postsToStore.splice(index, 1);
        break;

      default:
        // The post is found on chain: we can revert the local changes by overriding them
        postsToStore[index] = externalPosts[onChainIndex];
    }
  });

  return postsToStore;
};
