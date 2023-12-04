import React from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { isCommentTo, isRootPost, Post, PostStatus } from 'types/posts';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { findSamePost } from 'lib/PostsUtils';
import { DesmosProfile } from 'types/desmos';

/**
 * Atom that holds all the posts that are somehow related to a user.
 * This also contains all the posts that have been created by the user but are
 * still waiting to be broadcast on-chain.
 * It's cached using MMKV so that the user can see the last post before they went offline.
 * We use a Record<String, Post[]> in order to be able to save multiple user's timeline if
 * the application user has multiple profiles.
 */
const postsState = atom<Record<string, Post[]>>({
  key: 'postsState',
  default: getMMKV(MMKVKEYS.POSTS) ?? {},
  effects: [
    ({ onSet }) => {
      onSet(posts => {
        setMMKV(MMKVKEYS.POSTS, posts);
      });
    },
  ],
});

/**
 * Hook that allows to get the details of a post given its subspace id and id.
 */
export const usePostByID = (user: string, id: number) => {
  const posts = useRecoilValue(postsState);
  return React.useMemo(() => {
    return posts[user]?.find(p => p.id === id);
  }, [id, posts, user]);
};

/**
 * Hook that allows to get the details of a post given its subspace id and external id.
 */
export const usePostByExternalID = (user: string, subspaceId: number, externalId: string) => {
  const posts = useRecoilValue(postsState);
  return React.useMemo(() => {
    return posts[user]?.find(p => p.subspaceId === subspaceId && p.externalId === externalId);
  }, [externalId, posts, subspaceId, user]);
};

/**
 * Hook that allows to get all the posts that are yet to-be-synced for a given user.
 */
export const usePostsToSync = (user: string) => {
  const posts = useRecoilValue(postsState);
  return React.useMemo(() => {
    return posts[user]?.filter(post => post.status !== PostStatus.SYNCED) ?? [];
  }, [posts, user]);
};

/**
 * Hook that allows to get the posts to sync having a given subspace id and post id.
 * @param user {string} - Address of the user inside which posts' to search for.
 */
export const useGetPostToSync = (user: string) => {
  const posts = useRecoilValue(postsState);
  return React.useCallback(
    (subspaceId: number, externalId: string) => {
      const userPosts = posts[user] ?? [];
      return userPosts.find(p => p.subspaceId === subspaceId && p.externalId === externalId);
    },
    [posts, user],
  );
};

/**
 * Hook that allows to get a number representing the current difference of the comments for the specified post.
 * The difference is computed by considering:
 * • each locally deleted comment as <code>-1</code>
 * • each locally added comment as <code>+1</code>
 *
 * Here are some difference values examples:
 * • a difference of -2 means that overall there are 2 locally deleted comments
 * • a difference of +1 means that overall there is 1 locally deleted comment
 *
 * This difference can be used to show an updated comments count compared to the current values on the server.
 */
export const useGetPostCommentsDifference = (user: string) => {
  const posts = useRecoilValue(postsState);
  return React.useCallback(
    (subspaceId: number, postId: number) => {
      const userPosts = posts[user] ?? [];
      return userPosts
        .filter(p => p.subspaceId === subspaceId && isCommentTo(p, postId))
        .map(p => {
          switch (p.status) {
            case PostStatus.CREATED_LOCALLY:
            case PostStatus.EDITED_LOCALLY:
              return 1;
            case PostStatus.DELETED_LOCALLY:
              return -1;
            default:
              return 0;
          }
        })
        .reduce((sum: number, value: number) => sum + value, 0);
    },
    [posts, user],
  );
};

/**
 * Hook that allows to get all the comments that are yet to-be-synced for a given user and post.
 * @param user {string} - Address of the user inside which posts' to search for.
 * @param subspaceId {number} - Subspace id of the post.
 * @param postId {number} - ID of the post for which to get the comments.
 */
export const usePostCommentsToSync = (user: string, subspaceId: number, postId: number) => {
  const posts = useRecoilValue(postsState);
  return React.useMemo(() => {
    const userPosts = posts[user] ?? [];
    return userPosts.filter(
      p =>
        p.subspaceId === subspaceId &&
        isCommentTo(p, postId) &&
        p.status !== PostStatus.DELETED_LOCALLY,
    );
  }, [posts, user, subspaceId, postId]);
};

/**
 * Hook that allows to store a given post.
 */
export const useStorePost = () => {
  const setPosts = useSetRecoilState(postsState);
  return React.useCallback(
    (user: string, post: Post) => {
      setPosts(posts => {
        const userPosts = [...(posts[user] ?? [])];
        const existingPostIndex = findSamePost(userPosts, post);
        switch (existingPostIndex) {
          case -1:
            // Add the non-existing post
            userPosts.unshift(post);
            break;
          default:
            // Replace the existing post
            userPosts[existingPostIndex] = post;
            break;
        }

        // Update the value
        const updatedPosts: Record<string, Post[]> = {
          ...posts,
        };
        updatedPosts[user] = userPosts;
        return updatedPosts;
      });
    },
    [setPosts],
  );
};

/**
 * Hook that allows to set the posts related to a user.
 *
 * <b>Note</b>
 * It should be responsibility of the caller of this hook to properly merge all the
 * synced and not-synced posts appropriately. By calling this method, the current timeline
 * will be entirely replaced with the given value.
 */
