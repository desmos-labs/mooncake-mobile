import { EncodeObject } from '@cosmjs/proto-signing';
import { Post } from 'types/posts';
import { MsgCreatePostEncodeObject, MsgCreatePostTypeUrl } from '@desmoslabs/desmjs';
import useGetPostByExternalID from 'hooks/posts/useGetPostByExternalID';
import React from 'react';
import { PostUpdate, PostUpdateType } from 'lib/PostsUtils';
import { useActiveAccountAddress } from '@recoil/accounts';
import useUpdatePendingPosts from 'hooks/posts/useUpdatePendingPosts';
import sleep from 'lib/sleep';

/**
 * Function that retrieves all the external post ids from the messages of the given transaction.
 */
const getPostsData = (messages: EncodeObject[]) => {
  const postsData: Pick<Post, 'subspaceId' | 'externalId'>[] = [];
  messages.forEach(msg => {
    if (msg.typeUrl === MsgCreatePostTypeUrl) {
      const value = msg.value as MsgCreatePostEncodeObject['value'];
      postsData.push({ subspaceId: value.subspaceId.toNumber(), externalId: value.externalId });
    }

    // TODO: We should also handle edit and deletion here
  });
  return postsData;
};

/**
 * Hook that allows to retrieve the post update for the given post data.
 */
const useGetPostUpdate = () => {
  const getPostByExternalId = useGetPostByExternalID();

  return React.useCallback(
    async (data: Pick<Post, 'subspaceId' | 'externalId'>) => {
      // Get the on-chain post
      let onChainPost = await getPostByExternalId(data.subspaceId, data.externalId);
      if (!onChainPost) {
        // The post might not have been parsed yet, we can simply wait for some seconds and try again
        await sleep(1000);
        onChainPost = await getPostByExternalId(data.subspaceId, data.externalId);
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
  const activeAccountAddress = useActiveAccountAddress();
  if (!activeAccountAddress) {
    throw new Error('Trying to update a post without an active account');
  }

  const getPostUpdate = useGetPostUpdate();
  const updatePendingPosts = useUpdatePendingPosts(activeAccountAddress);

  return React.useCallback(
    async (messages: EncodeObject[]) => {
      const postsData = getPostsData(messages);
      const updates = await Promise.all(postsData.map(getPostUpdate));
      updatePendingPosts(updates);
    },
    [getPostUpdate, updatePendingPosts],
  );
};

export default useHandlePostsMessages;
