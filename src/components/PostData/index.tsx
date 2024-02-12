import { useTheme } from '@react-navigation/native';
import PostText from 'components/PostText';
import { AttachmentRenderOptions } from 'hooks/rendering/types';
import useRenderPostAttachment from 'hooks/rendering/useRenderPostAttachment';
import React from 'react';
import { View } from 'react-native';
import { Post } from 'types/posts';
import useStyles from './useStyles';

type Props = {
  /**
   * The post to be displayed.
   */
  readonly post: Post;

  readonly attachmentRenderOptions?: AttachmentRenderOptions;
};

/**
 * Component that allows to display the data of a post. These include the post texts and the attachments.
 * @constructor
 */
const PostData = (props: Props) => {
  const theme = useTheme();
  const styles = useStyles();

  const { post, attachmentRenderOptions } = props;

  // -------------------------------------------------------------------------------------
  // --- Child components
  // -------------------------------------------------------------------------------------

  const { Attachment } = useRenderPostAttachment(post, {
    media: {
      useAutoSize: true,
      resizeMode: 'contain',
      horizontalPaddingWithAutoSize: 32,
      imageStyle: { borderRadius: 8, backgroundColor: theme.colors.neutralVariants['300'] },
      ...attachmentRenderOptions?.media,
    },
  });

  // -------------------------------------------------------------------------------------
  // --- Rendering
  // -------------------------------------------------------------------------------------

  return (
    <View style={styles.container}>
      {post.text && <PostText style={styles.textContainer}>{post.text}</PostText>}
      {Attachment && <View style={styles.attachmentContainer}>{Attachment}</View>}
    </View>
  );
};

export default PostData;
