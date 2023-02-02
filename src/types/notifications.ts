/**
 * Every notification type, more to be added if needed
 */
export enum NotificationType {
  // Transactions
  TransactionSuccess = 'transaction_success',
  TransactionFail = 'transaction_fail',

  // Social
  Comment = 'comment',
  Reply = 'reply',
  Mention = 'mention',
  Quote = 'quote',
  Follow = 'follow',
  ReactionPost = 'reaction_post',
  ReactionComment = 'reaction_comment',
  ReactionReply = 'reaction_reply',
  InviteClaimed = 'invite_claimed',
  InviteUnlocked = 'invite_unlocked',
}

export interface BaseNotificationData {
  type: NotificationType;
}

export interface TransactionNotificationData extends BaseNotificationData {
  txHash: string;
}

export interface TransactionSuccessNotificationData extends TransactionNotificationData {
  type: NotificationType.TransactionSuccess;
}

export interface TransactionFailNotificationData extends TransactionNotificationData {
  type: NotificationType.TransactionFail;
}

export interface SocialNotificationData extends BaseNotificationData {
  title: string;
  body: string;
}

export interface CommentNotificationData extends SocialNotificationData {
  type: NotificationType.Comment;
  subspaceId: number;
  postId: number;
}

export interface ReplyNotificationData extends SocialNotificationData {
  type: NotificationType.Reply;
  subspaceId: number;
  commentId: number;
}

export interface PostReactionNotificationData extends SocialNotificationData {
  type: NotificationType.ReactionPost;
  subspaceId: number;
  postId: number;
}

export interface CommentReactionNotificationData extends SocialNotificationData {
  type: NotificationType.ReactionComment;
  subspaceId: number;
  commentId: number;
}

export interface ReplyReactionNotificationData extends SocialNotificationData {
  type: NotificationType.ReactionReply;
  subspaceId: number;
  commentId: number;
}

export interface FollowNotificationData extends SocialNotificationData {
  type: NotificationType.Follow;
  subspaceId: number;
}

export interface InviteClaimedNotificationData extends SocialNotificationData {
  type: NotificationType.InviteClaimed;
}

export interface InviteUnlockedNotificationData extends SocialNotificationData {
  type: NotificationType.InviteUnlocked;
}

export type NotificationData =
  | TransactionSuccessNotificationData
  | TransactionFailNotificationData
  | CommentNotificationData
  | ReplyNotificationData
  | PostReactionNotificationData
  | CommentReactionNotificationData
  | ReplyReactionNotificationData
  | FollowNotificationData
  | InviteClaimedNotificationData
  | InviteUnlockedNotificationData;

export function isTransactionNotification(data: unknown): data is TransactionNotificationData {
  const { type } = data as TransactionNotificationData;
  return type === NotificationType.TransactionSuccess || type === NotificationType.TransactionFail;
}

export function isSocialNotification(data: unknown): data is SocialNotificationData {
  const { title, body } = data as SocialNotificationData;
  return title !== undefined && body !== undefined;
}
