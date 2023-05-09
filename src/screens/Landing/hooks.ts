import React from 'react';
import useSaveAccount from 'hooks/accounts/useSaveAccount';
import useSaveProfile from 'hooks/profiles/useSaveProfile';
import { useStoreProfile } from '@recoil/profiles';
import useImportAccount from 'hooks/accounts/useImportAccount';
import { DesmosChain } from 'config/LinkableChains';
import { usePostHog } from 'posthog-react-native';

/**
 * Hook that allows to properly perform the import of an existing account.
 */
// It's fine to disable the next line warning as we might add more features in the future
// eslint-disable-next-line import/prefer-default-export
export const usePerformImportAccount = () => {
  const importAccount = useImportAccount({
    chains: [DesmosChain],
    showBalances: true,
  });

  const saveAccount = useSaveAccount();
  const createOrSaveProfile = useSaveProfile();
  const posthog = usePostHog();
  const storeProfile = useStoreProfile();

  return React.useCallback(() => {
    importAccount({
      onSelect: account => {
        const { profile } = account;
        switch (profile) {
          case undefined:
            // The user does not have a profile, so we need to tell them to create one
            createOrSaveProfile({
              storeOnChain: false,
              account,
              onSuccess: () => saveAccount(account),
            });
            break;

          default:
            // The user has a profile, so we need to save both the account and the profile
            saveAccount(account);
            storeProfile(account.account.address, profile);
            posthog?.identify(profile.address, {
              dtag: profile.dTag,
            });
        }
      },
    });
  }, [importAccount, createOrSaveProfile, saveAccount, storeProfile, posthog]);
};
