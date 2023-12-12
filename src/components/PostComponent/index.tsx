import Typography from 'components/Typography';
import CommonStyles from 'config/theme/CommonStyles';
import useRenderMediaAttachment from 'hooks/rendering/useRenderMediaAttachment';
import { useTheme } from 'native-base';
import React from 'react';
import { View } from 'react-native';
import { Post } from 'types/posts';
import useStyles from './useStyles';

type Props = {
  /**
   * The post to be displayed.
   */
  post: Post;
};

/**
 * Component that allows to display the contents of a post.
 * TODO: Refactor this component to handle images and text + image shareable between home and post details
 * @constructor
 */
const PostComponent = (props: Props) => {
  const styles = useStyles();
  const theme = useTheme();

  const { post } = props;

  // -------------------------------------------------------------------------------------
  // --- Child components
  // -------------------------------------------------------------------------------------

  const { MediaAttachment } = useRenderMediaAttachment(post.attachments, {
    resizeMode: 'contain',
    useAutoSize: true,
  });

  const Content = React.useMemo(() => {
    if (post.text && post.attachments?.length === 0) {
      return (
        <View style={styles.textContainer}>
          <Typography.Body5>{post.text}</Typography.Body5>
        </View>
      );
    } else if (!post.text && post.attachments?.length !== 0) {
      return <View style={CommonStyles.flex[1]}>{MediaAttachment}</View>;
    } else {
      return (
        <View>
          <Typography.Body5 style={{ margin: theme.spacing.m }}>{post.text}</Typography.Body5>
          {MediaAttachment}
        </View>
      );
    }
  }, [MediaAttachment, post.attachments?.length, post.text, styles.textContainer, theme.spacing.m]);

  // -------------------------------------------------------------------------------------
  // --- Rendering
  // -------------------------------------------------------------------------------------

  return (
    <View onStartShouldSetResponder={() => true} style={styles.container}>
      {Content}
    </View>
  );
};

export default PostComponent;
