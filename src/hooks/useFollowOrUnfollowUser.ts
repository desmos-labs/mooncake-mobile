import React from 'react';
import useBroadcastTx from 'hooks/useBroadcastTx';
import {
  useAddFollowedUser,
  useHasFollowedUser,
  useRemoveFollowedUser,
  useSetFollowedUserStatus,
} from '@recoil/relationships';
import { useLazyQuery } from '@apollo/client';
import GetRelationshipForAddress from 'services/graphql/queries/GetRelationshipForAddress';
import {
  MsgCreateRelationshipEncodeObject,
  MsgCreateRelationshipTypeUrl,
  MsgDeleteRelationshipEncodeObject,
  MsgDeleteRelationshipTypeUrl,
} from '@desmoslabs/desmjs';
import { useActiveAccountAddress } from '@recoil/wallets';
import { DataStatus } from 'types/desmos';
import { useAppStateValue } from '@recoil/appState';
import Long from 'long';

/**
 * Hook to know if a relationship exists on the GraphQL server (and hence on the chain) or not.
 */
const useDoesRelationshipExistRemotely = () => {
  const [getRelationship] = useLazyQuery(GetRelationshipForAddress, {
    fetchPolicy: 'network-only',
  });

  return React.useCallback(
    async (address: string, counterparty: string) => {
      const { data } = await getRelationship({
        variables: {
          userAddress: address,
          counterpartyAddress: counterparty,
        },
      });
      return data?.relationships?.length > 0;
    },
    [getRelationship],
  );
};

/**
 * Hook that allows to follow a user both remotely and locally.
 */
const useFollowUser = () => {
  const subspaceId = useAppStateValue('subspaceId');
  const broadcastTx = useBroadcastTx();

  const addFollowedUser = useAddFollowedUser();
  const setFollowedUserStatus = useSetFollowedUserStatus();
  const removeFollowedUser = useRemoveFollowedUser();

  const doesRelationshipExist = useDoesRelationshipExistRemotely();

  return React.useCallback(
    async (address: string, counterparty: string) => {
      // Add the relationships locally
      addFollowedUser(address, counterparty);

      const existsRemotely = await doesRelationshipExist(address, counterparty);
      if (!existsRemotely) {
        // If the relationship does not exist on the server, create it
        const messageCreateRelationship: MsgCreateRelationshipEncodeObject = {
          typeUrl: MsgCreateRelationshipTypeUrl,
          value: {
            subspaceId: Long.fromNumber(subspaceId),
            counterparty,
            signer: address,
          },
        };

        // If the transaction succeeds, set it as synced.
        const onSuccess = () => {
          setFollowedUserStatus(address, counterparty, DataStatus.SYNCED);
        };

        // If the transaction is canceled or errors, remove the added relationship
        const onCancelOrError = () => {
          removeFollowedUser(address, counterparty);
        };

        // Broadcast the transaction
        await broadcastTx([messageCreateRelationship], {
          optimistic: true,
          onSuccess,
          onCancel: onCancelOrError,
          onError: onCancelOrError,
        });
      }
    },
    [doesRelationshipExist, broadcastTx, addFollowedUser],
  );
};

/**
 * Hook that allows to unfollow a user, both locally and remotely.
 */
const useUnfollowUser = () => {
  const subspaceId = useAppStateValue('subspaceId');
  const broadcastTx = useBroadcastTx();

  const setFollowedUserStatus = useSetFollowedUserStatus();
  const removeFollowedUser = useRemoveFollowedUser();

  const doesRelationshipExist = useDoesRelationshipExistRemotely();

  return React.useCallback(
    async (address: string, counterparty: string) => {
      // Delete the relationship locally
      setFollowedUserStatus(address, counterparty, DataStatus.DELETED_LOCALLY);

      const existsRemotely = await doesRelationshipExist(address, counterparty);
      if (existsRemotely) {
        // If the relationship exists remotely, remote it from the server
        const messageDeleteRelationship: MsgDeleteRelationshipEncodeObject = {
          typeUrl: MsgDeleteRelationshipTypeUrl,
          value: {
            subspaceId: Long.fromNumber(subspaceId),
            counterparty,
            signer: address,
          },
        };

        // If the transaction succeeds, delete the relationship locally as well
        const onSuccess = () => {
          removeFollowedUser(address, counterparty);
        };

        // If the transaction is canceled or errors, re-add the removed relationship
        const onCancelOrError = () => {
          setFollowedUserStatus(address, counterparty, DataStatus.SYNCED);
        };

        // Broadcasts the transaction
        await broadcastTx([messageDeleteRelationship], {
          optimistic: true,
          onSuccess,
          onCancel: onCancelOrError,
          onError: onCancelOrError,
        });
      }
    },
    [doesRelationshipExist, broadcastTx, removeFollowedUser],
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

  const hasFollowedUser = useHasFollowedUser();
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();

  return React.useCallback(
    async (counterparty: string) => {
      const isFollowing = hasFollowedUser(activeAddress, counterparty);
      if (isFollowing) {
        await unfollowUser(activeAddress, counterparty);
      } else {
        await followUser(activeAddress, counterparty);
      }
    },
    [hasFollowedUser, followUser, unfollowUser],
  );
};

export default useFollowOrUnfollowUser;
