import React from 'react';
import { EncodeObject } from '@cosmjs/proto-signing';
import useBroadcastTxOnChain from 'hooks/transactions/useBroadcastTxOnChain';
import useBroadcastTxWithApi from 'hooks/transactions/useBroadcastTxWithApi';
import { err, ok, Result } from 'neverthrow';
import { CanceledOperationError, isCanceledOperationError } from 'types/error';
import useGetAuthorizationInformation from 'hooks/authorizations/useGetAuthorizationInformation';
import { useActiveAccountAddress } from '@recoil/accounts';
import {
  buildGrantAllowanceEncodes,
  buildGrantMsgEncodes,
  getMissingAuthzPermissions,
  getMissingFeeGrantPermissions,
} from 'lib/AuthorizationsUtils';
import { useGetOnChainProfile } from 'hooks/profiles/useGetOnChainProfile';
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
import useSaveProfile from 'hooks/profiles/useSaveProfile';
import useReturnToCurrentScreen from 'hooks/navigation/useReturnToCurrentScreen';
import { DesmosProfile } from 'types/desmos';
import { useStoredProfiles } from '@recoil/profiles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useTranslation } from 'react-i18next';
import useButterConfig from 'hooks/config/useButterConfig';

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
 * Hook that provides a function that shows to the user that must create
 * a profile to perform the operation and let the user create the profile.
 */
const usePromptRequestSaveProfile = () => {
  const { t } = useTranslation('broadcastTx');
  const saveProfile = useSaveProfile();
  const returnToCurrentScreen = useReturnToCurrentScreen();
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  return React.useCallback(
    async (profile?: DesmosProfile): Promise<Result<void, CanceledOperationError>> => {
      const confirmProfileCreation = await new Promise<Result<void, CanceledOperationError>>(
        resolve => {
          navigation.navigate(ROUTES.BOTTOM_MODAL, {
            title: t('save created profile'),
            body: t('save created profile body'),
            onPressPrimary: () => {
              resolve(ok(undefined));
            },
            primaryButtonLabel: 'Save profile',
            onCancel: () => {
              resolve(err(new CanceledOperationError()));
            },
          });
        },
      );

      if (confirmProfileCreation.isErr()) {
        return err(confirmProfileCreation.error);
      }

      return new Promise(resolve => {
        saveProfile({
          profile,
          storeOnChain: true,
          onSuccess: () => {
            returnToCurrentScreen();
            resolve(ok(undefined));
          },
          onCancel: () => {
            resolve(err(new CanceledOperationError()));
          },
        });
      });
    },
    [navigation, returnToCurrentScreen, saveProfile, t],
  );
};

/**
 * Hook that provides a function that requests to the user if wants to give
 * the fee grants and authz permissions to the centralized API so that can
 * perform the operations in a more simple way.
 */
