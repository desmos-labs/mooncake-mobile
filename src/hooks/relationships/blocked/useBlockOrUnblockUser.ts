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
import usePromptConfirmUnblock from 'hooks/usePromptConfirmUnblock';
import Long from 'long';
import React from 'react';
import { DataStatus } from 'types/cache';
import { DesmosProfile } from 'types/desmos';
import { useTranslation } from 'react-i18next';
import { useSignAndBroadcastTx } from 'hooks/tx/useSignAndBroadcastTx';
import { getProfileDisplayName } from 'lib/ProfileUtils';

/**
 * Hook that allows to block a user both remotely and locally.
 */
const useBlockUser = () => {
  const { t } = useTranslation('reportUser');
  const subspaceId = useAppStateValue('subspaceId');

  const signAndBroadcastTx = useSignAndBroadcastTx();

  const addBlockedUser = useAddBlockedUser();
  const removeBlockedUser = useRemoveBlockedUser();
  const removePostsForUser = useRemovePostsByAuthor();

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
          // Empty reason for now, until block reason is implemented on the frontend
          reason: '',
        },
      };

      // Broadcast the transaction
      await signAndBroadcastTx([messageBlockUser], {
        onLoading: {
          popup: {
            title: t('user being blocked title'),
          },
        },
        onSuccess: {
          popup: {
            title: t('user blocked title'),
            description: t('user blocked text', { user: getProfileDisplayName(counterparty) }),
          },
          action: () => {
            // Remove the cached posts for the blocked user.
            removePostsForUser(user, counterparty);
          },
        },
        onError: {
          action: () => {
            // If the transaction is canceled or errors, remove the added blocked relationship
            removeBlockedUser(user, counterparty.address);
          },
        },
      });
    },
    [addBlockedUser, subspaceId, signAndBroadcastTx, t, removePostsForUser, removeBlockedUser],
  );
};

/**
 * Hook that allows to unblock a user, both locally and remotely.
 */
const useUnblockUser = () => {
  const { t } = useTranslation('reportUser');
  const subspaceId = useAppStateValue('subspaceId');

  const promptConfirmUnblock = usePromptConfirmUnblock();
  const setBlockedUserStatus = useSetBlockedUserStatus();

  const signAndBroadcastTx = useSignAndBroadcastTx();

  return React.useCallback(
    async (user: string, counterparty: DesmosProfile) => {
      // Display counterparty's DTag if they have not set a nickname
      const confirmationResult = await promptConfirmUnblock(getProfileDisplayName(counterparty));

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
      await signAndBroadcastTx([messageUnblock], {
        onLoading: {
          popup: {
            title: t('user being unblocked title'),
          },
        },
        onSuccess: {
          popup: {
            title: t('user unblocked title'),
            description: t('user unblocked body', { user: getProfileDisplayName(counterparty) }),
          },
        },
        onError: {
          action: () => {
            // If the transaction is canceled or errors, re-add the removed blocked status
            setBlockedUserStatus(user, counterparty.address, DataStatus.SYNCED);
          },
        },
      });
    },
    [promptConfirmUnblock, setBlockedUserStatus, signAndBroadcastTx, subspaceId, t],
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
