import { Post } from 'types/posts';
import { DesmosProfile, PostReaction } from 'types/desmos';

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
  readonly type: NotificationType;
}

export interface TransactionNotificationData extends BaseNotificationData {
  readonly txHash: string;
}

export interface TransactionSuccessNotificationData extends TransactionNotificationData {
  readonly type: NotificationType.TransactionSuccess;
}

export interface TransactionFailNotificationData extends TransactionNotificationData {
  readonly type: NotificationType.TransactionFail;
}

export interface SocialNotificationData extends BaseNotificationData {
  readonly title: string;
  readonly body: string;
}

export interface CommentNotificationData extends SocialNotificationData {
  readonly type: NotificationType.Comment;
  readonly subspaceId: number;
  readonly postId: number;
  readonly commentId: number;
}

export interface ReplyNotificationData extends SocialNotificationData {
  readonly type: NotificationType.Reply;
  readonly subspaceId: number;
  readonly commentId: number;
  readonly replyId: number;
}

export interface PostReactionNotificationData extends SocialNotificationData {
  readonly type: NotificationType.ReactionPost;
  readonly subspaceId: number;
  readonly postId: number;
  readonly reactionId: number;
}

export interface CommentReactionNotificationData extends SocialNotificationData {
  readonly type: NotificationType.ReactionComment;
  readonly subspaceId: number;
  readonly postId: number;
  readonly commentId: number;
  readonly reactionId: number;
}

export interface ReplyReactionNotificationData extends SocialNotificationData {
  readonly type: NotificationType.ReactionReply;
  readonly subspaceId: number;
  readonly postId: number;
  readonly commentId: number;
  readonly replyId: number;
  readonly reactionId: number;
}

export interface FollowNotificationData extends SocialNotificationData {
  readonly type: NotificationType.Follow;
  readonly subspaceId: number;
  readonly follower: string;
}

export interface InviteClaimedNotificationData extends SocialNotificationData {
  readonly type: NotificationType.InviteClaimed;
  readonly claimer: string;
}

export interface InviteUnlockedNotificationData extends SocialNotificationData {
  readonly type: NotificationType.InviteUnlocked;
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

// -------------------------------------------------------------------------------------
// --- Complete notifications
// -------------------------------------------------------------------------------------

export interface CompleteNotificationData extends BaseNotificationData {
  /**
   * Unique ID of the notification.
   */
  readonly id: string;
  /**
   * Timestamp of the notification.
   */
  readonly timestamp: string;
  /**
   * Whether the user has read this notification in the past or not.
   */
  readonly isRead: boolean;
}

export interface CompleteCommentNotification extends CompleteNotificationData {
  type: NotificationType.Comment;
  /**
   * Post that has been commented
   */
  post: Post;
  /**
   * Comment that was added.
   */
  comment: Post;
}

export interface CompleteReplyNotification extends CompleteNotificationData {
  type: NotificationType.Reply;
  /**
   * Comment that has been replied to.
   */
  comment: Post;
  /**
   * Reply that was added.
   */
  reply: Post;
}

export interface CompletePostReactionNotification extends CompleteNotificationData {
  type: NotificationType.ReactionPost;
  /**
   * Post that has been reacted to.
   */
  post: Post;
  /**
   * Reaction that was added.
   */
  reaction: PostReaction;
}

export interface CompleteCommentReactionNotification extends CompleteNotificationData {
  type: NotificationType.ReactionComment;
  /**
   * Conversation inside which the comment is.
   */
  conversation: Post;
  /**
   * Comment to which the reaction was added.
   */
  comment: Post;
  /**
   * Reaction that was added.
   */
  reaction: PostReaction;
}

export interface CompleteReplyReactionNotification extends CompleteNotificationData {
  type: NotificationType.ReactionReply;
  /**
   * Conversation inside which the comment is.
   */
  conversation: Post;
  /**
   * Comment that the reply references.
   */
  comment: Post;
  /**
   * Comment reply to which the reaction was added.
   */
  reply: Post;
  /**
   * Reaction that was added.
   */
  reaction: PostReaction;
}

export interface CompleteFollowNotification extends CompleteNotificationData {
  type: NotificationType.Follow;
  /**
   * User that started following the user.
   */
  user: DesmosProfile;
}

export interface CompleteInviteClaimedNotification extends CompleteNotificationData {
  type: NotificationType.InviteClaimed;
  /**
   * Address of the user that has claimed the invite.
   */
  claimer: DesmosProfile;
}

export interface CompleteInviteUnlockedNotification extends CompleteNotificationData {
  type: NotificationType.InviteUnlocked;
}

export type CompleteNotification =
  | CompleteCommentNotification
  | CompleteReplyNotification
  | CompletePostReactionNotification
  | CompleteCommentReactionNotification
  | CompleteReplyReactionNotification
  | CompleteFollowNotification
  | CompleteInviteClaimedNotification
  | CompleteInviteUnlockedNotification;
