import _ from 'lodash';
import React, {useState} from 'react';
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
  const [loading, setLoading] = useState(true);
  const screenDimensions = Dimensions.get('window');
  const imageWidth =
    screenDimensions.width - (horizontalPaddingWithAutoSize || 0);

  const MediaAttachment = React.useMemo(() => {
    // currently only render one attachment
    if (!attachments || attachments.length === 0) return undefined;
    const [attachment] = attachments;
    // Only Media type attachments will have a uri property.
    if ('uri' in attachment.content && attachment?.size?.length > 0) {
      const attachmentDimensions = attachment.size[0] || null;
      let ratio = 0;
      let imageHeight = 0;
      if (attachmentDimensions) {
        ratio =
          (Dimensions.get('window').width -
            (horizontalPaddingWithAutoSize || 0)) /
          attachmentDimensions.width;
        imageHeight = attachmentDimensions.height * ratio;
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
