import { Image } from 'expo-image';
import React from 'react';
import useStyles from './useStyles';

interface NotificationImageProps {
  readonly imageUrl: string;
}

/**
 * Component that represents the image associated to a notification
 * and shows the preview of a post attachments.
 * @constructor
 */
const PostAttachmentsPreview = (props: NotificationImageProps) => {
  const styles = useStyles();
  const { imageUrl } = props;

  // TODO: Support multiple attachments
  return <Image style={styles.postImage} source={imageUrl} />;
};

export default PostAttachmentsPreview;
