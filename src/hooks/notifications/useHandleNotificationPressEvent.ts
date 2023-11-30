import ROUTES from 'navigation/routes';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { NotificationData, NotificationType } from 'types/notifications';
import { useActiveProfile } from '@recoil/profiles';
import useNavigateToPost from 'hooks/navigation/useNavigateToPost';
import useNavigateToProfileConnections from 'hooks/navigation/useNavigateToProfileConnections';
import { DesmosProfile } from 'types/desmos';

/**
 * Hook that allows handling the navigation to the proper screen when the user
 * clicks on a notification that is received from the server.
 */
const useHandleNotificationPressEvent = () => {
  const profile = useActiveProfile();

  // Navigation hooks
  const navigateToPost = useNavigateToPost();
  const navigateToFollowage = useNavigateToProfileConnections();

  // Return a callback that allows to navigate to the proper screen
  // given a ReceivedNotificationData instance that is retrieved from
  // the server
  return useCallback(
    <T extends NotificationData>(data: T | undefined) => {
      if (!profile) {
        return;
      }
      switch (data?.type) {
        case NotificationType.Comment:
          navigateToPost(data.subspaceId, data.postId);
          break;

        case NotificationType.Reply:
          navigateToPost(data.subspaceId, data.commentId, {
            focusPostId: data.replyId,
          });
          break;

        case NotificationType.ReactionPost:
          navigateToPost(data.subspaceId, data.postId);
          break;

        case NotificationType.ReactionComment:
          navigateToPost(data.subspaceId, data.commentId);
          break;

        case NotificationType.ReactionReply:
          navigateToPost(data.subspaceId, data.commentId, {
            focusPostId: data.replyId,
          });
          break;

        case NotificationType.Follow:
          navigateToFollowage(ROUTES.PROFILE_FOLLOWING, {
            address: data.userAddress,
          } as DesmosProfile);
          break;

        default:
          Alert.alert('Unmapped notification handling');
      }
    },
    [navigateToFollowage, navigateToPost, profile],
  );
};

export default useHandleNotificationPressEvent;
