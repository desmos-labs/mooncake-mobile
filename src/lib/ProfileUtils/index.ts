import { defaultBanner, defaultProfilePic } from 'assets/images';
import { Asset } from 'expo-asset';
import { ImageSource } from 'expo-image';
import { DesmosProfile } from 'types/desmos';

interface ProfileTextFields {
  readonly nickname?: string;
  readonly dTag?: string;
  readonly address: string;
}

/**
 * Tells whether the given picture is a valid URI or not.
 * @param picture {Asset | string | undefined} - Picture to check.
 */
export const isPictureUri = (picture: Asset | string | undefined): picture is string => {
  return picture !== undefined && typeof picture === 'string';
};

/**
 * Tells whether the given picture is a valid {@link Asset} or not.
 */
export const isPictureAsset = (picture: Asset | string | undefined): picture is Asset => {
  if (picture === undefined) {
    return false;
  }
  const { uri } = picture as Asset;
  return uri !== undefined;
};

/**
 * Returns the source that should be used to display the given picture.
 * @param picture {Asset | string | undefined} - Picture to display.
 * @param defaultImage {ImageSource} - Default image to be used if the given picture is not valid.
 */
const getPictureData = (picture: Asset | string | undefined, defaultImage: ImageSource) => {
  if (isPictureUri(picture)) {
    const trimmedUri = picture.trim();
    return trimmedUri.length > 0 ? { uri: trimmedUri } : defaultImage;
  } else if (isPictureAsset(picture)) {
    return { uri: picture.uri };
  }
  return defaultImage;
};

/**
 * Returns the source that should be used to display the profile picture of the given profile.
 * @param profile {DesmosProfile} - Profile for which to display the profile picture.
 */
export const getProfilePicture = (profile: DesmosProfile | undefined) => {
  return getPictureData(profile?.profilePicture, defaultProfilePic);
};

/**
 * Returns the source that should be used to display the cover picture of the given profile.
 * @param profile {DesmosProfile} - Profile for which to display the cover picture.
 */
export const getCoverPicture = (profile: DesmosProfile | undefined) => {
  return getPictureData(profile?.coverPicture, defaultBanner);
};

/**
 * Function that, given a list of {@link DesmosProfile}, returns a new list
 * without any duplicated profile by their address.
 */
export const removeDuplicates = (profiles: DesmosProfile[]): DesmosProfile[] => {
  return profiles.filter(
    (profile, index, self) => index === self.findIndex(p => p.address === profile.address),
  );
};

/**
 * Function that, given a {@link DesmosProfile}, returns its display name.
 * The display name is either the nickname or the dtag if present, or the address otherwise.
 */
export const getProfileDisplayName = (profile: ProfileTextFields): string => {
  if (profile.nickname && profile.nickname.length > 0) {
    return profile.nickname;
  }

  return getProfileDisplayDTag(profile);
};

export const getProfileDisplayDTag = (profile: ProfileTextFields): string => {
  if (profile.dTag && profile.dTag.length > 0) {
    return `@${profile.dTag}`;
  }

  return profile.address;
};
