import React from 'react';
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

type Props = {
  /**
   * The image source.
   */
  imageSrc: ImageSourcePropType;

  /**
   * What to do when the image is pressed.
   */
  handlePress: () => void;
};

const CameraRollItem = ({imageSrc, handlePress}: Props) => {
  return (
    <TouchableOpacity onPress={handlePress}>
      <Image source={imageSrc} style={styles.imageStyle} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    height: 154,
    width: Dimensions.get('screen').width * 0.24,
  },
});

export default CameraRollItem;
