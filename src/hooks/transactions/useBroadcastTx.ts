import React from 'react';
import { EncodeObject } from '@cosmjs/proto-signing';
import useBroadcastTxOnChain from 'hooks/transactions/useBroadcastTxOnChain';
import useBroadcastTxWithApi from 'hooks/transactions/useBroadcastTxWithApi';
import { err, ok, Result } from 'neverthrow';
import { isCanceledOperationError, isCentralizedApiNotGrantedError } from 'types/error';
import { useActiveAccountAddress } from '@recoil/accounts';
import {
  MsgAddReactionTypeUrl,
  MsgCreatePostTypeUrl,
  MsgCreateRelationshipTypeUrl,
  MsgCreateReportTypeUrl,
  MsgCreateSubspaceTypeUrl,
  MsgDeletePostTypeUrl,
  MsgDeleteRelationshipTypeUrl,
  MsgDeleteSubspaceTypeUrl,
  MsgRemoveReactionTypeUrl,
} from '@desmoslabs/desmjs';
import { useStoredProfiles } from '@recoil/profiles';
import useGetOnChainProfile from 'hooks/profiles/useGetOnChainProfile';
import usePromptRequestSaveProfile from 'hooks/transactions/usePrompRequestSaveProfile';
import usePromptRequestCentralizedAPIsPermissions from 'hooks/transactions/usePromptRequestCentralizedAPIsPermissions';
import { useStorePendingTransaction } from '@recoil/transactions';
import useTrackTransactionPerformed from 'hooks/analytics/useTrackTransactionPerformed';

export interface BroadcastOptions {
  /**
   * Whether the transaction should be broadcast using the optimistic APIs or not,
   * if undefined will be considered false.
   */
  readonly optimistic?: boolean;
  /**
   * Whether the transaction should be broadcast directly on chain,
   * if undefined will be considered false.
   */
  readonly onChain?: boolean;
  /**
   * Memo to be used when broadcasting the transaction.
   */
  readonly memo?: string;
}

export interface SuccessfulBroadcast {
  readonly txHash: string;
}

// List of messages that requires a profile to be executed.
const MsgsThatRequiresProfile = [
  // Post
  MsgCreatePostTypeUrl,
  MsgDeletePostTypeUrl,
  // Reactions
  MsgAddReactionTypeUrl,
  MsgRemoveReactionTypeUrl,
  // Subspace management
  MsgCreateSubspaceTypeUrl,
  MsgDeleteSubspaceTypeUrl,
  // Report
  MsgCreateReportTypeUrl,
  // Relationships
  MsgCreateRelationshipTypeUrl,
  MsgDeleteRelationshipTypeUrl,
];

/**
 * Function that returns true if the provided msg type url requires
 * an on chain profile to execute.
 * @param msgTyeUrl
 */
const msgRequiresProfile = (msgTyeUrl: string) => {
  return MsgsThatRequiresProfile.indexOf(msgTyeUrl) !== -1;
};

/**
 * Hook that allows to broadcast a transaction by going through the various UI based on the user's wallet type.
 *
 * If the user is using a wallet that has granted the centralized APIs the permission to sign on their behalf,
 * then the transaction will be broadcast using those APIs without requiring the user to manually authenticate
 * anything.
 *
 * If the user is using a wallet that has <b>not</b> granted the permission to sign on their behalf,
 * then they will be taken to the transaction authentication flow where they will have to manually confirm the
 * transaction. This flow will vary based on the wallet type the user is using (mnemonic, Ledger, Web3Auth, etc).
 *
 * @return a {@link Result} that can either be a {@link SuccessfulBroadcast} or an {@link Error}. If the user
 * cancels the broadcasting, a {@link CanceledOperationError} will be returned.
 */
const useBroadcastTx = () => {
  const activeAccountAddress = useActiveAccountAddress();

  const storedProfiles = useStoredProfiles();
  const fetchOnChainProfile = useGetOnChainProfile();

  const promptRequestSaveProfile = usePromptRequestSaveProfile();
  const promptAccountPermissions = usePromptRequestCentralizedAPIsPermissions();

  const broadcastTxOnChain = useBroadcastTxOnChain();
  const broadcastTxWithApi = useBroadcastTxWithApi();
  const storePendingTransaction = useStorePendingTransaction();
  const trackTransactionPerformed = useTrackTransactionPerformed();

  return React.useCallback(
    async (
      msgs: EncodeObject[],
      options?: BroadcastOptions,
    ): Promise<Result<SuccessfulBroadcast, Error>> => {
      if (!activeAccountAddress) {
        return err(new Error('Trying to broadcast a transaction without an active account'));
      }

      // Check if the user already has its profile stored on chain.
      const accountProfile = await fetchOnChainProfile(activeAccountAddress);

      const anyMsgRequiresProfile = msgs.some(msg => msgRequiresProfile(msg.typeUrl));
      if (!accountProfile && anyMsgRequiresProfile) {
        // If the user doesn't have a profile stored on chain and any of the messages
        // requires a profile, then we need to ask the user if they want to create one.
        const createProfileResult = await promptRequestSaveProfile(
          storedProfiles[activeAccountAddress],
        );

        if (createProfileResult.isErr()) {
          if (isCanceledOperationError(createProfileResult.error)) {
            return err(createProfileResult.error);
          } else {
            return err(new Error("Can't save the user's profile"));
          }
        }
      }

      let broadcastOnChain = options?.onChain === true;
      let msgToBroadcast: EncodeObject[] = msgs;
      // Don't check the permissions if the user forced the
      // transaction to be on chain.
      if (!broadcastOnChain) {
        const permissionsPromptResult = await promptAccountPermissions(msgs);
        if (permissionsPromptResult.isErr()) {
          if (isCentralizedApiNotGrantedError(permissionsPromptResult.error)) {
            // The user rejected, just proceed with the normal broadcast.
            broadcastOnChain = true;
          } else {
            // The user has canceled the operation, or some other errors have happened
            // We need to return such error
            return err(permissionsPromptResult.error);
          }
        } else if (permissionsPromptResult.isOk() && permissionsPromptResult.value.length > 0) {
          // User accepted to give us the permissions, extends the broadcast
          // messages to include the permissions messages so that from
          // the next tx we can use the centralized APIs.
          msgToBroadcast = [...permissionsPromptResult.value, ...msgs];
          // Force to use the on chain tx broadcasting.
          broadcastOnChain = true;
        }
      }

      // Broadcast the transaction regularly
      const txOptions = { memo: options?.memo };
      const result = broadcastOnChain
        ? broadcastTxOnChain(msgToBroadcast, txOptions)
        : broadcastTxWithApi(msgToBroadcast, {
            ...txOptions,
            optimistic: options?.optimistic,
          });

      return result.andThen(pendingTx => {
        // Store the transaction locally
        storePendingTransaction(pendingTx);
        trackTransactionPerformed(pendingTx);
        // Return the proper data
        return ok({
          txHash: pendingTx.hash,
        } as SuccessfulBroadcast);
      });
    },
    [
      activeAccountAddress,
      fetchOnChainProfile,
      broadcastTxOnChain,
      broadcastTxWithApi,
      promptRequestSaveProfile,
      storedProfiles,
      promptAccountPermissions,
      storePendingTransaction,
      trackTransactionPerformed,
    ],
  );
};

export default useBroadcastTx;
