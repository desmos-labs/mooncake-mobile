import {
  CommentNotificationData,
  CommentReactionNotificationData,
  FollowNotificationData,
  InviteClaimedNotificationData,
  InviteUnlockedNotificationData,
  NotificationData,
  NotificationType,
  PostReactionNotificationData,
  ReplyNotificationData,
  ReplyReactionNotificationData,
  TransactionFailNotificationData,
  TransactionSuccessNotificationData,
} from 'types/notifications';

/**
 * Data received from the server.
 */
interface ReceivedNotificationData {
  readonly type: string;

  // Generic
  readonly notification_title: string | undefined;
  readonly notification_body: string | undefined;

  // Transactions
  readonly tx_hash: string | undefined;

  // Posts
  readonly subspace_id: string | undefined;
  readonly post_id: string | undefined;
  readonly comment_id: string | undefined;
  readonly comment_author: string | undefined;
  readonly reply_id: string | undefined;
  readonly reply_author: string | undefined;

  // Reactions
  readonly reaction_id: string | undefined;
  readonly reaction_author: string | undefined;

  // Relationships
  readonly relationship_creator: string | undefined;

  // Invites
  readonly inviter_address: string | undefined;
  readonly claimer_address: string | undefined;
}

/**
 * Converts the given remote notification data to a {@link ReceivedNotificationData} instance.
 * @param data {@link Record<string, string>} Remote notification data.
 */
const convertRemoteMessage = (data: any): ReceivedNotificationData => {
  return {
    type: data.type as NotificationType,

    notification_title: data.notification_title,
    notification_body: data.notification_body,

    tx_hash: data.tx_hash as string,

    subspace_id: data.subspace_id as string,
    post_id: data.post_id as string,
    comment_id: data.comment_id as string,
    comment_author: data.comment_author as string,
    reply_id: data.reply_id as string,
    reply_author: data.reply_author as string,

    reaction_id: data.reaction_id as string,
    reaction_author: data.reaction_author as string,

    relationship_creator: data.relationship_creator as string,

    inviter_address: data.inviter_address as string,
    claimer_address: data.claimer_address as string,
  };
};
/**
 * Parses the given received notification data into a {@link NotificationData} instance.
 * If the received type is not supported, returns `undefined` instead.
 * @param data {ReceivedNotificationData} - Data to be parsed.
 */
const parseNotification = (data: ReceivedNotificationData): NotificationData | undefined => {
  switch (data.type as NotificationType) {
    case NotificationType.TransactionSuccess:
      return {
        type: NotificationType.TransactionSuccess,
        txHash: data.tx_hash,
      } as TransactionSuccessNotificationData;

    case NotificationType.TransactionFail:
      return {
        type: NotificationType.TransactionFail,
        txHash: data.tx_hash,
      } as TransactionFailNotificationData;

    case NotificationType.Comment:
      return {
        type: NotificationType.Comment,
        title: data.notification_title,
        body: data.notification_body,
        subspaceId: parseInt(data?.subspace_id ?? '0', 10),
        postId: parseInt(data?.post_id ?? '0', 10),
        commentId: parseInt(data?.comment_id ?? '0', 10),
        commentAuthorAddress: data?.comment_author,
      } as CommentNotificationData;

    case NotificationType.Reply:
      return {
        type: NotificationType.Reply,
        title: data.notification_title,
        body: data.notification_body,
        subspaceId: parseInt(data?.subspace_id ?? '0', 10),
        commentId: parseInt(data?.post_id ?? '0', 10),
        replyId: parseInt(data?.reply_id ?? '0', 10),
        replyAuthorAddress: data?.reply_author,
      } as ReplyNotificationData;

    case NotificationType.ReactionPost:
      return {
        type: NotificationType.ReactionPost,
        title: data.notification_title,
        body: data.notification_body,
        subspaceId: parseInt(data?.subspace_id ?? '0', 10),
        postId: parseInt(data?.post_id ?? '0', 10),
        reactionId: parseInt(data?.reaction_id ?? '0', 10),
        reactionAuthorAddress: data?.reaction_author,
      } as PostReactionNotificationData;

    case NotificationType.ReactionComment:
      return {
        type: NotificationType.ReactionComment,
        title: data.notification_title,
        body: data.notification_body,
        postId: parseInt(data?.post_id ?? '0', 10),
        subspaceId: parseInt(data?.subspace_id ?? '0', 10),
        commentId: parseInt(data?.comment_id ?? '0', 10),
        reactionId: parseInt(data?.reaction_id ?? '0', 10),
        reactionAuthorAddress: data?.reaction_author,
      } as CommentReactionNotificationData;

    case NotificationType.ReactionReply:
      return {
        type: NotificationType.ReactionReply,
        title: data.notification_title,
        body: data.notification_body,
        subspaceId: parseInt(data?.subspace_id ?? '0', 10),
        postId: parseInt(data?.post_id ?? '0', 10),
        commentId: parseInt(data?.comment_id ?? '0', 10),
        replyId: parseInt(data?.reply_id ?? '0', 10),
        reactionId: parseInt(data?.reaction_id ?? '0', 10),
        reactionAuthorAddress: data?.reaction_author,
      } as ReplyReactionNotificationData;

    case NotificationType.Follow:
      return {
        type: NotificationType.Follow,
        title: data.notification_title,
        body: data.notification_body,
        subspaceId: parseInt(data?.subspace_id ?? '0', 10),
        userAddress: data?.relationship_creator,
      } as FollowNotificationData;

    case NotificationType.InviteClaimed:
      return {
        type: NotificationType.InviteClaimed,
        title: data.notification_title,
        body: data.notification_body,
        inviterAddress: data.inviter_address,
        claimerAddress: data.claimer_address,
      } as InviteClaimedNotificationData;

    case NotificationType.InviteUnlocked:
      return {
        type: NotificationType.InviteUnlocked,
        title: data.notification_title,
        body: data.notification_body,
      } as InviteUnlockedNotificationData;

    default:
      return undefined;
  }
};

/**
 * Parses the given remote notification `data` field into a {@link NotificationData} instance.
 */
// Suppress the default export warning as we might add other methods here in the future
// eslint-disable-next-line import/prefer-default-export
export const parseRemoteNotification = (data: any): NotificationData | undefined => {
  return parseNotification(convertRemoteMessage(data));
};
