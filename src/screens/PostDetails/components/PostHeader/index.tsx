import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import PostData from 'components/PostData';
import Spacer from 'components/Spacer';
import useFormatTimeForPostDetails from 'hooks/formatting/useFormatTimeForPostDetails';
import useAddOrRemoveLike from 'hooks/reactions/useAddOrRemoveLike';
import React from 'react';
import InteractionCountersBar from 'screens/PostDetails/components/InteractionCountersBar';
import PostActionButtonsBar from 'screens/PostDetails/components/PostActionButtonsBar';
import PostTopBar from 'screens/PostDetails/components/PostTopBar';
import { useHandlePressCounters } from 'screens/PostDetails/hooks';
import { Post } from 'types/posts';
import useStyles from './useStyles';

interface Props {
  post: Post;
  commentsCount: number;
  handlePressComment: () => void;
  handlePressShare: () => void;
}

/**
 * Component that renders the header of the post details screen.
 * @param post - Post to render
 * @param commentsCount - Number of comments of the post
 * @param handlePressComment - What to do when the Comment button is pressed. (i.e focus on the text input)
 * @param handlePressShare - What to do when the Share button is pressed.
 * @constructor
 */
const PostHeader = ({ post, commentsCount, handlePressComment, handlePressShare }: Props) => {
  const styles = useStyles();

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const { liked, addOrRemoveLike, likesCount } = useAddOrRemoveLike(post);
  const formatDate = useFormatTimeForPostDetails();

  // -------------------------------------------------------------------------------------
  // --- Handlers
  // -------------------------------------------------------------------------------------

  const handlePressCounters = useHandlePressCounters();

  // -------------------------------------------------------------------------------------
  // --- View rendering
  // -------------------------------------------------------------------------------------

  return (
    <>
      <PostTopBar post={post} />
      <PostData post={post!} />
      <Spacer paddingBottom="m" />
      <Typography.Regular12 style={styles.date}>
        {formatDate(post.creationDate)}
      </Typography.Regular12>
      <Spacer paddingBottom="m" />
      <InteractionCountersBar
        loading={false}
        likesCounter={likesCount}
        commentsCounter={commentsCount}
        handlePressCounters={() => handlePressCounters(post!)}
        interactionAuthors={[]}
      />
      <PostActionButtonsBar
        postLiked={liked}
        handleLikePress={() => addOrRemoveLike(post!)}
        handleCommentPress={handlePressComment}
        handlePressShare={handlePressShare}
      />
      <Spacer paddingBottom={16} />
    </>
  );
};

export default PostHeader;
