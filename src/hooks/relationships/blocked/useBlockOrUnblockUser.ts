import { Relationships } from '@desmoslabs/desmjs';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useAppStateValue } from '@recoil/appState';
import {
  useAddBlockedUser,
  useHasBlockedUser,
  useRemoveBlockedUser,
  useSetBlockedUserStatus,
} from '@recoil/blockedRelationships';
import { useRemovePostsByAuthor } from '@recoil/posts';
import useBroadcastTx from 'hooks/tx/useBroadcastTx';
import usePromptConfirmUnblock from 'hooks/usePromptConfirmUnblock';
import Long from 'long';
import React from 'react';
import { DataStatus } from 'types/cache';
import { DesmosProfile } from 'types/desmos';

/**
 * Hook that allows to block a user both remotely and locally.
 */
const useBlockUser = () => {
  const activeAccount = useActiveAccountAddress();

  if (!activeAccount) {
    throw new Error('Trying to block or unblock, without an active account');
  }
  const subspaceId = useAppStateValue('subspaceId');
  const broadcastTx = useBroadcastTx();

  const addBlockedUser = useAddBlockedUser();
  const removeBlockedUser = useRemoveBlockedUser();
  const removePostsForUser = useRemovePostsByAuthor(activeAccount);

  return React.useCallback(
    async (user: string, counterparty: DesmosProfile) => {
      // Add the blocked user locally
      addBlockedUser(user, counterparty);

      // If the blocked status does not exist on the server, create it
      const messageBlockUser: Relationships.v1.MsgBlockUserEncodeObject = {
        typeUrl: Relationships.v1.MsgBlockUserTypeUrl,
        value: {
          subspaceId: Long.fromNumber(subspaceId),
          blocker: user,
          blocked: counterparty.address,
          // empty reason for now, until block reason is implemented on the frontend
          reason: '',
        },
      };

      // Broadcast the transaction
      const result = await broadcastTx([messageBlockUser]);

      if (result.isErr()) {
        // If the transaction is canceled or errors, remove the added blocked relationship
        removeBlockedUser(user, counterparty.address);
      } else {
        // remove cached posts for the blocked user.
        removePostsForUser(counterparty);
      }
    },
    [addBlockedUser, subspaceId, broadcastTx, removePostsForUser, removeBlockedUser],
  );
};

/**
 * Hook that allows to unblock a user, both locally and remotely.
 */
const useUnblockUser = () => {
  const subspaceId = useAppStateValue('subspaceId');
  const broadcastTx = useBroadcastTx();
  const promptConfirmUnblock = usePromptConfirmUnblock();

  const setBlockedUserStatus = useSetBlockedUserStatus();

  return React.useCallback(
    async (user: string, counterparty: DesmosProfile) => {
      // Display counterparty's dTag if they have not set a nickname
      const confirmationResult = await promptConfirmUnblock(
        counterparty.nickname || `@${counterparty.dTag}`,
      );

      // early exit if the user denies the prompt above.
      if (!confirmationResult.isOk()) return;

      // Delete the blocked relationship locally
      setBlockedUserStatus(user, counterparty.address, DataStatus.DELETED_LOCALLY);

      // If the block exists remotely, remote it from the server
      const messageUnblock: Relationships.v1.MsgUnblockUserEncodeObject = {
        typeUrl: Relationships.v1.MsgUnblockUserTypeUrl,
        value: {
          subspaceId: Long.fromNumber(subspaceId),
          blocker: user,
          blocked: counterparty.address,
        },
      };

      // Broadcasts the transaction
      const result = await broadcastTx([messageUnblock]);
      if (result.isErr()) {
        // If the transaction is canceled or errors, re-add the removed blocked status
        setBlockedUserStatus(user, counterparty.address, DataStatus.SYNCED);
      }
    },
    [promptConfirmUnblock, setBlockedUserStatus, subspaceId, broadcastTx],
  );
};

/**
 * Hook that allows to block or unblock a user on behalf of the current application user,
 * based on whether the user is already followed or not.
 */
const useBlockOrUnblockUser = () => {
  const activeAddress = useActiveAccountAddress();

  const hasBlockedUser = useHasBlockedUser();
  const blockUser = useBlockUser();
  const unblockUser = useUnblockUser();

  return React.useCallback(
    async (counterparty: DesmosProfile) => {
      if (!activeAddress) {
        throw new Error('Trying to follow or unfollow a user, without active user');
      }

      const isBlocked = hasBlockedUser(activeAddress, counterparty.address);
      if (isBlocked) {
        await unblockUser(activeAddress, counterparty);
      } else {
        await blockUser(activeAddress, counterparty);
      }
    },
    [activeAddress, hasBlockedUser, unblockUser, blockUser],
  );
};

export default useBlockOrUnblockUser;
