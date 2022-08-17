import React, {ReactNode} from 'react';
import {
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  StyleProp,
  ImageStyle,
  TouchableOpacityProps,
} from 'react-native';

interface Props extends TouchableOpacityProps {
  /**
   * The source of the image.
   */
  image: ImageSourcePropType;

  /**
   * The image's style.
   */
  style?: StyleProp<ImageStyle>;

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
}

const ImageButton = ({
  image,
  style,
  overlayComponent,
  overlayPosition,
  hitSlopValue,
  ...rest
}: Props) => {
  const hitSlop = hitSlopValue
    ? {
        top: hitSlopValue,
        bottom: hitSlopValue,
        right: hitSlopValue,
        left: hitSlopValue,
      }
    : undefined;

  return (
    <TouchableOpacity
      style={{opacity: rest.disabled ? 0.3 : 1}}
      hitSlop={hitSlop}
      {...rest}>
      <Image style={style} source={image} />
      {overlayComponent && (
        <View style={[StyleSheet.absoluteFillObject, {...overlayPosition}]}>
          {overlayComponent}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ImageButton;
