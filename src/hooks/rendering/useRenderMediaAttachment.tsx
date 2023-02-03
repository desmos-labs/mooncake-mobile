import _ from 'lodash';
import React, { useState } from 'react';
import { Dimensions, ImageStyle, StyleProp, StyleSheet } from 'react-native';
import FastImage, { ResizeMode } from 'react-native-fast-image';
import { PostAttachment } from 'types/posts';

export interface MediaRenderOptions {
  readonly imageStyle?: StyleProp<ImageStyle>;
  readonly useAutoSize?: boolean;
  readonly resizeMode: ResizeMode;
  readonly horizontalPaddingWithAutoSize?: number;
}

/**
 * A hook to serve as a singular point to handle rendering of post media attachments
 */
const useRenderMediaAttachment = (
  attachments: PostAttachment[] | undefined,
  options: MediaRenderOptions,
) => {
  const { imageStyle, useAutoSize, resizeMode, horizontalPaddingWithAutoSize } = options;

  const [loading, setLoading] = useState(true);
  const screenDimensions = Dimensions.get('window');
  const imageWidth = screenDimensions.width - (horizontalPaddingWithAutoSize || 0);

  const MediaAttachment = React.useMemo(() => {
    if (!attachments || attachments.length === 0) return undefined;

    // Currently only render one attachment
    // TODO: Add the ability to render multiple attachments
    const [attachment] = attachments;

    // Currently only render media attachments
    // TODO: Support the rendering of poll attachments too
    if ('uri' in attachment.content) {
      let imageHeight = 0;
      if (attachment.size) {
        const ratio =
          (Dimensions.get('window').width - (horizontalPaddingWithAutoSize || 0)) /
          attachment.size.width;
        imageHeight = attachment.size.height * ratio;
      }

      return (
        <FastImage
          resizeMode={resizeMode}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          source={{
            uri: _.get(attachment, 'content.uri'),
          }}
          // @ts-ignore
          style={
            useAutoSize
              ? [
                  {
                    height: imageHeight,
                    width: imageWidth,
                  },
                  imageStyle,
                ]
              : imageStyle || StyleSheet.absoluteFillObject
          }
        />
      );
    }
  }, [attachments, useAutoSize, imageWidth, resizeMode, loading]);

  return {
    MediaAttachment,
    loading,
  };
};

export default useRenderMediaAttachment;