const usePromptRequestAccountPermissions = () => {
  const { t } = useTranslation('broadcastTx');
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const activeAccountAddress = useActiveAccountAddress()!;
  const { refetch: fetchAuthorizations } = useGetAuthorizationInformation(
    activeAccountAddress,
    true,
  );
  const { config } = useButterConfig();

  return React.useCallback(
    async (msgs: EncodeObject[]) => {
      const fetchAuthorizationsResult = await fetchAuthorizations();
      if (fetchAuthorizationsResult.isErr()) {
        return err(fetchAuthorizationsResult.error);
      }

      return new Promise<Result<EncodeObject[], Error>>(resolve => {
        const { authzGrants, feeGrants } = fetchAuthorizationsResult.value;
        const msgsTypes = msgs.map(msg => msg.typeUrl);
        const missingFeeGrantsPermissions = getMissingFeeGrantPermissions(msgsTypes, feeGrants);
        const missingAuthzPermissions = getMissingAuthzPermissions(msgsTypes, authzGrants);

        if (missingFeeGrantsPermissions.length > 0 || missingAuthzPermissions.length > 0) {
          let body = t('request simplified tx broadcasting body');
          if (missingFeeGrantsPermissions.length > 0) {
            body = `${body}${t('fee grant')}:\n${missingFeeGrantsPermissions.join('\n')}\n`;
          }
          if (missingAuthzPermissions.length > 0) {
            body = `${body}${t('sign on your behalf')}:\n${missingAuthzPermissions.join('\n')}`;
          }

          navigation.navigate(ROUTES.BOTTOM_MODAL, {
            title: t('request simplified tx broadcasting title'),
            body,
            primaryButtonLabel: 'Yes',
            onPressPrimary: () => {
              const grantPermissionsMsgs: EncodeObject[] = [];
              if (missingFeeGrantsPermissions.length > 0) {
                grantPermissionsMsgs.push(
                  ...buildGrantAllowanceEncodes(
                    feeGrants,
                    missingFeeGrantsPermissions,
                    config?.desmosAddress ?? '',
                    activeAccountAddress,
                  ),
                );
              }
              if (missingAuthzPermissions.length > 0) {
                grantPermissionsMsgs.push(
                  ...buildGrantMsgEncodes(
                    missingFeeGrantsPermissions,
                    config?.desmosAddress ?? '',
                    activeAccountAddress,
                  ),
                );
              }
              resolve(ok(grantPermissionsMsgs));
            },
            cancelButtonLabel: 'No',
            onCancel: () => {
              resolve(err(new CanceledOperationError()));
            },
          });
        } else {
          resolve(ok([]));
        }
      });
    },
    [activeAccountAddress, config?.desmosAddress, fetchAuthorizations, navigation, t],
  );
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
 *
 * TODO: Store the transaction as pending, and remove it from the pending queue when we get a notification from the server
 */
const useBroadcastTx = () => {
  const activeAccountAddress = useActiveAccountAddress()!;
  const broadcastTxOnChain = useBroadcastTxOnChain();
  const broadcastTxWithApi = useBroadcastTxWithApi();
  const fetchOnChainProfile = useGetOnChainProfile();
  const promptRequestSaveProfile = usePromptRequestSaveProfile();
  const storedProfiles = useStoredProfiles();
  const promptAccountPermissions = usePromptRequestAccountPermissions();

  return React.useCallback(
    async (
      msgs: EncodeObject[],
      options?: BroadcastOptions,
    ): Promise<Result<SuccessfulBroadcast, Error>> => {
      let broadcastOnChain = options?.onChain === true;
      const accountProfile = await fetchOnChainProfile(activeAccountAddress);
      if (
        accountProfile.isOk() &&
        accountProfile.value === undefined &&
        msgs.find(msg => msgRequiresProfile(msg.typeUrl)) !== undefined
      ) {
        const createProfileResult = await promptRequestSaveProfile(
          storedProfiles[activeAccountAddress],
        );

        if (createProfileResult.isErr()) {
          if (isCanceledOperationError(createProfileResult.error)) {
            return err(createProfileResult.error);
          } else {
            return err(new Error("can't create user profile"));
          }
        }
      }

      let msgToBroadcast: EncodeObject[] = msgs;
      // Don't check the permissions if the user forced the
      // transaction to be on chain.
      if (!broadcastOnChain) {
        const permissionsPromptResult = await promptAccountPermissions(msgs);
        if (permissionsPromptResult.isErr()) {
          // The user rejected, just proceed with the normal broadcast.
          broadcastOnChain = true;
        } else if (permissionsPromptResult.isOk() && permissionsPromptResult.value.length > 0) {
          // User accepted to give us the permissions, extends the broadcast
          // messages to include the permissions messages so that from
          // the next tx we can use the centralized APIs.
          msgToBroadcast = [...permissionsPromptResult.value, ...msgs];
          // Force to use the on chain tx broadcasting.
          broadcastOnChain = true;
        }
      }

      return new Promise(resolve => {
        if (broadcastOnChain) {
          broadcastTxOnChain(msgToBroadcast, {
            memo: options?.memo,
            onSuccess: txResponse => {
              resolve(
                ok({
                  txHash: txResponse.transactionHash,
                }),
              );
            },
            onCancel: () => {
              resolve(err(new CanceledOperationError()));
            },
          });
        } else {
          broadcastTxWithApi(msgToBroadcast, {
            optimistic: options?.optimistic,
            memo: options?.memo,
          })
            .then(result => {
              if (result.isOk()) {
                resolve(
                  ok({
                    txHash: result.value.txHash,
                  }),
                );
              } else {
                resolve(err(result.error));
              }
            })
            .catch(e => resolve(err(Error(e?.message ?? 'Tx with api failed'))));
        }
      });
    },
    [
      activeAccountAddress,
      broadcastTxOnChain,
      broadcastTxWithApi,
      promptRequestSaveProfile,
      fetchOnChainProfile,
      promptAccountPermissions,
      storedProfiles,
    ],
  );
};

export default useBroadcastTx;
