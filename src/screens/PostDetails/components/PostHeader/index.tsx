import React from 'react';
import PostComponent from 'components/PostComponent';
import PostActionButtonsBar from 'screens/PostDetails/components/PostActionButtonsBar';
import Spacer from 'components/Spacer';
import InteractionCountersBar from 'screens/PostDetails/components/InteractionCountersBar';
import { Divider } from 'native-base';
import { Post } from 'types/posts';
import usePostReactionsCount from 'hooks/reactions/usePostReactionsCount';
import useHasReacted from 'hooks/reactions/useHasReacted';
import usePostTipsCount from 'hooks/tips/usePostTipsCount';
import usePostInteractionsAuthors from 'hooks/posts/usePostInteractionsAuthors';
import useFocusTextInputOnNavigate from 'hooks/useFocusTextInputOnNavigate';
import {
  useHandlePressCounters,
  useHandlePressReaction,
  useHandlePressSendTips,
} from 'screens/PostDetails/hooks';
import useStyles from './useStyles';

interface Props {
  post: Post;
}

/**
 * Component that renders the header of the post details screen.
 * @param post - Post to render
 * @constructor
 */
const PostHeader = ({ post }: Props) => {
  const styles = useStyles();
  const { focusTextInputRef } = useFocusTextInputOnNavigate();

  // Reactions data
  const { count: reactionsCount, loading: isReactionsCountLoading } = usePostReactionsCount(post);
  const hasReacted = useHasReacted(post);

  // Tips data
  const { count: tipsCount, loading: isTipsCountLoading } = usePostTipsCount(post);

  // Interactions data
  const { authors: interactionsAuthors, loading: areInteractionsAuthorsLoading } =
    usePostInteractionsAuthors(post, 3);

  /**
   * Handlers for post actions
   */
  const handlePressCounters = useHandlePressCounters();
  const handlePressReaction = useHandlePressReaction();
  const handlePressSendTips = useHandlePressSendTips();

  return (
    <>
      <PostComponent post={post!} />
      <PostActionButtonsBar
        postLiked={hasReacted}
        handleLikePress={() => handlePressReaction(post!)}
        handleCommentPress={focusTextInputRef}
        handleTipPress={() => handlePressSendTips(post!)}
      />
      <Spacer paddingVertical={16}>
        <InteractionCountersBar
          loading={isReactionsCountLoading || isTipsCountLoading || areInteractionsAuthorsLoading}
          likesCounter={reactionsCount}
          tipsCounter={tipsCount}
          handlePressCounters={() => handlePressCounters(post!)}
          interactionAuthors={interactionsAuthors}
        />
      </Spacer>
      <Divider style={styles.divider} />
      <Spacer paddingBottom={16} />
    </>
  );
};

export default PostHeader;
