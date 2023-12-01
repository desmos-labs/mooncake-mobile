import React from 'react';
import { EncodeObject } from '@cosmjs/proto-signing';
import useBroadcastTxOnChain from 'hooks/transactions/useBroadcastTxOnChain';
import { err, ok, Result } from 'neverthrow';
import { isCanceledOperationError, isCentralizedApiNotGrantedError } from 'types/error';
import { useActiveAccountAddress } from '@recoil/accounts';
import { Posts, Relationships, Reactions, Subspaces, Reports } from '@desmoslabs/desmjs';
import { useStoredProfiles } from '@recoil/profiles';
import useGetOnChainProfile from 'hooks/profiles/useGetOnChainProfile';
import usePromptRequestSaveProfile from 'hooks/transactions/usePrompRequestSaveProfile';
import usePromptRequestCentralizedAPIsPermissions from 'hooks/transactions/usePromptRequestCentralizedAPIsPermissions';

export interface BroadcastOptions {
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
  Posts.v3.MsgCreatePostTypeUrl,
  Posts.v3.MsgDeletePostTypeUrl,
  // Reactions
  Reactions.v1.MsgAddReactionTypeUrl,
  Reactions.v1.MsgRemoveReactionTypeUrl,
  // Subspace management
  Subspaces.v3.MsgCreateSubspaceTypeUrl,
  Subspaces.v3.MsgDeleteSubspaceTypeUrl,
  // Report
  Reports.v1.MsgCreateReportTypeUrl,
  // Relationships
  Relationships.v1.MsgCreateRelationshipTypeUrl,
  Relationships.v1.MsgDeleteRelationshipTypeUrl,
  // Block/unblock
  Relationships.v1.MsgBlockUserTypeUrl,
  Relationships.v1.MsgUnblockUserTypeUrl,
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

      const broadcastOnChain = options?.onChain === true;
      let msgToBroadcast: EncodeObject[] = msgs;
      // Don't check the permissions if the user forced the
      // transaction to be on chain.
      if (!broadcastOnChain) {
        const permissionsPromptResult = await promptAccountPermissions(msgs);
        if (permissionsPromptResult.isErr()) {
          if (!isCentralizedApiNotGrantedError(permissionsPromptResult.error)) {
            // The user has canceled the operation, or some other errors have happened
            // We need to return such error
            return err(permissionsPromptResult.error);
          }
        } else if (permissionsPromptResult.isOk() && permissionsPromptResult.value.length > 0) {
          // User accepted to give us the permissions, extends the broadcast
          // messages to include the permissions messages so that from
          // the next tx we can use the centralized APIs.
          msgToBroadcast = [...permissionsPromptResult.value, ...msgs];
        }
      }

      // Broadcast the transaction regularly
      const txOptions = { memo: options?.memo };
      const result = broadcastTxOnChain(msgToBroadcast, txOptions);

      return result.andThen(pendingTx => {
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
      promptRequestSaveProfile,
      storedProfiles,
      promptAccountPermissions,
    ],
  );
};

export default useBroadcastTx;
