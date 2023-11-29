import { EncodeObject } from '@cosmjs/proto-signing';
import { Reactions } from '@desmoslabs/desmjs';
import React from 'react';
import sleep from 'lib/sleep';
import { useActiveAccountAddress } from '@recoil/accounts';
import { CachedDataUpdate, CachedDataUpdateType } from 'lib/CacheUtils';
import { PostReaction } from 'types/desmos';
import useUpdatePendingReactions from 'hooks/reactions/useUpdatePendingReactions';
import useGetPostReaction from 'hooks/reactions/useGetPostReaction';
import {
  useGetCreatedPostReactionToSync,
  useGetDeletedPostReactionToSync,
} from '@recoil/reactions';

interface PostReactionData {
  readonly msgType:
    | typeof Reactions.v1.MsgAddReactionTypeUrl
    | typeof Reactions.v1.MsgRemoveReactionTypeUrl;
  readonly reaction: PostReaction;
}

/**
 * Function that retrieves all the external post ids from the messages of the given transaction.
 */
const useGetReactionsData = () => {
  const getCreatedPostReactionToSync = useGetCreatedPostReactionToSync();
  const getDeletedPostReactionToSync = useGetDeletedPostReactionToSync();

  return React.useCallback(
    (messages: EncodeObject[]) => {
      return messages
        .map(msg => {
          switch (msg.typeUrl) {
            // Handle pending MsgAddReaction messages
            case Reactions.v1.MsgAddReactionTypeUrl: {
              const value = msg.value as Reactions.v1.MsgAddReactionEncodeObject['value'];
              return {
                msgType: Reactions.v1.MsgAddReactionTypeUrl,
                reaction: getCreatedPostReactionToSync(
                  value.user,
                  value.subspaceId.toNumber(),
                  value.postId.toNumber(),
                ),
              };
            }

            // Handle pending MsgRemoveReaction messages
            case Reactions.v1.MsgRemoveReactionTypeUrl: {
              const value = msg.value as Reactions.v1.MsgRemoveReactionEncodeObject['value'];
              return {
                msgType: Reactions.v1.MsgRemoveReactionTypeUrl,
                reaction: getDeletedPostReactionToSync(
                  value.user,
                  value.subspaceId.toNumber(),
                  value.postId.toNumber(),
                ),
              };
            }

            // Handle any other message
            default:
              return undefined;
          }
        })
        .filter(
          (data): data is PostReactionData => data !== undefined && data.reaction !== undefined,
        );
    },
    [getCreatedPostReactionToSync, getDeletedPostReactionToSync],
  );
};

/**
 * Hook that allows to retrieve the reactions update for the given post data.
 */
const useGetReactionUpdates = () => {
  const getReaction = useGetPostReaction();

  return React.useCallback(
    async (data: PostReactionData) => {
      switch (data.msgType) {
        // Handle the addition of a new reaction
        // To do this, we simply need to retrieve the reaction from the chain and update the pending one
        // This will make sure the id of the reaction is correct
        case Reactions.v1.MsgAddReactionTypeUrl: {
          let onChainReaction = await getReaction(
            data.reaction.post.subspaceId,
            data.reaction.post.id,
            data.reaction.author.address,
          );
          if (!onChainReaction) {
            // The reaction might not have been parsed yet, we can simply wait for some seconds and try again
            await sleep(1000);
            onChainReaction = await getReaction(
              data.reaction.post.subspaceId,
              data.reaction.post.id,
              data.reaction.author.address,
            );
          }

          return {
            type: CachedDataUpdateType.UPDATED,
            original: data.reaction,
            updated: onChainReaction,
          } as CachedDataUpdate<PostReaction>;
        }

        // Handle the removal of a reaction
        // To do this, we simply need to remove the pending reaction
        case Reactions.v1.MsgRemoveReactionTypeUrl: {
          return {
            type: CachedDataUpdateType.DELETED,
            data: data.reaction,
          } as CachedDataUpdate<PostReaction>;
        }
      }
    },
    [getReaction],
  );
};

/**
 * Hook that allows to handle the messages of a transaction that are related to a post creation.
 */
const useHandleReactionsMessages = () => {
  const activeAddress = useActiveAccountAddress();

  const getReactionsData = useGetReactionsData();
  const getReactionUpdates = useGetReactionUpdates();
  const updatePendingReactions = useUpdatePendingReactions();

  return React.useCallback(
    async (messages: EncodeObject[]) => {
      if (!activeAddress) {
        throw new Error('Trying to handle reactions messages without active user');
      }

      const reactionsData = getReactionsData(messages);
      const updates = await Promise.all(reactionsData.map(getReactionUpdates));
      updatePendingReactions(activeAddress, updates);
    },
    [activeAddress, getReactionUpdates, getReactionsData, updatePendingReactions],
  );
};

export default useHandleReactionsMessages;
