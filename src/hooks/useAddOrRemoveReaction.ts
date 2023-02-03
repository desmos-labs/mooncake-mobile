import React from 'react';
import { useActiveAccountAddress } from '@recoil/wallets';
import {
  useAddPostReaction,
  useHasPostReaction,
  useRemovePostReaction,
  useSetPostReactionStatus,
} from '@recoil/reactions';
import { DataStatus, getLikeReactionId } from 'types/desmos';
import useBroadcastTx from 'hooks/useBroadcastTx';
import {
  MsgAddReactionEncodeObject,
  MsgAddReactionTypeUrl,
  MsgRemoveReactionEncodeObject,
  MsgRemoveReactionTypeUrl,
} from '@desmoslabs/desmjs';
import Long from 'long';
import { useLazyQuery } from '@apollo/client';
import GetPostReactionForAddress from 'services/graphql/queries/GetPostReactionForAddress';
import { Post } from 'types/posts';
import { useAppStateValue } from '@recoil/appState';
import { registeredReactionValueToAny } from '@desmoslabs/desmjs/build/aminomessages/reactions';

/**
 * Hook that allows to add a reaction both remotely and locally.
 */
const useAddReaction = () => {
  const subspaceId = useAppStateValue('subspaceId');
  const subspaceParams = useAppStateValue('subspaceParams');
  const broadcastTx = useBroadcastTx();

  const addPostReaction = useAddPostReaction();
  const setPostReactionStatus = useSetPostReactionStatus();
  const removePostReaction = useRemovePostReaction();

  const [getReaction] = useLazyQuery(GetPostReactionForAddress, {
    fetchPolicy: 'network-only',
  });

  return React.useCallback(
    async (post: Post, address: string) => {
      // Add the reaction locally
      addPostReaction(address, post);

      // Check if the reaction exists on the server
      const { data } = await getReaction({
        variables: {
          postId: post.id,
          userAddress: address,
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
            user: address,
          },
        };

        // If the transaction is successful, set the reaction as synced with the chain
        const onSuccess = () => {
          setPostReactionStatus(address, post, DataStatus.SYNCED);
        };

        // If the transaction is canceled or errors, revert the addition of the reaction.
        const onCancelOrError = () => {
          removePostReaction(address, post);
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
    [subspaceId, subspaceParams, getReaction, broadcastTx, addPostReaction],
  );
};

/**
 * Hook that allows to remove a reaction both remotely (if present) and locally.
 */
const useRemoveReaction = () => {
  const subspaceId = useAppStateValue('subspaceId');
  const broadcastTx = useBroadcastTx();

  const setPostReactionStatus = useSetPostReactionStatus();
  const removePostReaction = useRemovePostReaction();

  const [getReaction] = useLazyQuery(GetPostReactionForAddress, {
    fetchPolicy: 'network-only',
  });

  return React.useCallback(
    async (post: Post, address: string) => {
      // Remove the reaction locally
      setPostReactionStatus(address, post, DataStatus.DELETED_LOCALLY);

      // Get the reaction id from the server
      const { data } = await getReaction({
        variables: {
          postId: post.id,
          userAddress: address,
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
            user: address,
          },
        };

        // If the transaction is successful, remove the reaction from the local storage as well
        const onSuccess = () => {
          removePostReaction(address, post);
        };

        // If the transaction is canceled or errors, revert the removal of the reaction.
        const onCancelOrError = () => {
          setPostReactionStatus(address, post, DataStatus.SYNCED);
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
    [subspaceId, getReaction, broadcastTx, removePostReaction],
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

  const hasPostReaction = useHasPostReaction();
  const addReaction = useAddReaction();
  const removeReaction = useRemoveReaction();

  return React.useCallback(
    async (post: Post) => {
      const doesReactionExist = hasPostReaction(activeAddress, post);
      if (doesReactionExist) {
        await removeReaction(post, activeAddress);
      } else {
        await addReaction(post, activeAddress);
      }
    },
    [hasPostReaction, addReaction, removeReaction],
  );
};

export default useAddOrRemoveReaction;
