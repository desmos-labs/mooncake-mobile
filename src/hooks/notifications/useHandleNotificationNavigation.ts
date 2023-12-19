import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { NotificationData, NotificationType } from 'types/notifications';

/**
 * Hook that provides a function to navigate to the screen
 * corresponding to a notification.
 */
const useHandleNotificationNavigation = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();

  return React.useCallback(
    (notficationData: NotificationData) => {
      switch (notficationData.type) {
        case NotificationType.PostRepost:
          navigation.navigate(ROUTES.POST_DETAILS, {
            postId: notficationData.repost_id,
          });
          break;
        case NotificationType.PostQuote:
          navigation.navigate(ROUTES.POST_DETAILS, {
            postId: notficationData.quote_id,
          });
          break;

        case NotificationType.PostComment:
          navigation.navigate(ROUTES.POST_DETAILS, {
            postId: notficationData.post_id,
            focusPostId: notficationData.comment_id,
          });
          break;

        case NotificationType.PostMention:
          navigation.navigate(ROUTES.POST_DETAILS, {
            postId: notficationData.mention_id,
          });
          break;

        case NotificationType.PostLike:
          navigation.navigate(ROUTES.POST_DETAILS, {
            postId: notficationData.post_id,
          });
          break;
      }
    },
    [navigation],
  );
};

export default useHandleNotificationNavigation;
