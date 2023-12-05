import { EncodeObject } from '@cosmjs/proto-signing';
import { Post } from 'types/posts';
import { Posts } from '@desmoslabs/desmjs';
import useGetPostByExternalID from 'hooks/posts/useGetPostByExternalID';
import React from 'react';
import { PostUpdate, PostUpdateType } from 'lib/PostsUtils';
import useUpdatePendingPosts from 'hooks/posts/useUpdatePendingPosts';
import sleep from 'lib/sleep';
import { useActiveAccountAddress } from '@recoil/accounts';

type PostData = Pick<Post, 'externalId'>;

/**
 * Function that retrieves all the external post ids from the messages of the given transaction.
 */
const getPostsData = (messages: EncodeObject[]) => {
  return messages
    .map(msg => {
      switch (msg.typeUrl) {
        case Posts.v3.MsgCreatePostTypeUrl: {
          const value = msg.value as Posts.v3.MsgCreatePostEncodeObject['value'];
          return {
            externalId: value.externalId,
          } as PostData;
        }

        default:
          // TODO: We should also handle edit and deletion here
          return undefined;
      }
    })
    .filter((data): data is PostData => data !== undefined);
};

/**
 * Hook that allows to retrieve the post update for the given post data.
 */
const useGetPostUpdate = () => {
  const getPostByExternalId = useGetPostByExternalID();

  return React.useCallback(
    async (data: Pick<Post, 'externalId'>) => {
      // Get the on-chain post
      let onChainPost = await getPostByExternalId(data.externalId);
      while (!onChainPost) {
        // The post might not have been parsed yet, we can simply wait for some seconds and try again
        // It's fine to disable the rule here because we need to wait
        // eslint-disable-next-line no-await-in-loop
        await sleep(1000);

        // It's fine to disable the rule here because we need to wait
        // eslint-disable-next-line no-await-in-loop
        onChainPost = await getPostByExternalId(data.externalId);
      }
      // Get the post update
      return {
        type: PostUpdateType.REPLACE,
        original: data,
        updated: onChainPost,
      } as PostUpdate;
    },
    [getPostByExternalId],
  );
};

/**
 * Hook that allows to handle the messages of a transaction that are related to a post creation.
 */
const useHandlePostsMessages = () => {
  const activeAddress = useActiveAccountAddress();
  const getPostUpdate = useGetPostUpdate();
  const updatePendingPosts = useUpdatePendingPosts();

  return React.useCallback(
    async (messages: EncodeObject[]) => {
      if (!activeAddress) {
        throw new Error('Trying to handle posts messages without active user');
      }

      const postsData = getPostsData(messages);
      const updates = await Promise.all(postsData.map(getPostUpdate));
      updatePendingPosts(activeAddress, updates);
    },
    [activeAddress, getPostUpdate, updatePendingPosts],
  );
};

export default useHandlePostsMessages;
