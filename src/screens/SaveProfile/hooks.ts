import React, { useCallback, useMemo } from 'react';
import { Asset } from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { DesmosProfile, ProfileParams } from 'types/desmos';
import SearchProfiles from 'services/graphql/queries/SearchProfiles';
import { useNavigation } from '@react-navigation/native';
import ROUTES from 'navigation/routes';
import useSaveProfileOnChain from 'hooks/profiles/useSaveProfileOnChain';
import { AccountWithWallet } from 'types/account';
import { useStoreProfile } from '@recoil/profiles';
import { err, ok, Result } from 'neverthrow';
import useGetOnChainProfile from 'hooks/profiles/useGetOnChainProfile';
import useCustomLazyQuery from 'hooks/graphql/useCustomLazyQuery';
import { identifyPostHogUser } from 'lib/PostHog/utils';
import { useGetCurrentChainInfo } from '@recoil/settings';
import { usePostHog } from 'posthog-react-native';
import { NavProps } from './index';

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
  const { t } = useTranslation();
  return useMemo(() => {
    return Yup.object().shape({
      nickname: Yup.string()
        .min(profileParams.nickname.minLength)
        .max(profileParams.nickname.maxLength),
      dTag: Yup.string()
        .required(t('error:required'))
        .min(profileParams.dTag.minLength)
        .max(profileParams.dTag.maxLength)
        .test('respect reg_ex', t('Only _ is allowed as special character'), value => {
          return new RegExp(profileParams.dTag.regEx, 'g').test(value as string);
        }),
      bio: Yup.string().max(
        profileParams.bio.maxLength,
        t('error:maxLength', {
          numChars: profileParams.bio.maxLength,
        }),
      ),
    });
  }, [t, profileParams]);
};

/**
 * Hook that allows to check whether the given DTag is available or not.
 * TODO: This should be used somewhere to make sure the DTag input by the user is free
 */
export const useCheckDTagAvailability = () => {
  const [getLazyData] = useCustomLazyQuery(SearchProfiles);
  return React.useCallback(
    async (inputDTag: string) => {
      const data = await getLazyData({ variables: { dTag: inputDTag } });
      return (data?.profile?.length ?? 0) === 0;
    },
    [getLazyData],
  );
};

/**
 * Hook that allows to open the modal to tell the user what is a DTag and how is it used.
 * TODO: This should be used if we are creating a new profile
 */
export const useOpenInfoModal = () => {
  const { t } = useTranslation('passwordManipulation');
  const { navigate } = useNavigation<NavProps['navigation']>();
  return React.useCallback(() => {
    navigate(ROUTES.TEXTONLY_MODAL, {
      title: t('signup:profile dtag'),
      body: t('signup:dtag info'),
    });
  }, [navigate, t]);
};

/**
 * Given a {@link string} value, returns either the value (if not empty),
 * or <code>undefined</code> if it's empty.
 */
export const omitEmptyValue = (value: string): string | undefined => {
  return value.trim().length > 0 ? value : undefined;
};

/**
 * Hook that allows to get the proper value to be displayed as an image background.
 * @param inputValue {Asset | undefined} - Value selected by the user inside the editor
 * @param profileValue {Asset | string | undefined} - Value defined inside the Desmos profile
 * @param defaultImage {any} - Default image to be used if the above two are not defined
 */
export const useGetImageBackground = (
  inputValue: Asset | undefined,
  profileValue: Asset | string | undefined,
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
 * @param account {AccountWithWallet | undefined} - Account to be used
 * while signing the transaction. If no account is provided, then the
 * current user account will be used instead.
 * @param saveOnChain {boolean} - Whether the profile should
 * immediately be stored on chain.
 */
export const useSubmitForm = (
  profile: DesmosProfile | undefined,
  account: AccountWithWallet | undefined,
  saveOnChain: boolean = true,
) => {
  const getOnChainProfile = useGetOnChainProfile();
  const storeProfile = useStoreProfile();
  const posthog = usePostHog();
  const getChainInfo = useGetCurrentChainInfo();
  const { status, saveProfile } = useSaveProfileOnChain();

  // Callback used when the user pressed the button to save the profile
  const submitForm = useCallback(
    async (
      values: SaveProfileFormState,
      profilePic: Asset | undefined,
      coverPic: Asset | undefined,
    ): Promise<Result<void, Error>> => {
      // Get the address of the profile based on the given params
      const profileAddress = account?.account?.address ?? profile?.address;
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
      storeProfile(profileAddress, profileToSaveLocally);

      // Save the profile on-chain, if required
      if (saveOnChain) {
        const result = await saveProfile(profileToSaveOnChain, account);
        if (result.isErr()) {
          return err(result.error);
        } else {
          identifyPostHogUser(
            posthog!,
            profileToSaveOnChain.address,
            getChainInfo(),
            profileToSaveOnChain,
          );
        }
      }

      return ok(undefined);
    },
    [
      account,
      profile,
      getOnChainProfile,
      storeProfile,
      saveOnChain,
      saveProfile,
      posthog,
      getChainInfo,
    ],
  );

  return {
    status,
    submitForm,
  };
};
