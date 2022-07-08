import React, {ReactNode} from 'react';
import {
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  StyleProp,
  ImageStyle,
} from 'react-native';

type Props = {
  /**
   * The source of the image.
   */
  image: ImageSourcePropType;

  /**
   * The image's style.
   */
  style?: StyleProp<ImageStyle>;

  /**
   * What to do when the button is pressed.
   */
  onPress?: () => void;

  /**
   * A component that will be rendered on top of the image.
   * This is useful if you want to add accents independent of the image source.
   */
  overlayComponent?: ReactNode;
};

const ImageButton = ({image, style, onPress, overlayComponent}: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image style={style} source={image} />
      {overlayComponent && (
        <View style={StyleSheet.absoluteFillObject}>{overlayComponent}</View>
      )}
    </TouchableOpacity>
  );
};

export default ImageButton;
