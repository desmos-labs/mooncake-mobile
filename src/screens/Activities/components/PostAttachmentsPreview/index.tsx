import React from 'react';
import FastImage from 'react-native-fast-image';
import { Post } from 'types/posts';
import useStyles from './useStyles';

export interface NotificationImageProps {
  readonly post: Post;
}

/**
 * Component that represents the image associated to a notification
 * and shows the preview of a post attachments.
 * @constructor
 */
const PostAttachmentsPreview = (props: NotificationImageProps) => {
  const styles = useStyles();
  const { post } = props;

  if (post.attachments.length === 0) {
    return null;
  }

  // TODO: Support multiple attachments
  return <FastImage style={styles.postImage} source={{ uri: post.attachments[0].content.uri }} />;
};

export default PostAttachmentsPreview;
