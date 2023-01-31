/**
 * Every notification type, more to be added if needed
 */
enum NotificationTypesEnum {
  Comment = 'comment',
  Reply = 'reply',
  Mention = 'mention',
  Quote = 'quote',
  Follow = 'follow',
  Reaction_Post = 'reaction_post',
  Reaction_Comment = 'reaction_comment',
  Reaction_Reply = 'reaction_reply',
  InviteClaimed = 'invite_claimed',
  InviteUnlocked = 'invite_unlocked',
}

export default NotificationTypesEnum;
