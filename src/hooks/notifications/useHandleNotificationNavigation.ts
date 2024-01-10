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
    (notificationData: NotificationData) => {
      switch (notificationData.notification_type) {
        case NotificationType.PostCreated:
          if (notificationData.post_id) {
            navigation.navigate(ROUTES.POST_DETAILS, {
              postId: parseInt(notificationData.post_id, 10),
            });
          }
          break;

        case NotificationType.PostRepost:
          navigation.navigate(ROUTES.POST_DETAILS, {
            postId: parseInt(notificationData.repost_id, 10),
          });
          break;
        case NotificationType.PostQuote:
          navigation.navigate(ROUTES.POST_DETAILS, {
            postId: parseInt(notificationData.quote_id, 10),
          });
          break;

        case NotificationType.PostComment:
          navigation.navigate(ROUTES.POST_DETAILS, {
            postId: parseInt(notificationData.post_id, 10),
            focusPostId: parseInt(notificationData.comment_id, 10),
          });
          break;

        case NotificationType.PostMention:
          navigation.navigate(ROUTES.POST_DETAILS, {
            postId: parseInt(notificationData.mention_id, 10),
          });
          break;

        case NotificationType.PostLike:
          navigation.navigate(ROUTES.POST_DETAILS, {
            postId: parseInt(notificationData.post_id, 10),
          });
          break;

        case NotificationType.RelationshipCreated:
          if (notificationData.counterparty_address) {
            navigation.navigate(ROUTES.GUEST_PROFILE, {
              address: notificationData.counterparty_address,
            });
          }
          break;

        case NotificationType.NewFollower:
          navigation.navigate(ROUTES.GUEST_PROFILE, {
            address: notificationData.follower_address,
          });
          break;
      }
    },
    [navigation],
  );
};

export default useHandleNotificationNavigation;
