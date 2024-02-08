import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import CommonStyles from 'config/theme/CommonStyles';
import { useTheme } from 'native-base';
import React from 'react';
import { View } from 'react-native';
import { Post } from 'types/posts';
import PostText from 'components/PostText';
import useRenderPostAttachment from 'hooks/rendering/useRenderPostAttachment';
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

  const { Attachment } = useRenderPostAttachment(post, {
    media: {
      resizeMode: 'contain',
      useAutoSize: true,
    },
  });

  const Content = React.useMemo(() => {
    if (post.text && !Attachment) {
      // The post only has text
      return <PostText style={styles.textContainer}>{post.text}</PostText>;
    } else if (!post.text && Attachment) {
      // The post only has an attachment
      return <View style={CommonStyles.flex[1]}>{Attachment}</View>;
    } else {
      // The post has both text and an attachment
      return (
        <View>
          <Typography.Regular16 style={{ margin: theme.spacing.m }}>
            {post.text}
          </Typography.Regular16>
          {Attachment}
        </View>
      );
    }
  }, [Attachment, post.text, styles.textContainer, theme.spacing.m]);

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
