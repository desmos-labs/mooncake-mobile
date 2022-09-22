import React from 'react';
import {Image, ImageSourcePropType, TouchableOpacity} from 'react-native';
import styles from './styles';

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

export default CameraRollItem;
