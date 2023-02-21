import { TweetAttachment, TwitterTweet, TwitterUser } from 'types/twitter';

/**
 * Convert GraphQL user to Twitter user
 * @param data {any} Data from GraphQL.
 */
const convertGraphQLTwitterUser = (data: any): TwitterUser => {
  return {
    username: data.username,
    profileImageUrl: data.profile_pic,
    name: data.name,
  } as TwitterUser;
};

/**
 * Convert GraphQL tweet attachment to Twitter tweet attachment
 * @param data {any} Data from GraphQL.
 */
const convertGraphQLTweetAttachment = (data: any): TweetAttachment => {
  return {
    id: data.id,
    url: data.url,
  } as TweetAttachment;
};

/**
 * Convert GraphQL tweet to Twitter tweet
 * @param data {any} Data from GraphQL.
 */
const convertGraphQLTweet = (data: any): TwitterTweet => {
  return {
    id: data.id,
    text: data.text,
    attachments: (data.attachments ?? []).map(convertGraphQLTweetAttachment),
    createdAt: data.creation_date,
  } as TwitterTweet;
};

export interface GraphQLTwitterData {
  readonly user: TwitterUser;
  readonly tweets: TwitterTweet[];
}

/**
 * Convert GraphQL data to Twitter data
 * @param data {any} Data from GraphQL.
 */
export const convertGraphQLTwitterData = (data: any): GraphQLTwitterData | undefined => {
  if (!data) return undefined;
  return {
    user: convertGraphQLTwitterUser(data.user),
    tweets: data.tweets.map(convertGraphQLTweet),
  };
};
