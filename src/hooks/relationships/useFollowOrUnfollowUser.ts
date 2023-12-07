import React from 'react';
import {
  useAddFollowedUser,
  useHasFollowedUser,
  useRemoveFollowedUser,
  useSetFollowedUserStatus,
} from '@recoil/relationships';
import { Relationships } from '@desmoslabs/desmjs';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useAppStateValue } from '@recoil/appState';
import Long from 'long';
import { DataStatus } from 'types/cache';
import { DesmosProfile } from 'types/desmos';
import { useTranslation } from 'react-i18next';
import { useSignAndBroadcastTx } from 'hooks/tx/useSignAndBroadcastTx';
import { getProfileDisplayName } from 'lib/ProfileUtils';

/**
 * Hook that allows to follow a user both remotely and locally.
 */
const useFollowUser = () => {
  const { t } = useTranslation('relationships');
  const subspaceId = useAppStateValue('subspaceId');

  const addFollowedUser = useAddFollowedUser();
  const removeFollowedUser = useRemoveFollowedUser();

  const signAndBroadcastTx = useSignAndBroadcastTx();

  return React.useCallback(
    async (user: string, counterparty: DesmosProfile) => {
      // Add the relationships locally
      addFollowedUser(user, counterparty);

      // If the relationship does not exist on the server, create it
      const messageCreateRelationship: Relationships.v1.MsgCreateRelationshipEncodeObject = {
        typeUrl: Relationships.v1.MsgCreateRelationshipTypeUrl,
        value: {
          subspaceId: Long.fromNumber(subspaceId),
          counterparty: counterparty.address,
          signer: user,
        },
      };

      await signAndBroadcastTx([messageCreateRelationship], {
        onLoading: {
          popup: {
            title: t('creating relationship title'),
            description: t('creating relationship body', {
              user: getProfileDisplayName(counterparty),
            }),
          },
        },
        onSuccess: {
          popup: {
            title: t('relationship created title'),
            description: t('relationship created body', {
              user: getProfileDisplayName(counterparty),
            }),
          },
        },
        onError: {
          action: () => {
            // If the transaction is canceled or errors, remove the added relationship
            removeFollowedUser(user, counterparty.address);
          },
        },
      });
    },
    [addFollowedUser, subspaceId, removeFollowedUser],
  );
};

/**
 * Hook that allows to unfollow a user, both locally and remotely.
 */
const useUnfollowUser = () => {
  const { t } = useTranslation('relationships');
  const subspaceId = useAppStateValue('subspaceId');

  const setFollowedUserStatus = useSetFollowedUserStatus();

  const signAndBroadcastTx = useSignAndBroadcastTx();

  return React.useCallback(
    async (user: string, counterparty: DesmosProfile) => {
      // Delete the relationship locally
      setFollowedUserStatus(user, counterparty.address, DataStatus.DELETED_LOCALLY);

      // If the relationship exists remotely, remote it from the server
      const messageDeleteRelationship: Relationships.v1.MsgDeleteRelationshipEncodeObject = {
        typeUrl: Relationships.v1.MsgDeleteRelationshipTypeUrl,
        value: {
          subspaceId: Long.fromNumber(subspaceId),
          counterparty: counterparty.address,
          signer: user,
        },
      };

      // Broadcasts the transaction
      await signAndBroadcastTx([messageDeleteRelationship], {
        onLoading: {
          popup: {
            title: t('deleting relationship title'),
            description: t('deleting relationship body', {
              user: getProfileDisplayName(counterparty),
            }),
          },
        },
        onSuccess: {
          popup: {
            title: t('relationship deleted title'),
            description: t('relationship deleted body', {
              user: getProfileDisplayName(counterparty),
            }),
          },
        },
        onError: {
          action: () => {
            // If the transaction is canceled or errors, re-add the removed relationship
            setFollowedUserStatus(user, counterparty.address, DataStatus.SYNCED);
          },
        },
      });
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
