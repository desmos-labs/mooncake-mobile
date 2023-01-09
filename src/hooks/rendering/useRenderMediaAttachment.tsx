import _ from 'lodash';
import React, {useMemo, useState} from 'react';
import {Dimensions, ImageStyle, StyleProp, StyleSheet} from 'react-native';
import FastImage, {ResizeMode} from 'react-native-fast-image';

/**
 * A hook to serve as a singular point to handle rendering of post media attachments
 */
const useRenderMediaAttachment = ({
  attachments,
  imageStyle,
  useAutoSize,
  resizeMode,
  horizontalPaddingWithAutoSize,
}: {
  attachments?: PostAttachment[];
  imageStyle?: StyleProp<ImageStyle>;
  useAutoSize?: boolean;
  resizeMode: ResizeMode;
  horizontalPaddingWithAutoSize?: number;
}) => {
  const [dimensions, setDimensions] = useState({
    height: 0,
    width: 0,
  });
  const [loading, setLoading] = useState(true);

  const imageHeight = useMemo(() => {
    if (!dimensions.height) {
      return 0;
    }
    const ratio =
      (Dimensions.get('window').width - (horizontalPaddingWithAutoSize || 0)) /
      dimensions.width;
    return dimensions.height * ratio;
  }, [dimensions, horizontalPaddingWithAutoSize]);

  const MediaAttachment = React.useMemo(() => {
    // currently only render one attachment
    if (!attachments || attachments.length === 0) return undefined;
    const [attachment] = attachments;

    // Only Media type attachments will have a uri property.
    if ('uri' in attachment.content) {
      return (
        <FastImage
          resizeMode={resizeMode}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onLoad={e => {
            const {
              nativeEvent: {width, height},
            } = e;
            setDimensions({width, height});
          }}
          source={{
            uri: _.get(attachment, 'content.uri'),
          }}
          // @ts-ignore
          style={
            useAutoSize
              ? [
                  {
                    height: imageHeight,
                    width:
                      Dimensions.get('window').width -
                      (horizontalPaddingWithAutoSize || 0),
                  },
                  imageStyle,
                ]
              : imageStyle || StyleSheet.absoluteFillObject
          }
        />
      );
    }
  }, [
    attachments,
    useAutoSize,
    imageHeight,
    horizontalPaddingWithAutoSize,
    dimensions,
    resizeMode,
  ]);

  return {
    MediaAttachment,
    loading,
  };
};

export default useRenderMediaAttachment;
