import React, { useCallback, useMemo } from 'react';
import PostComponent from 'components/PostComponent';
import PostActionButtonsBar from 'screens/PostDetails/components/PostActionButtonsBar';
import Spacer from 'components/Spacer';
import InteractionCountersBar from 'screens/PostDetails/components/InteractionCountersBar';
import { Divider } from 'native-base';
import { isRootPost, PostData } from 'types/posts';
import usePostTipsCount from 'hooks/tips/usePostTipsCount';
import usePostInteractionsAuthors from 'hooks/posts/usePostInteractionsAuthors';
import { useHandlePressCounters, useHandlePressSendTips } from 'screens/PostDetails/hooks';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useTranslation } from 'react-i18next';
import CommentItem from 'screens/PostInteraction/PostComments/components/CommentItem';
import useAddOrRemoveLike from 'hooks/reactions/useAddOrRemoveLike';
import useCustomToast from 'hooks/extended/useCustomToast';
import useStyles from './useStyles';

interface Props {
  /**
   * Post to render.
   */
  post: PostData;

  /**
   * What to do when the Comment button is pressed. (i.e focus on the text input)
   */
  handlePressComment: () => void;
}

/**
 * Component that renders the header of the post details screen.
 * @constructor
 */
const PostHeader = (props: Props) => {
  const styles = useStyles();
  const { t } = useTranslation('postDetails');

  const { post, handlePressComment } = props;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const toast = useCustomToast();
  const activeAddress = useActiveAccountAddress();

  // Tips data
  const { count: tipsCount, loading: isTipsCountLoading } = usePostTipsCount(post);

  // Interactions data
  const { authors: interactionsAuthors, loading: areInteractionsAuthorsLoading } =
    usePostInteractionsAuthors(post, 3);

  // User data
  const isCurrentUserAuthor = useMemo(
    () => post.author.address === activeAddress,
    [post, activeAddress],
  );

  // -------------------------------------------------------------------------------------
  // --- Handlers
  // -------------------------------------------------------------------------------------

  const { liked, addOrRemoveLike } = useAddOrRemoveLike(post);
  const handlePressCounters = useHandlePressCounters();
  const handlePressSendTips = useHandlePressSendTips();

  /**
   * Checks if the current user is the author of the post and shows a toast if that's the case or calls the handler to send tips
   */
  const checkUserAndHandleSendTips = useCallback(() => {
    if (isCurrentUserAuthor) {
      toast.errorNoRetry(t('common:cannot tip yourself'));
    } else {
      handlePressSendTips(post);
    }
  }, [handlePressSendTips, isCurrentUserAuthor, post, t, toast]);

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
            handleTipPress={checkUserAndHandleSendTips}
          />
        </>
      ) : (
        <>
          <CommentItem comment={post!} />
          <Spacer paddingVertical={16} />
          <Divider style={styles.divider} />
        </>
      )}

      <Spacer paddingVertical={16}>
        {/* Like, Comment and Tips bar */}
        <InteractionCountersBar
          loading={isTipsCountLoading || areInteractionsAuthorsLoading}
          likesCounter={post.reactionsCount}
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
