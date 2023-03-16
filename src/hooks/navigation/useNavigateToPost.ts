import ROUTES from 'navigation/routes';
import { useCallback } from 'react';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

export interface NavigateToPostOptions {
  readonly focusCommentBox?: boolean;
  readonly focusPostId?: number;
  readonly navigationMethod?: 'push' | 'navigate';
}

/**
 * Hook that allows navigating to the screen that displays the details of a post.
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
