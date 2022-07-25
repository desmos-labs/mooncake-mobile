import React from 'react';
import {Image, ImageSourcePropType, TouchableOpacity} from 'react-native';

type Props = {
  /**
   * The source of the avatar.
   */
  imageSrc: ImageSourcePropType;

  /**
   * What to do when the button is pressed.
   */
  onPress?: () => void;
};

const ProfileHeaderButton = ({imageSrc, onPress}: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        source={imageSrc}
        style={{width: 40, height: 40, resizeMode: 'contain', borderRadius: 20}}
      />
    </TouchableOpacity>
  );
};

export default ProfileHeaderButton;
