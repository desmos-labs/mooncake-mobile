import { useCallback } from 'react';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import ROUTES from 'navigation/routes';
import { Post } from 'types/posts';

/**
 * Options that can be passed to the navigateToPost callback.
 */
interface NavigateToPostOptions {
  /**
   * Whether to focus the comment box when navigating to the post details screen.
   */
  readonly focusCommentBox?: boolean;
  /**
   * The id of the post to focus on when navigating to the post details screen.
   */
  readonly focusPostId?: number;
  /**
   * The navigation method to use when navigating to the post details screen.
   */
  readonly navigationMethod?: 'push' | 'navigate';

  /**
   * Existing post data so the post can be immediately rendered when navigating to the
   * details screen.
   */
  readonly initialPostData?: Post;
}

/**
 * Hook that allows navigating to the screen that displays the details of a post.
 * It returns a callback that allows to navigate to the proper screen given a subspace id and post id.
 */
const useNavigateToPost = () => {
  const { navigate, push } =
    useNavigation<StackScreenProps<RootNavigatorParamList>['navigation']>();

  // Return a callback that allows to navigate to the proper screen
  // given a subspace id and post id
  return useCallback(
    (postId: number, options?: NavigateToPostOptions) => {
      options?.navigationMethod === 'push'
        ? push(ROUTES.POST_DETAILS, {
            postId,
            focusCommentBox: options?.focusCommentBox,
            focusPostId: options?.focusPostId,
            initialPostData: options?.initialPostData,
          })
        : navigate(ROUTES.POST_DETAILS, {
            postId,
            focusCommentBox: options?.focusCommentBox,
            focusPostId: options?.focusPostId,
            initialPostData: options?.initialPostData,
          });
    },
    [navigate, push],
  );
};

export default useNavigateToPost;
