import { DesmosProfile } from 'types/desmos';
import { Source } from 'react-native-fast-image';
import { ImageRequireSource } from 'react-native';
import { defaultProfilePic } from 'assets/images';
import { Asset } from 'react-native-image-picker';

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
 * Returns the source that should be used to display the profile picture of the given profile.
 * @param profile {DesmosProfile} - Profile for which to display the profile picture.
 */
export const getProfilePicture = (
  profile: DesmosProfile | undefined,
): Source | ImageRequireSource => {
  const profilePicture = profile?.profilePicture;
  if (profilePicture === undefined) {
    return defaultProfilePic;
  } else if (isPictureAsset(profilePicture)) {
    return { uri: profilePicture.uri } as Source;
  }
  return { uri: profilePicture };
};

/**
 * Returns the name that should be displayed in order to identify the given Desmos profile.
 * @param profile {DesmosProfile} which names should be returned.
 * @return A combination of profile nickname and DTag that can be used inside lists of profiles.
 */
export const getProfileDisplayName = (profile: DesmosProfile): string | undefined => {
  switch (true) {
    case profile.nickname !== undefined && profile.nickname !== '':
      return `${profile.nickname} (@${profile.dTag})`;
    case profile.dTag !== undefined:
      return `@${profile.dTag}`;
    default:
      return undefined;
  }
};
