import React from 'react';
import useBroadcastTx from 'hooks/transactions/useBroadcastTx';
import {
  MsgBlockUserEncodeObject,
  MsgUnblockUserEncodeObject,
  MsgUnblockUserTypeUrl,
} from '@desmoslabs/desmjs';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useAppStateValue } from '@recoil/appState';
import Long from 'long';
import { DataStatus } from 'types/cache';
import { DesmosProfile } from 'types/desmos';
import {
  useAddBlockedUser,
  useHasBlockedUser,
  useRemoveBlockedUser,
  useSetBlockedUserStatus,
} from '@recoil/blockedRelationships';
import { MsgBlockUserTypeUrl } from '@desmoslabs/desmjs/build/const/relationships';

/**
 * Hook that allows to block a user both remotely and locally.
 */
const useBlockUser = () => {
  const subspaceId = useAppStateValue('subspaceId');
  const broadcastTx = useBroadcastTx();

  const addBlockedUser = useAddBlockedUser();
  const removeBlockedUser = useRemoveBlockedUser();

  return React.useCallback(
    async (user: string, counterparty: DesmosProfile) => {
      // Add the blocked user locally
      addBlockedUser(user, counterparty);

      // If the blocked status does not exist on the server, create it
      const messageBlockUser: MsgBlockUserEncodeObject = {
        typeUrl: MsgBlockUserTypeUrl,
        value: {
          subspaceId: Long.fromNumber(subspaceId),
          blocker: user,
          blocked: counterparty.address,
          // empty reason for now, until block reason is implemented on the frontend
          reason: '',
        },
      };

      // Broadcast the transaction
      const result = await broadcastTx([messageBlockUser], { optimistic: true });
      if (result.isErr()) {
        // If the transaction is canceled or errors, remove the added blocked relationship
        removeBlockedUser(user, counterparty.address);
      }
    },
    [addBlockedUser, subspaceId, broadcastTx, removeBlockedUser],
  );
};

/**
 * Hook that allows to unblock a user, both locally and remotely.
 */
const useUnblockUser = () => {
  const subspaceId = useAppStateValue('subspaceId');
  const broadcastTx = useBroadcastTx();

  const setBlockedUserStatus = useSetBlockedUserStatus();

  return React.useCallback(
    async (user: string, counterparty: DesmosProfile) => {
      // Delete the blocked relationship locally
      setBlockedUserStatus(user, counterparty.address, DataStatus.DELETED_LOCALLY);

      // If the block exists remotely, remote it from the server
      const messageUnblock: MsgUnblockUserEncodeObject = {
        typeUrl: MsgUnblockUserTypeUrl,
        value: {
          subspaceId: Long.fromNumber(subspaceId),
          blocker: user,
          blocked: counterparty.address,
        },
      };

      // Broadcasts the transaction
      const result = await broadcastTx([messageUnblock], { optimistic: true });
      if (result.isErr()) {
        // If the transaction is canceled or errors, re-add the removed blocked status
        setBlockedUserStatus(user, counterparty.address, DataStatus.SYNCED);
      }
    },
    [setBlockedUserStatus, subspaceId, broadcastTx],
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
