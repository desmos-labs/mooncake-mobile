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
  readonly userAddress: string;
}

export interface InviteClaimedNotificationData extends SocialNotificationData {
  readonly type: NotificationType.InviteClaimed;
  readonly inviterAddress: string;
  readonly claimerAddress: string;
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

export interface CompleteCommentNotification
  extends CompleteNotificationData,
    CommentNotificationData {
  type: NotificationType.Comment;
  /**
   * Post that has been commented
   * This is going to be `undefined` if the post has been deleted in the meanwhile.
   */
  post: Post | undefined;
  /**
   * Comment that was added.
   * This is going to be `undefined` if the comment has been deleted in the meanwhile.
   */
  comment: Post | undefined;
}

export interface CompleteReplyNotification extends CompleteNotificationData, ReplyNotificationData {
  type: NotificationType.Reply;
  /**
   * Comment that has been replied to.
   * This is going to be `undefined` if the comment has been deleted in the meanwhile.
   */
  comment: Post | undefined;
  /**
   * Reply that was added.
   * This is going to be `undefined` if the reply has been deleted in the meanwhile.
   */
  reply: Post | undefined;
}

export interface CompletePostReactionNotification
  extends CompleteNotificationData,
    PostReactionNotificationData {
  type: NotificationType.ReactionPost;
  /**
   * Post that has been reacted to.
   * This is going to be `undefined` if the post has been deleted in the meanwhile.
   */
  post: Post | undefined;
  /**
   * Reaction that was added.
   * This is going to be `undefined` if the reaction has been deleted in the meanwhile.
   */
  reaction: PostReaction | undefined;
}

export interface CompleteCommentReactionNotification
  extends CompleteNotificationData,
    CommentReactionNotificationData {
  type: NotificationType.ReactionComment;
  /**
   * Conversation inside which the comment is.
   * This is going to be `undefined` if the conversation has been deleted in the meanwhile.
   */
  conversation: Post | undefined;
  /**
   * Comment to which the reaction was added.
   * This is going to be `undefined` if the comment has been deleted in the meanwhile.
   */
  comment: Post | undefined;
  /**
   * Reaction that was added.
   * This is going to be `undefined` if the reaction has been deleted in the meanwhile.
   */
  reaction: PostReaction | undefined;
}

export interface CompleteReplyReactionNotification
  extends CompleteNotificationData,
    ReplyReactionNotificationData {
  type: NotificationType.ReactionReply;
  /**
   * Conversation inside which the comment is.
   * This is going to be `undefined` if the conversation has been deleted in the meanwhile.
   */
  conversation: Post | undefined;
  /**
   * Comment that the reply references.
   * This is going to be `undefined` if the comment has been deleted in the meanwhile.
   */
  comment: Post | undefined;
  /**
   * Comment reply to which the reaction was added.
   * This is going to be `undefined` if the reply has been deleted in the meanwhile.
   */
  reply: Post | undefined;
  /**
   * Reaction that was added.
   * This is going to be `undefined` if the reaction has been deleted in the meanwhile.
   */
  reaction: PostReaction | undefined;
}

export interface CompleteFollowNotification
  extends CompleteNotificationData,
    FollowNotificationData {
  type: NotificationType.Follow;
  /**
   * User that started following the user.
   * This is going to be `undefined` if the user has deleted their profile in the meanwhile.
   */
  user: DesmosProfile | undefined;
}

export interface CompleteInviteClaimedNotification
  extends CompleteNotificationData,
    InviteClaimedNotificationData {
  type: NotificationType.InviteClaimed;
  /**
   * User that has sent the invite.
   * This is going to be `undefined` if the user has deleted their profile in the meanwhile.
   */
  inviter: DesmosProfile | undefined;

  /**
   * User that has claimed the invite.
   * This is going to be `undefined` if the user has deleted their profile in the meanwhile.
   */
  claimer: DesmosProfile | undefined;
}

export interface CompleteInviteUnlockedNotification
  extends CompleteNotificationData,
    InviteUnlockedNotificationData {
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
