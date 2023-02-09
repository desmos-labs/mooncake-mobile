import React from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import {
  useAddPostReaction,
  useHasPostReaction,
  useRemovePostReaction,
  useSetPostReactionStatus,
} from '@recoil/reactions';
import { getLikeReactionId } from 'types/desmos';
import useBroadcastTx from 'hooks/useBroadcastTx';
import {
  MsgAddReactionEncodeObject,
  MsgAddReactionTypeUrl,
  MsgRemoveReactionEncodeObject,
  MsgRemoveReactionTypeUrl,
} from '@desmoslabs/desmjs';
import Long from 'long';
import { useLazyQuery } from '@apollo/client';
import GetPostReaction from 'services/graphql/queries/GetPostReaction';
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
  const setPostReactionStatus = useSetPostReactionStatus(activeAddress);
  const removePostReaction = useRemovePostReaction(activeAddress);

  const [getReaction] = useLazyQuery(GetPostReaction, {
    fetchPolicy: 'network-only',
  });

  return React.useCallback(
    async (post: Post) => {
      // Add the reaction locally
      addPostReaction(post);

      // Check if the reaction exists on the server
      const { data } = await getReaction({
        variables: {
          postId: post.id,
          userAddress: activeAddress,
        },
      });

      const hasReaction = data?.reactions?.length > 0;
      if (!hasReaction) {
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

        // If the transaction is successful, set the reaction as synced with the chain
        const onSuccess = () => {
          setPostReactionStatus(post, DataStatus.SYNCED);
        };

        // If the transaction is canceled or errors, revert the addition of the reaction.
        const onCancelOrError = () => {
          removePostReaction(post);
        };

        // Broadcast the transaction
        await broadcastTx([messageAddReaction], {
          optimistic: true,
          onSuccess,
          onCancel: onCancelOrError,
          onError: onCancelOrError,
        });
      }
    },
    [
      addPostReaction,
      getReaction,
      activeAddress,
      subspaceId,
      subspaceParams,
      broadcastTx,
      setPostReactionStatus,
      removePostReaction,
    ],
  );
};

/**
 * Hook that allows to remove a reaction both remotely (if present) and locally.
 */
const useRemoveReaction = (activeAddress: string) => {
  const subspaceId = useAppStateValue('subspaceId');
  const broadcastTx = useBroadcastTx();

  const setPostReactionStatus = useSetPostReactionStatus(activeAddress);
  const removePostReaction = useRemovePostReaction(activeAddress);

  const [getReaction] = useLazyQuery(GetPostReaction, {
    fetchPolicy: 'network-only',
  });

  return React.useCallback(
    async (post: Post) => {
      // Remove the reaction locally
      setPostReactionStatus(post, DataStatus.DELETED_LOCALLY);

      // Get the reaction id from the server
      const { data } = await getReaction({
        variables: {
          postId: post.id,
          userAddress: activeAddress,
        },
      });

      const reactions = data?.reactions;
      const reactionId = reactions?.length > 0 ? reactions[0].id : undefined;

      // If the reaction id is defined, delete it remotely
      if (reactionId) {
        const messageRemoveReaction: MsgRemoveReactionEncodeObject = {
          typeUrl: MsgRemoveReactionTypeUrl,
          value: {
            subspaceId: Long.fromNumber(subspaceId),
            postId: Long.fromNumber(post.id),
            reactionId,
            user: activeAddress,
          },
        };

        // If the transaction is successful, remove the reaction from the local storage as well
        const onSuccess = () => {
          removePostReaction(post);
        };

        // If the transaction is canceled or errors, revert the removal of the reaction.
        const onCancelOrError = () => {
          setPostReactionStatus(post, DataStatus.SYNCED);
        };

        // Broadcast the transaction
        await broadcastTx([messageRemoveReaction], {
          optimistic: true,
          onSuccess,
          onCancel: onCancelOrError,
          onError: onCancelOrError,
        });
      }
    },
    [
      setPostReactionStatus,
      getReaction,
      activeAddress,
      subspaceId,
      broadcastTx,
      removePostReaction,
    ],
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
      const doesReactionExist = hasPostReaction(post);
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
