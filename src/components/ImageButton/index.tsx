import React, {ReactNode} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  StyleProp,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import FastImage, {ImageStyle, Source} from 'react-native-fast-image';

interface Props extends TouchableOpacityProps {
  /**
   * The source of the image.
   */
  image: Source;

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

const ImageButton = ({
  image,
  style,
  overlayComponent,
  overlayPosition,
  hitSlopValue,
  buttonStyle,
  tintColor,
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
      style={[{opacity: rest.disabled ? 0.3 : 1}, buttonStyle]}
      hitSlop={hitSlop}
      {...rest}>
      <FastImage
        resizeMode="cover"
        style={style}
        source={image}
        tintColor={tintColor}
      />
      {overlayComponent && (
        <View style={[StyleSheet.absoluteFillObject, {...overlayPosition}]}>
          {overlayComponent}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ImageButton;
