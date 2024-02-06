import React, { useCallback, useMemo } from 'react';
import { Post } from 'types/posts';
import { Image } from 'expo-image';
import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { Linking, TouchableOpacity } from 'react-native';
import useStyles from './useStyles';

interface LinkPreviewProps {
  readonly post: Post;
}

/**
 * View that allows to display the preview of a link attached to a post.
 * @constructor
 */
const LinkPreview = (props: LinkPreviewProps) => {
  const styles = useStyles();
  const { post } = props;

  // -------------------------------------------------------------------------------------
  // --- Local variables
  // -------------------------------------------------------------------------------------

  // Get the first link to be rendered
  const urlToPreview = useMemo(() => {
    return post.urls.find(link => link.previewUrl !== undefined);
  }, [post]);

  // Get the text to be displayed as overlay
  const urlText = useMemo(() => {
    if (urlToPreview === undefined) {
      return '';
    }

    const regex = /^(https?:\/\/)?(([^:/?#]*)([^/?#]*))/;
    const match = urlToPreview.url.match(regex);
    if (match === null) {
      return '';
    }

    return `${match[1]}${match[2]}`;
  }, [urlToPreview]);

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const onPressPreview = useCallback(() => {
    if (urlToPreview === undefined) {
      return;
    }
    Linking.openURL(urlToPreview.url);
  }, [urlToPreview]);

  // -------------------------------------------------------------------------------------
  // --- Conditional rendering
  // -------------------------------------------------------------------------------------

  // If the post has some attachments, those should be rendered instead of the link preview.
  // If the post has no links to preview, return undefined
  if (post.attachments.length > 0 || urlToPreview === undefined) {
    return undefined;
  }

  // -------------------------------------------------------------------------------------
  // --- Rendering
  // -------------------------------------------------------------------------------------

  return (
    <TouchableOpacity style={styles.containerStyle} activeOpacity={0.6} onPress={onPressPreview}>
      <Image
        transition={250}
        recyclingKey={urlToPreview.previewUrl}
        contentFit="cover"
        style={styles.previewImage}
        source={{ uri: urlToPreview.previewUrl }}
      />
      <Typography.Regular12 style={styles.text}>{urlText}</Typography.Regular12>
    </TouchableOpacity>
  );
};

export default LinkPreview;
