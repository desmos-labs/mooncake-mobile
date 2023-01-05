import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
} from 'react-native';
import _ from 'lodash';
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

  useEffect(() => {
    if (!attachments || attachments.length === 0) return;
    const [attachment] = attachments;
    if ('uri' in attachment.content) {
      Image.getSize(_.get(attachment, 'content.uri'), (width, height) => {
        // calculate image width and height
        const screenWidth = Dimensions.get('window').width;
        const scaleFactor = width / screenWidth;
        const imageHeight = height / scaleFactor;
        setImageDimensions({
          w: screenWidth - (horizontalPaddingWithAutoSize || 0),
          h: imageHeight,
        });
      });
    }
  }, [horizontalPaddingWithAutoSize]);

  const MediaAttachment = React.useMemo(() => {
    // currently only render one attachment
    if (!attachments || attachments.length === 0) return undefined;
    const [attachment] = attachments;

    // Only Media type attachments will have a uri property.
    if ('uri' in attachment.content) {
      return (
        <FastImage
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
  }, [attachments, useAutoSize, imageDimensions]);

  return {
    MediaAttachment,
  };
};

export default useRenderMediaAttachment;
