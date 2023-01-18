/**
 * Every notification type, more to be added if needed
 */
enum NotificationTypesEnum {
  Comment = 'comment',
  Reply = 'reply',
  Mention = 'mention',
  Quote = 'quote',
  Follow = 'follow',
  Reaction = 'reaction',
  InviteClaimed = 'invite_claimed',
  InviteUnlocked = 'invite_unlocked',
}

export default NotificationTypesEnum;
