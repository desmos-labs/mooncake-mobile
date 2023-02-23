import React from 'react';
import { EncodeObject } from '@cosmjs/proto-signing';
import useBroadcastTxOnChain from 'hooks/transactions/useBroadcastTxOnChain';
import useBroadcastTxWithApi from 'hooks/transactions/useBroadcastTxWithApi';
import { err, ok, Result } from 'neverthrow';
import { CanceledOperationError, isCanceledOperationError } from 'types/error';
import useGetAuthorizationInformation from 'hooks/authorizations/useGetAuthorizationInformation';
import { useActiveAccountAddress } from '@recoil/accounts';
import { getMissingAuthzPermissions, getMissingFeeGrantPermissions } from 'lib/AuthorizationsUtils';
import { useGetOnChainProfile } from 'hooks/profiles/useGetOnChainProfile';
import { MsgSaveProfileTypeUrl } from '@desmoslabs/desmjs';
import useSaveProfile from 'hooks/profiles/useSaveProfile';
import useReturnToCurrentScreen from 'hooks/navigation/useReturnToCurrentScreen';
import { DesmosProfile } from 'types/desmos';
import { useStoredProfiles } from '@recoil/profiles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useTranslation } from 'react-i18next';

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

const useCreateUserProfileOnChain = () => {
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
  const { refetch: fetchAuthorizations } = useGetAuthorizationInformation(
    activeAccountAddress,
    true,
  );
  const fetchOnChainProfile = useGetOnChainProfile();
  const createUserProfileOnChain = useCreateUserProfileOnChain();
  const storedProfiles = useStoredProfiles();

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
        msgs.find(msg => msg.typeUrl === MsgSaveProfileTypeUrl) === undefined
      ) {
        const createProfileResult = await createUserProfileOnChain(
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

      // Don't check the permissions if the user forced the
      // transaction to be on chain.
      if (!broadcastOnChain) {
        const fetchAuthorizationsResult = await fetchAuthorizations();
        if (fetchAuthorizationsResult.isOk()) {
          const { authzGrants, feeGrants } = fetchAuthorizationsResult.value;
          const msgsTypes = msgs.map(msg => msg.typeUrl);
          const missingAuthzPermissions = getMissingAuthzPermissions(msgsTypes, authzGrants);
          const missingFeeGrantsPermissions = getMissingFeeGrantPermissions(msgsTypes, feeGrants);
          broadcastOnChain =
            missingAuthzPermissions.length !== 0 || missingFeeGrantsPermissions.length !== 0;
        } else {
          return err(fetchAuthorizationsResult.error);
        }
      }

      return new Promise(resolve => {
        if (broadcastOnChain) {
          broadcastTxOnChain(msgs, {
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
          broadcastTxWithApi(msgs, {
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
      createUserProfileOnChain,
      fetchAuthorizations,
      fetchOnChainProfile,
      storedProfiles,
    ],
  );
};

export default useBroadcastTx;
