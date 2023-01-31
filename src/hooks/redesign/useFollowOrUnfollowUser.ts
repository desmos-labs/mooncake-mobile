import React from 'react';
import useBroadcastTx from 'hooks/redesign/useBroadcastTx';
import {
  useAddFollowedUser,
  useHasFollowedUser,
  useRemoveFollowedUser,
} from '@recoil/redesign/relationships';
import {useLazyQuery} from '@apollo/client';
import GetRelationshipForAddress from 'services/graphql/queries/GetRelationshipForAddress';
import {
  MsgCreateRelationshipEncodeObject,
  MsgCreateRelationshipTypeUrl,
  MsgDeleteRelationshipEncodeObject,
  MsgDeleteRelationshipTypeUrl,
} from '@desmoslabs/desmjs';
import useAppConfig from 'hooks/redesign/useAppConfig';
import {useActiveAddress} from '@recoil/redesign/wallets';

/**
 * Hook to know if a relationship exists on the GraphQL server (and hence on the chain) or not.
 */
const useDoesRelationshipExistRemotely = () => {
  const [getRelationship] = useLazyQuery(GetRelationshipForAddress, {
    fetchPolicy: 'network-only',
  });

  return React.useCallback(
    async (address: string, counterparty: string) => {
      const {data} = await getRelationship({
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
  const appConfig = useAppConfig();
  const broadcastTx = useBroadcastTx();
  const addFollowedUser = useAddFollowedUser();
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
            subspaceId: appConfig.subspaceId,
            counterparty,
            signer: address,
          },
        };

        // If the transaction is canceled or errors, remove the added relationship
        const onCancelOrError = () => {
          removeFollowedUser(address, counterparty);
        };

        // Broadcast the transaction
        await broadcastTx([messageCreateRelationship], {
          optimistic: true,
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
  const appConfig = useAppConfig();
  const broadcastTx = useBroadcastTx();
  const addFollowedUser = useAddFollowedUser();
  const removeFollowedUser = useRemoveFollowedUser();

  const doesRelationshipExist = useDoesRelationshipExistRemotely();

  return React.useCallback(
    async (address: string, counterparty: string) => {
      // Delete the relationship locally
      removeFollowedUser(address, counterparty);

      const existsRemotely = await doesRelationshipExist(address, counterparty);
      if (existsRemotely) {
        // If the relationship exists remotely, remote it from the server
        const messageDeleteRelationship: MsgDeleteRelationshipEncodeObject = {
          typeUrl: MsgDeleteRelationshipTypeUrl,
          value: {
            subspaceId: appConfig.subspaceId,
            counterparty,
            signer: address,
          },
        };

        // If the transaction is canceled or errors, re-add the removed relationship
        const onCancelOrError = () => {
          addFollowedUser(address, counterparty);
        };

        // Broadcasts the transaction
        await broadcastTx([messageDeleteRelationship], {
          optimistic: true,
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
  const activeAddress = useActiveAddress();
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
