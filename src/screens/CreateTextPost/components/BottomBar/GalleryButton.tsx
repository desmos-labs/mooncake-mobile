import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  image: ImageSourcePropType;

  handlePress: () => void;
};

const GalleryButton = ({ image, handlePress }: Props) => {
  return (
    <TouchableOpacity onPress={handlePress}>
      <Image source={image} style={styles.imageStyle} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    borderColor: 'white',
    borderRadius: 8,
    borderWidth: 2,
    height: 40,
    width: 40,
  },
});

export default GalleryButton;
