import React, { useCallback } from 'react';
import { Image } from 'expo-image';
import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { Linking, TouchableOpacity } from 'react-native';
import { PostPreviewURL } from 'lib/PostsUtils';
import useStyles from './useStyles';

interface LinkPreviewProps {
  readonly url: PostPreviewURL;
}

/**
 * View that allows to display the preview of a URL.
 * @constructor
 */
const LinkPreview = (props: LinkPreviewProps) => {
  const styles = useStyles();
  const { url } = props;

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const onPressPreview = useCallback(() => {
    Linking.openURL(url.url);
  }, [url]);

  // -------------------------------------------------------------------------------------
  // --- Rendering
  // -------------------------------------------------------------------------------------

  return (
    <TouchableOpacity style={styles.containerStyle} activeOpacity={0.6} onPress={onPressPreview}>
      <Image
        transition={250}
        recyclingKey={url.previewUrl}
        contentFit="cover"
        style={styles.previewImage}
        source={{ uri: url.previewUrl }}
      />
      <Typography.Regular12 style={styles.text}>{url.text}</Typography.Regular12>
    </TouchableOpacity>
  );
};

export default LinkPreview;
