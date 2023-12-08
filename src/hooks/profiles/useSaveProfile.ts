import { useActiveAccountAddress } from '@recoil/accounts';
import { err } from 'neverthrow';
import React from 'react';
import { AccountWithWallet } from 'types/account';
import { DesmosProfile } from 'types/desmos';
import { scheduleTask } from 'lib/BackgroundTaskUtils';
import SaveProfileTask from 'services/tasks/SaveProfile';
import usePrepareDesmosClientAndWallet from 'hooks/tx/usePrepareDesmosClientAndWallet';
import useToast from 'hooks/toasts/useToast';
import { ToastType } from 'config/toast/toastConfig';
import { useTranslation } from 'react-i18next';

interface SaveProfileOptions {
  readonly customHeader?: string;
  readonly customBody?: string;
  readonly onProfileSaved?: () => void;
  readonly onCompleteOrError?: () => void;
}

/**
 * Hook that allows to save a Desmos profile on-chain.
 * The profile will be saved using the given parameters and account.
 * If no account is provided, the current user account will be used instead.
 */
const useSaveProfile = () => {
  const { t } = useTranslation('createProfile');
  const showToast = useToast();

  const activeAccountAddress = useActiveAccountAddress()!;
  const prepareDesmosClientAndWallet = usePrepareDesmosClientAndWallet();

  return React.useCallback(
    async (
      profile: DesmosProfile,
      providedAccount: AccountWithWallet | undefined,
      options?: SaveProfileOptions,
    ) => {
      // Get the address to be used in order to save the profile
      const addressToUse = providedAccount?.account?.address ?? activeAccountAddress;
      if (addressToUse === undefined) {
        return err(new Error('Cannot save a profile without an active account or address'));
      }

      // Get the Desmos client
      const clientAndWalletResult = await prepareDesmosClientAndWallet();
      if (clientAndWalletResult.isErr()) {
        return err(clientAndWalletResult.error);
      }

      const { desmosClient } = clientAndWalletResult.value;

      const taskReference = await scheduleTask(
        'Broadcast Save Profile',
        SaveProfileTask,
        {
          desmosClient,
          profile,
          signer: addressToUse,
        },
        {
          title: options?.customHeader ?? t('saving profile'),
          desc: options?.customBody ?? t('saving profile body'),
          progressBar: {
            indeterminate: true,
          },
        },
      );

      taskReference
        .onStart(() => {
          showToast({
            toastType: ToastType.loading,
            message: options?.customBody ?? t('saving profile body'),
          });
        })
        .onComplete(() => {
          if (options?.onProfileSaved) {
            options.onProfileSaved();
          }

          if (options?.onCompleteOrError) {
            options.onCompleteOrError();
          }

          showToast({
            toastType: ToastType.success,
            title: t('success', { ns: 'common' }),
            message: t('profile saved'),
          });
        })
        .onError(({ error }) => {
          if (options?.onCompleteOrError) {
            options.onCompleteOrError();
          }

          showToast({
            toastType: ToastType.error,
            title: t('error', { ns: 'common' }),
            message: error.message,
          });
        });
    },
    [activeAccountAddress],
  );
};

export default useSaveProfile;
