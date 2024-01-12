import React from 'react';
import { Relationships } from '@desmoslabs/desmjs';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useAppStateValue } from '@recoil/appState';
import Long from 'long';
import { DesmosProfile } from 'types/desmos';
import { useTranslation } from 'react-i18next';
import useSignAndBroadcastTx from 'hooks/tx/useSignAndBroadcastTx';
import { getProfileDisplayDTag } from 'lib/ProfileUtils';
import useGetIsFollowing from 'hooks/relationships/useGetIsFollowing';

/**
 * Hook that allows to follow a user both remotely and locally.
 */
const useFollowUser = () => {
  const { t } = useTranslation('relationships');
  const subspaceId = useAppStateValue('subspaceId');

  const signAndBroadcastTx = useSignAndBroadcastTx();

  return React.useCallback(
    async (user: string, counterparty: DesmosProfile) => {
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
          },
        },
        onSuccess: {
          popup: {
            title: t('relationship created title'),
            description: t('relationship created body', {
              user: getProfileDisplayDTag(counterparty),
            }),
          },
        },
      });
    },
    [signAndBroadcastTx, subspaceId, t],
  );
};

/**
 * Hook that allows to unfollow a user, both locally and remotely.
 */
const useUnfollowUser = () => {
  const { t } = useTranslation('relationships');
  const subspaceId = useAppStateValue('subspaceId');

  const signAndBroadcastTx = useSignAndBroadcastTx();

  return React.useCallback(
    async (user: string, counterparty: DesmosProfile) => {
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
          },
        },
        onSuccess: {
          popup: {
            title: t('relationship deleted title'),
            description: t('relationship deleted body', {
              user: getProfileDisplayDTag(counterparty),
            }),
          },
        },
      });
    },
    [subspaceId, signAndBroadcastTx, t],
  );
};

/**
 * Hook that allows to follow or unfollow a user on behalf of the current application user,
 * based on whether the user is already followed or not.
 */
const useFollowOrUnfollowUser = () => {
  const activeAddress = useActiveAccountAddress();

  const isFollowing = useGetIsFollowing();
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();

  return React.useCallback(
    async (counterparty: DesmosProfile) => {
      if (!activeAddress) {
        throw new Error('Trying to follow or unfollow a user, without active user');
      }

      const isUserFollowingCounterparty = await isFollowing(activeAddress, counterparty.address);
      if (isUserFollowingCounterparty) {
        await unfollowUser(activeAddress, counterparty);
      } else {
        await followUser(activeAddress, counterparty);
      }
    },
    [activeAddress, isFollowing, unfollowUser, followUser],
  );
};

export default useFollowOrUnfollowUser;
