import React from 'react';
import {Image, ImageStyle, StyleProp, StyleSheet} from 'react-native';
import _ from 'lodash';

/**
 * A hook to serve as a singular point to handle rendering of post media attachments
 */
const useRenderMediaAttachment = ({
  attachments,
  imageStyle,
}: {
  attachments?: PostAttachment[];
  imageStyle?: StyleProp<ImageStyle>;
}) => {
  const MediaAttachment = React.useMemo(() => {
    // currently only render one attachment
    if (!attachments || attachments.length === 0) return undefined;
    const [attachment] = attachments;

    // Only Media type attachments will have a uri property.
    if ('uri' in attachment.content) {
      return (
        <Image
          source={{
            uri: _.get(attachment, 'content.uri'),
          }}
          style={imageStyle || StyleSheet.absoluteFillObject}
        />
      );
    }
  }, [attachments]);

  return {
    MediaAttachment,
  };
};

export default useRenderMediaAttachment;
