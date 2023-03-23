import React, { useCallback, useMemo } from 'react';
import PostComponent from 'components/PostComponent';
import PostActionButtonsBar from 'screens/PostDetails/components/PostActionButtonsBar';
import Spacer from 'components/Spacer';
import InteractionCountersBar from 'screens/PostDetails/components/InteractionCountersBar';
import { Divider } from 'native-base';
import { isRootPost, Post } from 'types/posts';
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
import { useActiveAccountAddress } from '@recoil/accounts';
import { useToast } from 'react-native-toast-notifications';
import ToastConfig from 'config/ToastConfig';
import { useTranslation } from 'react-i18next';
import CommentItem from 'screens/PostInteraction/PostComments/components/CommentItem';
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
  const { t } = useTranslation('postDetails');
  const { focusTextInputRef } = useFocusTextInputOnNavigate();
  const activeAddress = useActiveAccountAddress();
  const toast = useToast();
  // Reactions data
  const { count: reactionsCount, loading: isReactionsCountLoading } = usePostReactionsCount(post);
  const hasReacted = useHasReacted(post);

  // Tips data
  const { count: tipsCount, loading: isTipsCountLoading } = usePostTipsCount(post);

  // Interactions data
  const { authors: interactionsAuthors, loading: areInteractionsAuthorsLoading } =
    usePostInteractionsAuthors(post, 3);

  const isCurrentUserAuthor = useMemo(
    () => post.author.address === activeAddress,
    [post, activeAddress],
  );

  /**
   * Handlers for post actions
   */
  const handlePressCounters = useHandlePressCounters();
  const handlePressReaction = useHandlePressReaction();
  const handlePressSendTips = useHandlePressSendTips();

  /**
   * Checks if the current user is the author of the post and shows a toast if that's the case or calls the handler to send tips
   */
  const checkUserAndHandleSendTips = useCallback(() => {
    if (isCurrentUserAuthor) {
      toast.show(t('common:cannot tip yourself'), {
        type: ToastConfig.ERROR_NO_RETRY,
      });
    } else {
      handlePressSendTips(post);
    }
  }, [handlePressSendTips, isCurrentUserAuthor, post, t, toast]);

  const TopComponent = React.useMemo(() => {
    if (isRootPost(post!)) {
      return (
        <>
          <PostComponent post={post!} />
          <PostActionButtonsBar
            postLiked={hasReacted}
            handleLikePress={() => handlePressReaction(post!)}
            handleCommentPress={focusTextInputRef}
            handleTipPress={checkUserAndHandleSendTips}
          />
        </>
      );
    } else {
      return (
        <>
          <CommentItem comment={post!} />
          <Spacer paddingVertical={16} />
          <Divider style={styles.divider} />
        </>
      );
    }
  }, [
    checkUserAndHandleSendTips,
    focusTextInputRef,
    handlePressReaction,
    hasReacted,
    post,
    styles.divider,
  ]);

  return (
    <>
      {TopComponent}
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
