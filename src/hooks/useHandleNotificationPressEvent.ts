import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { NotificationData, NotificationType } from 'types/notifications';
import { useActiveProfile } from '@recoil/profiles';

/**
 * Hook that allows handling the navigation to the proper screen when the user
 * clicks on a notification that is received from the server.
 */
const useHandleNotificationPressEvent = () => {
  const { navigate } = useNavigation<StackScreenProps<RootNavigatorParamList>['navigation']>();

  const profile = useActiveProfile();

  // Return a callback that allows to navigate to the proper screen
  // given a ReceivedNotificationData instance that is retrieved from
  // the server
  return useCallback(
    (data: NotificationData | undefined) => {
      if (!profile) {
        return;
      }

      switch (data?.type) {
        case NotificationType.Comment:
          navigate(ROUTES.POST_DETAILS, {
            postId: data.postId,
            subspaceId: data.subspaceId,
            focusCommentBox: false,
          });
          break;

        case NotificationType.Reply:
          navigate(ROUTES.COMMENT_REPLIES, {
            commentId: data.commentId,
            subspaceId: data.subspaceId,
          });
          break;

        case NotificationType.ReactionPost:
          navigate(ROUTES.POST_DETAILS, {
            subspaceId: data.subspaceId,
            postId: data.postId,
            focusCommentBox: false,
          });
          break;

        case NotificationType.ReactionComment:
        case NotificationType.ReactionReply:
          navigate(ROUTES.COMMENT_REPLIES, {
            commentId: data.commentId,
            subspaceId: data.subspaceId,
          });
          break;

        case NotificationType.Follow:
          navigate(ROUTES.FOLLOWING_AND_FOLLOWERS, {
            screen: ROUTES.FOLLOWING,
            params: {
              subspaceID: data.subspaceId,
              userAddress: profile.address,
              headerTitle: profile.nickname?.trim() || `@${profile.dtag}`,
            },
          });
          break;

        case NotificationType.InviteClaimed:
          navigate(ROUTES.MANAGE_INVITES);
          break;

        case NotificationType.InviteUnlocked:
          navigate(ROUTES.SETTINGS_INVITES);
          break;

        default:
          Alert.alert('Unmapped notification handling');
      }
    },
    [profile],
  );
};

export default useHandleNotificationPressEvent;
