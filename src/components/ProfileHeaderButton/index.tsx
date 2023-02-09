import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import FastImage from 'react-native-fast-image';
import { DesmosProfile } from 'types/desmos';
import { getProfilePicture } from 'lib/ProfileUtils';

type Props = {
  /**
   * Profile for which to show the header button.
   */
  profile: DesmosProfile;

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

const ProfileHeaderButton = (props: Props) => {
  const { profile, onPress, style, containerStyle, tintColor } = props;

  return (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <FastImage
        resizeMode="cover"
        source={getProfilePicture(profile)}
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
