/**
 * Type of notifications supported by the application.
 */
export enum NotificationType {
  /**
   * Received when the transaction related to a post
   * creation has been sucessfully included inside a block.
   */
  PostCreated = 'post_saved',
  /**
   * Received when the post created from the user has been reposted
   * by another user.
   */
  PostRepost = 'post_repost',
  /**
   * Received when the post created from the user has been quoted
   * by another user.
   */
  PostQuote = 'post_quote',
  /**
   * Received when the post created from the user has been commented
   * by another user.
   */
  PostComment = 'post_comment',
  /**
   * Received when the post created from the user has been replied
   * by another user.
   */
  PostReply = 'post_reply',
  /**
   * Received when a user mentions another user in a post,
   * the mentioned user will receive a notification.
   */
  PostMention = 'post_mention',
  /**
   * Received when another user likes the user's post.
   */
  PostLike = 'post_like',
}

interface BaseNotificationData {
  readonly type: NotificationType;
  readonly notification_id: string;
  /**
   * Title of the notification.
   */
  readonly title: string;
  /**
   * Body of the notification.
   */
  readonly body: string;
}

// ---------------------------------------------------------------------
// --- Post related notifications
// ---------------------------------------------------------------------

export interface PostCreatedNotificationData extends BaseNotificationData {
  readonly type: NotificationType.PostCreated;
}

export interface PostRepostNotificationData extends BaseNotificationData {
  readonly type: NotificationType.PostRepost;
  /**
   * ID of the original post that has been reposted.
   */
  readonly post_id: number;

  /**
   * ID of the post representing the repost.
   */
  readonly repost_id: number;

  /**
   * Address of the user that has reposted the post.
   */
  readonly repost_author_address: string;
}

export interface PostQuoteNotificationData extends BaseNotificationData {
  readonly type: NotificationType.PostQuote;
  /**
   * ID of the original post that has been quoted.
   */
  readonly post_id: number;

  /**
   * ID of the post representing the quote.
   */
  readonly quote_id: number;

  /**
   * Address of the user that has quoted the post.
   */
  readonly quote_author_address: string;
}

export interface PostCommentNotificationData extends BaseNotificationData {
  readonly type: NotificationType.PostComment;
  /**
   * ID of the original post that has been commented.
   */
  readonly post_id: number;

  /**
   * ID of the post representing the comment.
   */
  readonly comment_id: number;

  /**
   * Address of the user that has commented the post.
   */
  readonly comment_author_address: string;
}

export interface PostReplyNotificationData extends BaseNotificationData {
  readonly type: NotificationType.PostReply;
  /**
   * ID of the original post that has been replied to.
   */
  readonly post_id: number;

  /**
   * ID of the post representing the reply.
   */
  readonly reply_id: number;

  /**
   * Address of the user that has replied to the post.
   */
  readonly reply_author_address: string;
}

export interface PostMentionNotificationData extends BaseNotificationData {
  readonly type: NotificationType.PostMention;
  /**
   * ID of the post that contains the mention.
   */
  readonly mention_id: number;

  /**
   * Address of the user that has mentioned the user.
   */
  readonly mention_author_address: string;
}

export interface PostLikeNotificationData extends BaseNotificationData {
  readonly type: NotificationType.PostLike;
  /**
   * ID of the original post that has been liked.
   */
  readonly post_id: number;

  /**
   * Address of the user that has liked the post.
   */
  readonly post_liker_address: string;
}

export type NotificationData =
  | PostCreatedNotificationData
  | PostRepostNotificationData
  | PostQuoteNotificationData
  | PostCommentNotificationData
  | PostReplyNotificationData
  | PostMentionNotificationData
  | PostLikeNotificationData;
