import React from 'react';
import {ImageStyle, StyleProp, StyleSheet} from 'react-native';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';

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
        <FastImage
          source={{
            uri: _.get(attachment, 'content.uri'),
          }}
          // @ts-ignore
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
