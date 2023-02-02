import React from 'react';
import { useActiveAccountAddress } from '@recoil/wallets';
import {
  useAddPostReaction,
  useHasPostReaction,
  useRemovePostReaction,
  useSetPostReactionStatus,
} from '@recoil/reactions';
import { DataStatus, PostID } from 'types/desmos';
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
import { convertRegisteredReactionValueToAny } from '@desmoslabs/desmjs/build/aminomessages/reactions';
import useAppConfig from 'hooks/useAppConfig';

/**
 * Hook that allows to add a reaction both remotely and locally.
 */
const useAddReaction = () => {
  const config = useAppConfig();
  const broadcastTx = useBroadcastTx();

  const addPostReaction = useAddPostReaction();
  const setPostReactionStatus = useSetPostReactionStatus();
  const removePostReaction = useRemovePostReaction();

  const [getReaction] = useLazyQuery(GetPostReactionForAddress, {
    fetchPolicy: 'network-only',
  });

  return React.useCallback(
    async (postId: PostID, address: string) => {
      // Add the reaction locally
      addPostReaction(address, postId);

      // Check if the reaction exists on the server
      const { data } = await getReaction({
        variables: {
          postId,
          userAddress: address,
        },
      });

      const hasReaction = data?.reactions?.length > 0;
      if (!hasReaction) {
        // If the reaction does not exist on the server, add it there
        const messageAddReaction: MsgAddReactionEncodeObject = {
          typeUrl: MsgAddReactionTypeUrl,
          value: {
            subspaceId: config.subspaceId,
            postId: Long.fromNumber(postId),
            value: convertRegisteredReactionValueToAny({
              registeredReactionId: config.registeredReactionId,
            }),
            user: address,
          },
        };

        // If the transaction is successful, set the reaction as synced with the chain
        const onSuccess = () => {
          setPostReactionStatus(address, postId, DataStatus.SYNCED);
        };

        // If the transaction is canceled or errors, revert the addition of the reaction.
        const onCancelOrError = () => {
          removePostReaction(address, postId);
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
    [config, getReaction, broadcastTx, addPostReaction],
  );
};

/**
 * Hook that allows to remove a reaction both remotely (if present) and locally.
 */
const useRemoveReaction = () => {
  const config = useAppConfig();
  const broadcastTx = useBroadcastTx();

  const setPostReactionStatus = useSetPostReactionStatus();
  const removePostReaction = useRemovePostReaction();

  const [getReaction] = useLazyQuery(GetPostReactionForAddress, {
    fetchPolicy: 'network-only',
  });

  return React.useCallback(
    async (postId: PostID, address: string) => {
      // Remove the reaction locally
      setPostReactionStatus(address, postId, DataStatus.DELETED_LOCALLY);

      // Get the reaction id from the server
      const { data } = await getReaction({
        variables: {
          postId,
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
            subspaceId: config.subspaceId,
            postId: Long.fromNumber(postId),
            reactionId,
            user: address,
          },
        };

        // If the transaction is successful, remove the reaction from the local storage as well
        const onSuccess = () => {
          removePostReaction(address, postId);
        };

        // If the transaction is canceled or errors, revert the removal of the reaction.
        const onCancelOrError = () => {
          setPostReactionStatus(address, postId, DataStatus.SYNCED);
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
    [config, getReaction, broadcastTx, removePostReaction],
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
    async (postId: PostID) => {
      const doesReactionExist = hasPostReaction(activeAddress, postId);
      if (doesReactionExist) {
        await removeReaction(postId, activeAddress);
      } else {
        await addReaction(postId, activeAddress);
      }
    },
    [hasPostReaction, addReaction, removeReaction],
  );
};

export default useAddOrRemoveReaction;
