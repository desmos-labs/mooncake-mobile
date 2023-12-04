import { Image } from 'expo-image';
import { ImageContentFit } from 'expo-image/src/Image.types';
import React, { useState } from 'react';
import { Dimensions, ImageStyle, StyleProp, StyleSheet } from 'react-native';
import { PostAttachment, PostAttachmentType } from 'types/posts';

export interface MediaRenderOptions {
  readonly imageStyle?: StyleProp<ImageStyle>;
  readonly useAutoSize?: boolean;
  readonly resizeMode: ImageContentFit;
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
    if (attachment.content.type === PostAttachmentType.MEDIA) {
      let imageHeight = 0;
      if (attachment.size) {
        const ratio =
          (screenDimensions.width - (horizontalPaddingWithAutoSize || 0)) / attachment.size.width;
        imageHeight = attachment.size.height * ratio;
      }

      return (
        <Image
          recyclingKey={attachment.content.uri}
          contentFit={resizeMode}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          source={{ uri: attachment.content.uri }}
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
  }, [
    attachments,
    resizeMode,
    useAutoSize,
    imageWidth,
    imageStyle,
    screenDimensions.width,
    horizontalPaddingWithAutoSize,
  ]);

  return {
    MediaAttachment,
    loading,
  };
};

export default useRenderMediaAttachment;
