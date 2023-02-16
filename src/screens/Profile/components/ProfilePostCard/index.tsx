import React from 'react';
import { TouchableOpacity } from 'react-native';
import Typography from 'components/Typography';
import useRenderMediaAttachment from 'hooks/rendering/useRenderMediaAttachment';
import { Post } from 'types/posts';
import useStyles from './useStyles';

type ProfilePostCardProps = {
  post: Post;
  onPress: () => void;
  postsSize: number;
  postsMargin: string | number;
};

/**
 * Component for rendering a post in the profile screen.
 * @constructor
 */
const ProfilePostCard = (props: ProfilePostCardProps) => {
  const { post, onPress, postsSize, postsMargin } = props;
  const styles = useStyles({ size: postsSize, margin: postsMargin });

  const { MediaAttachment } = useRenderMediaAttachment(post.attachments, {
    resizeMode: 'cover',
  });

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {MediaAttachment}
      <Typography.H2 style={styles.textStyle}>{post.text}</Typography.H2>
    </TouchableOpacity>
  );
};

export default ProfilePostCard;
