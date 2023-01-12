import React from 'react';
import {StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import FastImage from 'react-native-fast-image';

type Props = {
  /**
   * The source of the avatar.
   */
  imageSrc: React.ComponentProps<typeof FastImage>['source'];

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
  style?: React.ComponentProps<typeof FastImage>['style'];
  tintColor?: string;
};

const ProfileHeaderButton = ({
  imageSrc,
  onPress,
  style,
  containerStyle,
  tintColor,
}: Props) => {
  return (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <FastImage
        resizeMode="cover"
        source={imageSrc}
        style={style || styles.defaultStyle}
        tintColor={tintColor}
      />
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