export const useStorePosts = (user: string) => {
  const setPosts = useSetRecoilState(postsState);
  return React.useCallback(
    (valOrUpdater: ((currVal: Post[]) => Post[]) | Post[]) => {
      setPosts(currentTimeline => {
        const updatedPosts: Record<string, Post[]> = {
          ...currentTimeline,
        };

        if (typeof valOrUpdater === 'function') {
          updatedPosts[user] = valOrUpdater(updatedPosts[user] ?? []);
        } else {
          updatedPosts[user] = valOrUpdater;
        }

        return updatedPosts;
      });
    },
    [setPosts, user],
  );
};

/**
 * Hook that allows to update the status of a single post.
 * @param user {string} - Address of the user that should be used to search the post.
 */
export const useUpdatePostStatus = (user: string) => {
  const setPosts = useSetRecoilState(postsState);
  return React.useCallback(
    (post: Post, status: PostStatus) => {
      setPosts(currentTimeline => {
        const updatedPosts: Record<string, Post[]> = {
          ...currentTimeline,
        };

        // Update the user posts by changing the status of only the post with the same subspace id and external id
        const userPosts = updatedPosts[user] ?? [];
        updatedPosts[user] = userPosts.map(userPost =>
          userPost.subspaceId === post.subspaceId && userPost.externalId === post.externalId
            ? ({ ...userPost, status } as Post)
            : userPost,
        );
        return updatedPosts;
      });
    },
    [setPosts, user],
  );
};

/**
 * Hook that allows to get the stored root posts for the user having the given address.
 * A root post is defined as a post that has <code>conversationId</code> equals to <code>0</code>.
 */
export const useStoredRootPosts = (user: string) => {
  const posts = useRecoilValue(postsState);
  return React.useMemo(() => (posts[user] ?? []).filter(isRootPost), [posts, user]);
};

/**
 * Hook that allows to get all the stored posts for the user having the given address that were
 * created by either one of the addresses provided inside the <code>users</code> array.
 */
export const useStoredFollowingPosts = (user: string, followingAddresses: string[]) => {
  const posts = useRecoilValue(postsState);
  return React.useMemo(
    () => posts[user]?.filter(post => followingAddresses.includes(post.author.address)) ?? [],
    [followingAddresses, posts, user],
  );
};

export const useUpdateStoredPendingPost = () => {
  const setPosts = useSetRecoilState(postsState);
  return React.useCallback(
    (user: string, subspaceId: number, externalId: string, update: Post) => {
      setPosts(currentTimeline => {
        const updatedPosts: Record<string, Post[]> = {
          ...currentTimeline,
        };

        const userPosts = updatedPosts[user] ?? [];
        updatedPosts[user] = userPosts.map(post => {
          return post.subspaceId === subspaceId &&
            post.externalId === externalId &&
            post.status !== PostStatus.SYNCED
            ? update
            : post;
        });

        return updatedPosts;
      });
    },
    [setPosts],
  );
};

/**
 * Hook that allows to delete the given pending post from the posts state.
 * @param user {string} - Address of the user for which the post should be deleted.
 */
export const useRemoveStoredPendingPost = () => {
  const setPosts = useSetRecoilState(postsState);
  return React.useCallback(
    (user: string, subspaceId: number, externalId: string) => {
      setPosts(currentTimeline => {
        const updatedPosts: Record<string, Post[]> = {
          ...currentTimeline,
        };

        // Update the user posts by filtering out the post that has the same subspace id, external id and is not synced
        const userPosts = updatedPosts[user] ?? [];
        updatedPosts[user] = userPosts.filter(
          p =>
            p.subspaceId !== subspaceId ||
            p.externalId !== externalId ||
            p.status === PostStatus.SYNCED,
        );

        return updatedPosts;
      });
    },
    [setPosts],
  );
};

/**
 * Hook that allows to remove the post having a given subspace ia and external id.
 */
export const useRemovePost = () => {
  const setPosts = useSetRecoilState(postsState);
  return React.useCallback(
    (user: string, externalId: string) => {
      setPosts(currentTimeline => {
        const updatedPosts: Record<string, Post[]> = {
          ...currentTimeline,
        };

        // Update the user posts by filtering out the post that has the same subspace id and external id
        const userPosts = updatedPosts[user] ?? [];
        updatedPosts[user] = userPosts.filter(p => p.externalId !== externalId);

        return updatedPosts;
      });
    },
    [setPosts],
  );
};

/**
 * A hook that allows removal of cached timeline posts of the active user via the postID.
 */
export const useRemovePostByID = (user: string) => {
  const setPosts = useSetRecoilState(postsState);

  return React.useCallback(
    (postID: number) => {
      setPosts(currentTimeline => {
        const updatedPosts: Record<string, Post[]> = {
          ...currentTimeline,
        };

        // Update the user posts by filtering out the post with matching postID
        const userPosts = updatedPosts[user] ?? [];
        updatedPosts[user] = userPosts.filter(post => post.id !== postID);

        return updatedPosts;
      });
    },
    [setPosts, user],
  );
};

/**
 * A hook that allows removal of cached timeline posts for a given user by the author.
 */
export const useRemovePostsByAuthor = (user: string) => {
  const setPosts = useSetRecoilState(postsState);

  return React.useCallback(
    (authorToRemove: DesmosProfile) => {
      setPosts(currentTimeline => {
        const updatedPosts: Record<string, Post[]> = {
          ...currentTimeline,
        };

        // Update the user posts by filtering out the post with matching author
        const userPosts = updatedPosts[user] ?? [];
        updatedPosts[user] = userPosts.filter(
          post => post.author.address !== authorToRemove.address,
        );

        return updatedPosts;
      });
    },
    [setPosts, user],
  );
};
