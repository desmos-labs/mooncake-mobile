import { Image, ImageSource } from 'expo-image';
import React, { ReactNode, useEffect, useState } from 'react';
import {
  ImageStyle,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import useStyles from './useStyles';

export interface Props extends TouchableOpacityProps {
  /**
   * The source of the image.
   */
  image: ImageSource | number;

  /**
   * The image's style.
   */
  style?: StyleProp<ImageStyle>;

  buttonStyle?: StyleProp<ViewStyle>;

  /**
   * A component that will be rendered on top of the image.
   * This is useful if you want to add accents independent of the image source.
   */
  overlayComponent?: ReactNode;

  /**
   * Additional adjustments for the overlay component. By default, it will be on
   * the top-center
   */
  overlayPosition?: {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
  };

  hitSlopValue?: number;
  tintColor?: string;
}

const ImageButton = (props: Props) => {
  const {
    image,
    style,
    overlayComponent,
    overlayPosition,
    hitSlopValue,
    buttonStyle,
    tintColor,
    ...rest
  } = props;
  const styles = useStyles(props);
  const hitSlop = hitSlopValue
    ? {
        top: hitSlopValue,
        bottom: hitSlopValue,
        right: hitSlopValue,
        left: hitSlopValue,
      }
    : undefined;
  const [imageSource, setImageSource] = useState(image);

  useEffect(() => {
    setImageSource(image);
  }, [image]);

  return (
    <TouchableOpacity style={[styles.baseButtonStyle, buttonStyle]} hitSlop={hitSlop} {...rest}>
      <Image style={style} source={imageSource} tintColor={tintColor} />
      {overlayComponent && (
        <View style={[StyleSheet.absoluteFillObject, { ...overlayPosition }]}>
          {overlayComponent}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ImageButton;
