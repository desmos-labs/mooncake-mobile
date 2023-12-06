import React from 'react';
import PostComponent from 'components/PostComponent';
import PostActionButtonsBar from 'screens/PostDetails/components/PostActionButtonsBar';
import Spacer from 'components/Spacer';
import { Divider } from 'native-base';
import { isRootPost, Post } from 'types/posts';
import usePostReactionsCount from 'hooks/reactions/usePostReactionsCount';
import CommentItem from 'screens/PostInteraction/PostComments/components/CommentItem';
import useAddOrRemoveLike from 'hooks/reactions/useAddOrRemoveLike';
import InteractionCountersBar from 'screens/PostDetails/components/InteractionCountersBar';
import { useHandlePressCounters } from 'screens/PostDetails/hooks';
import useStyles from './useStyles';

interface Props {
  post: Post;

  handlePressComment: () => void;
}

/**
 * Component that renders the header of the post details screen.
 * @param post - Post to render
 * @param handlePressComment - What to do when the Comment button is pressed. (i.e focus on the text input)
 * @constructor
 */
const PostHeader = ({ post, handlePressComment }: Props) => {
  const styles = useStyles();

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  // Reactions data
  const { count: reactionsCount, loading: isReactionsCountLoading } = usePostReactionsCount(post);

  // -------------------------------------------------------------------------------------
  // --- Handlers
  // -------------------------------------------------------------------------------------

  const { liked, addOrRemoveLike } = useAddOrRemoveLike(post);
  const handlePressCounters = useHandlePressCounters();

  // -------------------------------------------------------------------------------------
  // --- View rendering
  // -------------------------------------------------------------------------------------

  return (
    <>
      {/* Top Component */}
      {isRootPost(post) ? (
        <>
          <PostComponent post={post!} />
          <PostActionButtonsBar
            postLiked={liked}
            handleLikePress={() => addOrRemoveLike(post!)}
            handleCommentPress={handlePressComment}
          />
        </>
      ) : (
        <>
          <CommentItem comment={post!} renderedAsMainPost />
          <Spacer paddingVertical={16} />
          <Divider style={styles.divider} />
        </>
      )}

      <Spacer paddingVertical={16}>
        {/* Like, Comment and Tips bar */}
        <InteractionCountersBar
          loading={isReactionsCountLoading}
          likesCounter={reactionsCount}
          handlePressCounters={() => handlePressCounters(post!)}
          interactionAuthors={[]}
        />
      </Spacer>

      <Divider style={styles.divider} />
      <Spacer paddingBottom={16} />
    </>
  );
};

export default PostHeader;
