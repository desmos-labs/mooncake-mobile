import { defaultBanner, defaultProfilePic, twitterIcon } from 'assets/images';
import LinkableChains from 'config/LinkableChains';
import { ImageSource } from 'expo-image';
import { ImageRequireSource, ImageURISource } from 'react-native';
import { Asset } from 'react-native-image-picker';
import { ApplicationLink, ChainLink, DesmosProfile } from 'types/desmos';

/**
 * Tells whether the given picture is a valid URI or not.
 * @param picture {Asset | string | undefined} - Picture to check.
 */
export const isPictureUri = (picture: Asset | string | undefined): picture is string => {
  return picture !== undefined && typeof picture === 'string';
};

/**
 * Tells whether the given picture is a local asset or not.
 * @param picture {Asset | string | undefined} - Picture to check.
 */
export const isPictureLocalAsset = (picture: Asset | string | undefined): picture is Asset => {
  const asset = asPictureAsset(picture);
  return asset !== undefined && asset.uri?.startsWith('file://') === true;
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
 * Returns the given picture as an {@link Asset} if it is a valid URI or a valid {@link Asset}.
 * @param picture {Asset | string | undefined} - Picture to convert.
 */
export const asPictureAsset = (picture: Asset | string | undefined): Asset | undefined => {
  if (isPictureAsset(picture)) {
    return picture;
  }
  if (isPictureUri(picture)) {
    return { uri: picture };
  }
  return undefined;
};

/**
 * Returns the source that should be used to display the given picture.
 * @param picture {Asset | string | undefined} - Picture to display.
 * @param defaultImage {ImageRequireSource} - Default image to be used if the given picture is not valid.
 */
const getPictureData = (picture: Asset | string | undefined, defaultImage: ImageRequireSource) => {
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
export const getProfilePicture = (
  profile: DesmosProfile | undefined,
): ImageSource | ImageRequireSource => {
  return getPictureData(profile?.profilePicture, defaultProfilePic);
};

/**
 * Returns the source that should be used to display the cover picture of the given profile.
 * @param profile {DesmosProfile} - Profile for which to display the cover picture.
 */
export const getCoverPicture = (
  profile: DesmosProfile | undefined,
): ImageURISource | ImageRequireSource => {
  return getPictureData(profile?.coverPicture, defaultBanner);
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

/**
 * Returns the source that should be used to display the image of the given chain link.
 * @param chain {ChainLink} - Chain link for which to display the image.
 */
export const getChainLinkImage = (chain: ChainLink): ImageSource => {
  return (
    LinkableChains.find(y => y.chainConfig.name === chain.chainName)?.icon || defaultProfilePic
  );
};

/**
 * Returns the source that should be used to display the image of the given application link.
 * @param app {ApplicationLink} - Application link for which to display the image.
 */
export const getAppLinkImage = (app: ApplicationLink): ImageSource => {
  switch (app.application.toLowerCase()) {
    case 'twitter':
      return twitterIcon;
    default:
      return defaultProfilePic;
  }
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
