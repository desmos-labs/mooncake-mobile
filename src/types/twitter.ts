export interface TwitterUser {
  readonly username: string;
  readonly profileImageUrl: string;
  readonly name: string;
}

export interface TweetAttachment {
  readonly id: string;
  readonly url: string;
}

export interface TwitterTweet {
  readonly id: string;
  readonly text: string;
  readonly attachments: TweetAttachment[];
  readonly createdAt: string;
}
