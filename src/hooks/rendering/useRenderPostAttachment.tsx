import { Post } from 'types/posts';
import { AttachmentRenderOptions, MediaRenderOptions, RenderProps } from 'hooks/rendering/types';
import useRenderMediaAttachment from 'hooks/rendering/useRenderMediaAttachment';
import useRenderLinkPreview from 'hooks/rendering/useRenderLinkPreview';
import { Dimensions, StyleSheet } from 'react-native';
import { getPostAttachmentData } from 'lib/PostsUtils';

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
 * Get the rendering options for the attachment.
 * @param size The size of the attachment
 * @param options The options to use when rendering the attachment
 */
const getRenderProps = (size?: ImageSize, options?: MediaRenderOptions): RenderProps => {
  const { imageStyle, useAutoSize, resizeMode, horizontalPaddingWithAutoSize } = options ?? {};
  const { width, height } = computeImageSize(size, horizontalPaddingWithAutoSize);
  return {
    style: useAutoSize
      ? [
          {
            height,
            width,
          },
          imageStyle,
        ]
      : imageStyle || StyleSheet.absoluteFillObject,
    contentFit: resizeMode ?? 'cover',
  };
};

/**
 * A hook to serve as a singular point to handle rendering of post attachments.
 * @param post The post to render the attachment for
 * @param options The options to use when rendering the attachment
 */
const useRenderPostAttachment = (post: Post, options?: AttachmentRenderOptions) => {
  const attachmentData = getPostAttachmentData(post);
  const renderProps = getRenderProps(attachmentData?.size, options?.media);

  const { MediaAttachment } = useRenderMediaAttachment(post, renderProps);
  const { LinkPreview } = useRenderLinkPreview(post, renderProps);

  return {
    Attachment: MediaAttachment ?? LinkPreview,
  };
};

export default useRenderPostAttachment;
