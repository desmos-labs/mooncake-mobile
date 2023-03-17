import { useCallback } from 'react';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import ROUTES from 'navigation/routes';

/**
 * Options that can be passed to the navigateToPost callback.
 */
export interface NavigateToPostOptions {
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
    (subspaceId: number, postId: number, options?: NavigateToPostOptions) => {
      options?.navigationMethod === 'push'
        ? push(ROUTES.POST_DETAILS, {
            subspaceId,
            postId,
            focusCommentBox: options?.focusCommentBox,
            focusPostId: options?.focusPostId,
          })
        : navigate(ROUTES.POST_DETAILS, {
            subspaceId,
            postId,
            focusCommentBox: options?.focusCommentBox,
            focusPostId: options?.focusPostId,
          });
    },
    [navigate, push],
  );
};

export default useNavigateToPost;
