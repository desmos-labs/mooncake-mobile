import { Image } from 'expo-image';
import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Post, PostAttachmentType } from 'types/posts';
import { MediaRenderOptions } from 'hooks/rendering/types';

interface ImageSize {
  readonly width: number;
  readonly height: number;
}

/**
 * Compute the size of the image based on the aspect ratio of the image and the screen width.
 * @param imageSize The size of the image
 * @param horizontalPadding The horizontal padding to apply to the image
 */
const computeImageSize = (imageSize?: ImageSize, horizontalPadding: number = 0): ImageSize => {
  const screenDimensions = Dimensions.get('window');
  const padding = horizontalPadding || 0;

  // Compute the width of the image
  const imageWidth = screenDimensions.width - padding;

  if (imageSize === undefined) {
    // If the image size is not available, we return a default 16:9 aspect ratio
    return {
      width: imageWidth,
      height: (imageWidth * 9) / 16,
    };
  }

  // If the image size is available, we compute the height based on the aspect ratio of the image
  const ratio = (screenDimensions.width - padding) / imageSize.width;
  const imageHeight = imageSize.height * ratio;
  return {
    width: imageWidth,
    height: imageHeight,
  };
};

/**
 * A hook to serve as a singular point to handle rendering of post media attachments
 */
const useRenderMediaAttachment = (post: Post, options?: MediaRenderOptions) => {
  const { imageStyle, useAutoSize, resizeMode, horizontalPaddingWithAutoSize } = options ?? {};

  const MediaAttachment = React.useMemo(() => {
    const { attachments } = post;
    if (!attachments || attachments.length === 0) {
      return undefined;
    }

    // Currently only render one attachment
    // TODO: Add the ability to render multiple attachments
    const [attachment] = attachments;

    // Currently only render media attachments
    // TODO: Support the rendering of poll attachments too
    if (attachment.content.type === PostAttachmentType.MEDIA) {
      const { width, height } = computeImageSize(attachment.size, horizontalPaddingWithAutoSize);

      return (
        <Image
          transition={250}
          recyclingKey={attachment.content.uri}
          contentFit={resizeMode ?? 'cover'}
          source={{ uri: attachment.content.uri }}
          // @ts-ignore
          style={
            useAutoSize
              ? [
                  {
                    height,
                    width,
                  },
                  imageStyle,
                ]
              : imageStyle || StyleSheet.absoluteFillObject
          }
        />
      );
    }
  }, [post, horizontalPaddingWithAutoSize, resizeMode, useAutoSize, imageStyle]);

  return {
    MediaAttachment,
  };
};

export default useRenderMediaAttachment;
