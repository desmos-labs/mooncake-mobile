import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useCallback} from 'react';
import {Alert} from 'react-native';
import NotificationTypesEnum from 'types/notificationTypes';

const useHandleNotificationPressEvent = () => {
  const {navigate} =
    useNavigation<StackScreenProps<RootNavigatorParamList>['navigation']>();

  const navigateToCorrectScreen = useCallback(
    ({
      type,
      post_id,
      comment_id,
      reply_id,
      subspace_id,
    }: {
      type: NotificationTypesEnum;
      post_id?: string;
      comment_id?: string;
      reply_id?: string;
      subspace_id?: string;
    }) => {
      if (type === NotificationTypesEnum.Comment && comment_id) {
        console.log('navigate to comment');
        navigate(ROUTES.POST_DETAILS, {
          postId: parseInt(post_id!, 10),
          subspaceId: parseInt(subspace_id!, 10),
          focusCommentBox: false,
        });
      } else if (type === NotificationTypesEnum.Reply && reply_id) {
        console.log('navigate to reply');
        navigate(ROUTES.COMMENT_REPLIES, {
          commentId: parseInt(post_id!, 10),
          subspaceId: parseInt(subspace_id!, 10),
        });
      } else if (type === NotificationTypesEnum.Reaction && post_id) {
        navigate(ROUTES.POST_DETAILS, {
          subspaceId: parseInt(subspace_id!, 10),
          postId: parseInt(post_id!, 10),
          focusCommentBox: false,
        });
      } else {
        Alert.alert('Unmapped notification handling');
      }

      /*      if (type === NotificationTypesEnum.Follow) {
        navigate(ROUTES.FOLLOWING_AND_FOLLOWERS, {
          screen: ROUTES.FOLLOWING,
          params: {
            subspaceID: parseInt(subspace_id!, 10),
            userAddress: profileData?.address!,
            headerTitle:
              profileData?.nickname.trim() || `@${profileData?.dtag}`,
          },
        });
      } */
    },
    [navigate],
  );

  return {
    navigateToCorrectScreen,
  };
};

export default useHandleNotificationPressEvent;
