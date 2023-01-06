import _ from 'lodash';
import React, {useCallback, useState} from 'react';
import {Dimensions, ImageStyle, StyleProp, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';

/**
 * A hook to serve as a singular point to handle rendering of post media attachments
 */
const useRenderMediaAttachment = ({
  attachments,
  imageStyle,
  useAutoSize,
  horizontalPaddingWithAutoSize,
}: {
  attachments?: PostAttachment[];
  imageStyle?: StyleProp<ImageStyle>;
  useAutoSize?: boolean;
  horizontalPaddingWithAutoSize?: number;
}) => {
  const [imageDimensions, setImageDimensions] = useState({h: 0, w: 0});
  const [loading, setLoading] = useState(true);
  const calculateCorrectSize = useCallback(
    ({height, width}: {height: number; width: number}) => {
      // calculate image width and height
      const screenWidth =
        Dimensions.get('window').width - (horizontalPaddingWithAutoSize || 0);
      const scaleFactor = width / screenWidth;
      const imageHeight = height / scaleFactor;
      setImageDimensions({
        w: screenWidth,
        h: imageHeight,
      });
    },
    [horizontalPaddingWithAutoSize],
  );

  const MediaAttachment = React.useMemo(() => {
    // currently only render one attachment
    if (!attachments || attachments.length === 0) return undefined;
    const [attachment] = attachments;

    // Only Media type attachments will have a uri property.
    if ('uri' in attachment.content) {
      return (
        <FastImage
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onLoad={e =>
            calculateCorrectSize({
              height: e.nativeEvent.height,
              width: e.nativeEvent.width,
            })
          }
          source={{
            uri: _.get(attachment, 'content.uri'),
          }}
          // @ts-ignore
          style={
            useAutoSize
              ? [
                  {
                    height: imageDimensions.h,
                    width: imageDimensions.w,
                  },
                  imageStyle,
                ]
              : imageStyle || StyleSheet.absoluteFillObject
          }
        />
      );
    }
  }, [attachments, useAutoSize, imageDimensions, calculateCorrectSize]);

  return {
    MediaAttachment,
    loading,
  };
};

export default useRenderMediaAttachment;
