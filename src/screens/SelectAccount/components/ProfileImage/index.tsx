import React from 'react';
import { DesmosProfile } from 'types/desmos';
import AvatarImageProps from 'components/AvatarImage/props';
import AvatarImage from 'components/AvatarImage';

export interface ProfileImageProps extends Omit<AvatarImageProps, 'source'> {
  /**
   * Profile associated with the avatar image to be displayed.
   */
  readonly profile: DesmosProfile | undefined;
  /**
   * True if we should display an activity indicator over the profile image.
   */
  readonly loading?: boolean;
}

/**
 * Component that allows displaying a lazy loading Desmos profile picture.
 * @param props
 * @constructor
 */
const ProfileImage = (props: ProfileImageProps) => {
  const { profile, loading, ...rest } = props;
  return <AvatarImage profile={profile} {...rest} loading={loading} />;
};

export default ProfileImage;
