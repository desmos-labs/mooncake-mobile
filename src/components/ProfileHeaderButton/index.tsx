import { Image } from 'expo-image';
import { getProfilePicture } from 'lib/ProfileUtils';
import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { scale } from 'react-native-size-matters';
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

  const source = useMemo(() => {
    return profile ? getProfilePicture(profile) : image;
  }, [profile, image]);

  return (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <Image
        recyclingKey={source?.toString()}
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
    backgroundColor: 'grey',
    borderRadius: scale(19),
    height: scale(38),
    resizeMode: 'cover',
    width: scale(38),
  },
});

export default ProfileHeaderButton;
