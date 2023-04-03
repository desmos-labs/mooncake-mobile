import React from 'react';
import useBroadcastTx from 'hooks/transactions/useBroadcastTx';
import {
  useAddFollowedUser,
  useHasFollowedUser,
  useRemoveFollowedUser,
  useSetFollowedUserStatus,
} from '@recoil/relationships';
import {
  MsgCreateRelationshipEncodeObject,
  MsgCreateRelationshipTypeUrl,
  MsgDeleteRelationshipEncodeObject,
  MsgDeleteRelationshipTypeUrl,
} from '@desmoslabs/desmjs';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useAppStateValue } from '@recoil/appState';
import Long from 'long';
import { DataStatus } from 'types/cache';
import { DesmosProfile } from 'types/desmos';

/**
 * Hook that allows to follow a user both remotely and locally.
 */
const useFollowUser = (activeAddress: string) => {
  const subspaceId = useAppStateValue('subspaceId');
  const broadcastTx = useBroadcastTx();

  const addFollowedUser = useAddFollowedUser(activeAddress);
  const setFollowedUserStatus = useSetFollowedUserStatus(activeAddress);
  const removeFollowedUser = useRemoveFollowedUser(activeAddress);

  return React.useCallback(
    async (counterparty: DesmosProfile) => {
      // Add the relationships locally
      addFollowedUser(counterparty);

      // If the relationship does not exist on the server, create it
      const messageCreateRelationship: MsgCreateRelationshipEncodeObject = {
        typeUrl: MsgCreateRelationshipTypeUrl,
        value: {
          subspaceId: Long.fromNumber(subspaceId),
          counterparty: counterparty.address,
          signer: activeAddress,
        },
      };

      // Broadcast the transaction
      const result = await broadcastTx([messageCreateRelationship], { optimistic: true });
      if (result.isErr()) {
        // If the transaction is canceled or errors, remove the added relationship
        removeFollowedUser(counterparty.address);
        return;
      }

      // If the transaction succeeds, set it as synced.
      setFollowedUserStatus(counterparty.address, DataStatus.SYNCED);
    },
    [
      addFollowedUser,
      activeAddress,
      subspaceId,
      broadcastTx,
      setFollowedUserStatus,
      removeFollowedUser,
    ],
  );
};

/**
 * Hook that allows to unfollow a user, both locally and remotely.
 */
const useUnfollowUser = (activeAddress: string) => {
  const subspaceId = useAppStateValue('subspaceId');
  const broadcastTx = useBroadcastTx();

  const setFollowedUserStatus = useSetFollowedUserStatus(activeAddress);
  const removeFollowedUser = useRemoveFollowedUser(activeAddress);

  return React.useCallback(
    async (counterparty: DesmosProfile) => {
      // Delete the relationship locally
      setFollowedUserStatus(counterparty.address, DataStatus.DELETED_LOCALLY);

      // If the relationship exists remotely, remote it from the server
      const messageDeleteRelationship: MsgDeleteRelationshipEncodeObject = {
        typeUrl: MsgDeleteRelationshipTypeUrl,
        value: {
          subspaceId: Long.fromNumber(subspaceId),
          counterparty: counterparty.address,
          signer: activeAddress,
        },
      };

      // Broadcasts the transaction
      const result = await broadcastTx([messageDeleteRelationship], { optimistic: true });
      if (result.isErr()) {
        // If the transaction is canceled or errors, re-add the removed relationship
        setFollowedUserStatus(counterparty.address, DataStatus.SYNCED);
        return;
      }

      // If the transaction succeeds, delete the relationship locally as well
      removeFollowedUser(counterparty.address);
    },
    [setFollowedUserStatus, activeAddress, subspaceId, broadcastTx, removeFollowedUser],
  );
};

/**
 * Hook that allows to follow or unfollow a user on behalf of the current application user,
 * based on whether the user is already followed or not.
 */
const useFollowOrUnfollowUser = () => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error('Trying to follow or unfollow a user, without active user');
  }

  const hasFollowedUser = useHasFollowedUser(activeAddress);
  const followUser = useFollowUser(activeAddress);
  const unfollowUser = useUnfollowUser(activeAddress);

  return React.useCallback(
    async (counterparty: DesmosProfile) => {
      const isFollowing = hasFollowedUser(counterparty.address);
      if (isFollowing) {
        await unfollowUser(counterparty);
      } else {
        await followUser(counterparty);
      }
    },
    [hasFollowedUser, unfollowUser, followUser],
  );
};

export default useFollowOrUnfollowUser;
