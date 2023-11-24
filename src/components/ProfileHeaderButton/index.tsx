import { Image } from 'expo-image';
import { getProfilePicture } from 'lib/ProfileUtils';
import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { DesmosProfile } from 'types/desmos';

type Props = {
  /**
   * Profile for which to show the header button.
   */
  profile?: DesmosProfile | undefined;

  /**
   * Custom image to be shown instead of the profile picture.
   */
  image?: number;

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
  style?: React.ComponentProps<typeof Image>['style'];
  tintColor?: string;
};

const ProfileHeaderButton = (props: Props) => {
  const { profile, image, onPress, style, containerStyle, tintColor } = props;

  const source = profile ? getProfilePicture(profile) : image;
  if (!source) {
    throw new Error('Cannot show ProfileHeaderButton without image source');
  }

  return (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <Image
        contentFit="cover"
        source={source}
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
