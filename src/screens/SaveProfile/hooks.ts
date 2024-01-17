import { useActiveAccount } from '@recoil/accounts';
import { useStoreProfile } from '@recoil/profiles';
import useGetOnChainProfile from 'hooks/profiles/useGetOnChainProfile';
import useSaveProfile from 'hooks/profiles/useSaveProfile';
import { err, ok, Result } from 'neverthrow';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountWithWallet } from 'types/account';
import { DesmosProfile, ProfileParams } from 'types/desmos';
import * as Yup from 'yup';

/**
 * State of the form allowing to create or edit an existing profile.
 */
export interface SaveProfileFormState {
  readonly dTag: string | undefined;
  readonly nickname: string | undefined;
  readonly bio: string | undefined;
}

/**
 * Hook that returns the initial state of the form that allows
 * to create or edit an existing profile.
 * @param profile
 */
export const useInitialFormState = (profile: DesmosProfile | undefined): SaveProfileFormState => ({
  nickname: profile?.nickname,
  dTag: profile?.dTag,
  bio: profile?.bio,
});

/**
 * Hook that returns the validation schema for the form allowing to
 * edit or create a profile.
 */
export const useValidationSchema = (profileParams: ProfileParams) => {
  const { t } = useTranslation('createProfile');
  return useMemo(() => {
    return Yup.object().shape({
      nickname: Yup.string()
        .min(profileParams.nickname.minLength)
        .max(profileParams.nickname.maxLength),
      dTag: Yup.string()
        .required(t('field required', { ns: 'common' }))
        .min(profileParams.dTag.minLength)
        .max(profileParams.dTag.maxLength)
        .test('respect reg_ex', t('invalid dtag'), value => {
          return new RegExp(profileParams.dTag.regEx, 'g').test(value as string);
        }),
      bio: Yup.string().max(
        profileParams.bio.maxLength,
        t('max bio length exceeded', {
          numChars: profileParams.bio.maxLength,
        }),
      ),
    });
  }, [t, profileParams]);
};

/**
 * Hook that allows to get the proper value to be displayed as an image background.
 * @param inputValue {string | undefined} - Value selected by the user inside the editor
 * @param profileValue {string | undefined} - Value defined inside the Desmos profile
 * @param defaultImage {any} - Default image to be used if the above two are not defined
 */
export const useGetImageBackground = (
  inputValue: string | undefined,
  profileValue: string | undefined,
  defaultImage: any,
) => {
  const profileUri = React.useMemo(() => inputValue || profileValue, [inputValue, profileValue]);
  return React.useMemo(() => {
    const profilePicToReturn = typeof profileUri === 'string' ? { uri: profileUri } : profileUri;
    return profileUri ? profilePicToReturn : defaultImage;
  }, [profileUri, defaultImage]);
};

/**
 * Returns the value to be saved within a Desmos Profile field.
 * @param inputValue - The value input by the user
 * @param existingValue - The value existing within the Desmos profile.
 */
const getValueToSave = (
  inputValue: string | undefined,
  existingValue: string | undefined,
): string | undefined => {
  if (inputValue === undefined || inputValue === existingValue) {
    // The value was not updated, or it's identical to the existing one
    return undefined;
  }

  return inputValue;
};

/**
 * Hook that allows to submit the form that allows to create or edit
 * a Desmos profile.
 *
 * @param profile {DesmosProfile | undefined} - Optional Desmos profile
 * that should be edited. If no profile is provided, then a new one will
 * be created instead.
 * @param accountWithWallet {AccountWithWallet | undefined} - Account to be used
 * while signing the transaction. If no account is provided, then the
 * current user account will be used instead.
 * @param onProfileSaved {() => void} - Callback to be called when the profile
 * has been saved on-chain.
 * @param onCompleteOrError {() => void} - Callback to be called when the transaction
 * has been completed or an error occurred.
 * @param customHeader {string | undefined} - Optional custom header to be used inside the transaction screen.
 * @param customBody {string | undefined} - Optional custom body to be used inside the transaction screen.
 */
export const useSubmitForm = (
  profile: DesmosProfile | undefined,
  accountWithWallet: AccountWithWallet | undefined,
  onProfileSaved: () => void,
  onCompleteOrError: () => void,
  customHeader?: string,
  customBody?: string,
) => {
  const getOnChainProfile = useGetOnChainProfile();
  const storeProfile = useStoreProfile();
  const activeAccount = useActiveAccount();
  const saveProfile = useSaveProfile();

  // Callback used when the user pressed the button to save the profile
  return useCallback(
    async (
      values: SaveProfileFormState,
      profilePic: string | undefined,
      coverPic: string | undefined,
    ): Promise<Result<void, Error>> => {
      // Get the address of the profile based on the given params
      const profileAddress = accountWithWallet?.account.address ?? activeAccount?.address;
      if (!profileAddress) {
        return err(new Error('Cannot save a profile without a known address'));
      }

      // Get the on-chain profile
      const onChainProfile = await getOnChainProfile(profileAddress);

      // Get the profile to save
      const profileToSaveOnChain: DesmosProfile = {
        dTag: getValueToSave(values.dTag ?? profile?.dTag, onChainProfile?.dTag),
        nickname: getValueToSave(values.nickname ?? profile?.nickname, onChainProfile?.nickname),
        bio: getValueToSave(values.bio ?? profile?.bio, onChainProfile?.bio),
        profilePicture: profilePic,
        coverPicture: coverPic,
        address: profileAddress,
        creationTime: profile?.creationTime ?? new Date(Date.now()).toISOString(),
      };

      // Store the profile locally by replacing the values with the previous ones (if undefined)
      const profileToSaveLocally: DesmosProfile = {
        ...profileToSaveOnChain,
        dTag: profileToSaveOnChain.dTag ?? profile?.dTag,
        nickname: profileToSaveOnChain.nickname ?? profile?.nickname,
        bio: profileToSaveOnChain.bio ?? profile?.bio,
        profilePicture: profileToSaveOnChain.profilePicture ?? profile?.profilePicture,
        coverPicture: profileToSaveOnChain.coverPicture ?? profile?.coverPicture,
      };

      const saveProfileResult = await saveProfile(profileToSaveOnChain, accountWithWallet, {
        onProfileSaved,
        customHeader,
        customBody,
        onCompleteOrError,
      });

      if (saveProfileResult.isErr()) {
        return err(saveProfileResult.error);
      } else {
        storeProfile(profileAddress, profileToSaveLocally);
        return ok(saveProfileResult.value);
      }
    },
    [
      accountWithWallet,
      activeAccount?.address,
      customBody,
      customHeader,
      getOnChainProfile,
      onCompleteOrError,
      onProfileSaved,
      profile?.bio,
      profile?.coverPicture,
      profile?.creationTime,
      profile?.dTag,
      profile?.nickname,
      profile?.profilePicture,
      saveProfile,
      storeProfile,
    ],
  );
};
