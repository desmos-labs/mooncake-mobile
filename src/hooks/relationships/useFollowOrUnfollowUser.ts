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
const useFollowUser = () => {
  const subspaceId = useAppStateValue('subspaceId');
  const broadcastTx = useBroadcastTx();

  const addFollowedUser = useAddFollowedUser();
  const removeFollowedUser = useRemoveFollowedUser();

  return React.useCallback(
    async (user: string, counterparty: DesmosProfile) => {
      // Add the relationships locally
      addFollowedUser(user, counterparty);

      // If the relationship does not exist on the server, create it
      const messageCreateRelationship: MsgCreateRelationshipEncodeObject = {
        typeUrl: MsgCreateRelationshipTypeUrl,
        value: {
          subspaceId: Long.fromNumber(subspaceId),
          counterparty: counterparty.address,
          signer: user,
        },
      };

      // Broadcast the transaction
      const result = await broadcastTx([messageCreateRelationship], { optimistic: true });
      if (result.isErr()) {
        // If the transaction is canceled or errors, remove the added relationship
        removeFollowedUser(user, counterparty.address);
      }
    },
    [addFollowedUser, subspaceId, broadcastTx, removeFollowedUser],
  );
};

/**
 * Hook that allows to unfollow a user, both locally and remotely.
 */
const useUnfollowUser = () => {
  const subspaceId = useAppStateValue('subspaceId');
  const broadcastTx = useBroadcastTx();

  const setFollowedUserStatus = useSetFollowedUserStatus();

  return React.useCallback(
    async (user: string, counterparty: DesmosProfile) => {
      // Delete the relationship locally
      setFollowedUserStatus(user, counterparty.address, DataStatus.DELETED_LOCALLY);

      // If the relationship exists remotely, remote it from the server
      const messageDeleteRelationship: MsgDeleteRelationshipEncodeObject = {
        typeUrl: MsgDeleteRelationshipTypeUrl,
        value: {
          subspaceId: Long.fromNumber(subspaceId),
          counterparty: counterparty.address,
          signer: user,
        },
      };

      // Broadcasts the transaction
      const result = await broadcastTx([messageDeleteRelationship], { optimistic: true });
      if (result.isErr()) {
        // If the transaction is canceled or errors, re-add the removed relationship
        setFollowedUserStatus(user, counterparty.address, DataStatus.SYNCED);
      }
    },
    [setFollowedUserStatus, subspaceId, broadcastTx],
  );
};

/**
 * Hook that allows to follow or unfollow a user on behalf of the current application user,
 * based on whether the user is already followed or not.
 */
const useFollowOrUnfollowUser = () => {
  const activeAddress = useActiveAccountAddress();

  const hasFollowedUser = useHasFollowedUser();
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();

  return React.useCallback(
    async (counterparty: DesmosProfile) => {
      if (!activeAddress) {
        throw new Error('Trying to follow or unfollow a user, without active user');
      }

      const isFollowing = hasFollowedUser(activeAddress, counterparty.address);
      if (isFollowing) {
        await unfollowUser(activeAddress, counterparty);
      } else {
        await followUser(activeAddress, counterparty);
      }
    },
    [activeAddress, hasFollowedUser, unfollowUser, followUser],
  );
};

export default useFollowOrUnfollowUser;
