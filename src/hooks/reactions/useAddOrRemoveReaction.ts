import React from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import {
  useAddPostReaction,
  useHasPostReaction,
  useRemovePostReaction,
  useUpdatePostReactionStatus,
} from '@recoil/reactions';
import { getLikeReactionId } from 'types/desmos';
import useBroadcastTx from 'hooks/transactions/useBroadcastTx';
import {
  MsgAddReactionEncodeObject,
  MsgAddReactionTypeUrl,
  MsgRemoveReactionEncodeObject,
  MsgRemoveReactionTypeUrl,
} from '@desmoslabs/desmjs';
import Long from 'long';
import { useLazyQuery } from '@apollo/client';
import GetPostReactionsForUser from 'services/graphql/queries/GetPostReactionsForUser';
import { Post } from 'types/posts';
import { useAppStateValue } from '@recoil/appState';
import { registeredReactionValueToAny } from '@desmoslabs/desmjs/build/aminomessages/reactions';
import { DataStatus } from 'types/cache';

/**
 * Hook that allows to add a reaction both remotely and locally.
 */
const useAddReaction = (activeAddress: string) => {
  const subspaceId = useAppStateValue('subspaceId');
  const subspaceParams = useAppStateValue('subspaceParams');
  const broadcastTx = useBroadcastTx();

  const addPostReaction = useAddPostReaction(activeAddress);
  const removePostReaction = useRemovePostReaction(activeAddress);

  return React.useCallback(
    async (post: Post) => {
      // Add the reaction locally
      addPostReaction(post);

      // If the reaction does not exist on the server, add it there
      const messageAddReaction: MsgAddReactionEncodeObject = {
        typeUrl: MsgAddReactionTypeUrl,
        value: {
          subspaceId: Long.fromNumber(subspaceId),
          postId: Long.fromNumber(post.id),
          value: registeredReactionValueToAny({
            registeredReactionId: getLikeReactionId(subspaceParams),
          }),
          user: activeAddress,
        },
      };

      // Broadcast the transaction
      const result = await broadcastTx([messageAddReaction], { optimistic: true });
      if (result.isErr()) {
        // If the transaction is canceled or errors, revert the addition of the reaction.
        removePostReaction(post);
      }
    },
    [addPostReaction, activeAddress, subspaceId, subspaceParams, broadcastTx, removePostReaction],
  );
};

/**
 * Hook that allows to remove a reaction both remotely (if present) and locally.
 */
const useRemoveReaction = (activeAddress: string) => {
  const subspaceId = useAppStateValue('subspaceId');
  const broadcastTx = useBroadcastTx();

  const setPostReactionStatus = useUpdatePostReactionStatus(activeAddress);

  const [getReaction] = useLazyQuery(GetPostReactionsForUser, {
    fetchPolicy: 'network-only',
  });

  return React.useCallback(
    async (post: Post) => {
      // Remove the reaction locally
      setPostReactionStatus(post, DataStatus.DELETED_LOCALLY);

      // Get the reaction id from the server, if any
      const { data } = await getReaction({
        variables: {
          subspaceId: post.subspaceId,
          postId: post.id,
          userAddress: activeAddress,
        },
      });
      const remoteReactions = data?.reactions;
      const remoteReactionId = remoteReactions?.length > 0 ? remoteReactions[0].id : undefined;

      // If the reaction id is defined, delete it remotely
      const messageRemoveReaction: MsgRemoveReactionEncodeObject = {
        typeUrl: MsgRemoveReactionTypeUrl,
        value: {
          subspaceId: Long.fromNumber(subspaceId),
          postId: Long.fromNumber(post.id),
          reactionId: remoteReactionId,
          user: activeAddress,
        },
      };

      // Broadcast the transaction
      const result = await broadcastTx([messageRemoveReaction], { optimistic: true });
      if (result.isErr()) {
        // If the transaction is canceled or errors, revert the removal of the reaction.
        setPostReactionStatus(post, DataStatus.CREATED_LOCALLY);
      }
    },
    [setPostReactionStatus, getReaction, activeAddress, subspaceId, broadcastTx],
  );
};

/**
 * Hook that allows to add or remove a reaction to a post having a given id.
 */
const useAddOrRemoveReaction = () => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error('Trying to know add or remove a reaction, without active user');
  }

  const hasPostReaction = useHasPostReaction(activeAddress);
  const addReaction = useAddReaction(activeAddress);
  const removeReaction = useRemoveReaction(activeAddress);

  return React.useCallback(
    async (post: Post) => {
      const doesReactionExist = hasPostReaction(post.subspaceId, post.id);
      if (doesReactionExist) {
        await removeReaction(post);
      } else {
        await addReaction(post);
      }
    },
    [hasPostReaction, removeReaction, addReaction],
  );
};

export default useAddOrRemoveReaction;
