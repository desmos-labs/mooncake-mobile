import React from 'react';
import FastImage from 'react-native-fast-image';
import useStyles from './useStyles';

const NotificationImage = ({ post }: { post: any }) => {
  const styles = useStyles();

  return (
    post?.attachments.length > 0 && (
      <FastImage style={styles.postImage} source={{ uri: post.attachments[0].content.uri }} />
    )
  );
};

export default NotificationImage;
