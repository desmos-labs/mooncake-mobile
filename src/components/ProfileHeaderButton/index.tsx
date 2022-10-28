import React from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
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
   * Override container style
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * Override image style
   */
  style?: StyleProp<ImageStyle>;
};

const ProfileHeaderButton = ({
  imageSrc,
  onPress,
  style,
  containerStyle,
}: Props) => {
  return (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <Image source={imageSrc} style={style || styles.defaultStyle} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  defaultStyle: {
    borderRadius: 36,
    height: 36,
    resizeMode: 'cover',
    width: 36,
  },
});

export default ProfileHeaderButton;
