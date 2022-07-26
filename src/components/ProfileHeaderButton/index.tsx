import React from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

type Props = {
  /**
   * The source of the avatar.
   */
  imageSrc: ImageSourcePropType;

  /**
   * What to do when the button is pressed.
   */
  onPress?: () => void;

  /**
   * Override image style
   */
  style?: StyleProp<ImageStyle>;
};

const ProfileHeaderButton = ({imageSrc, onPress, style}: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={imageSrc} style={style || styles.defaultStyle} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  defaultStyle: {
    borderRadius: 20,
    height: 32,
    resizeMode: 'contain',
    width: 32,
  },
});

export default ProfileHeaderButton;
