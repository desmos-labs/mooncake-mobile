import { FollowedUser } from 'types/relationships';
import { DataStatus } from 'types/cache';
import { convertGraphQLProfile } from 'lib/GraphQLUtils/profiles';

/**
 * Converts a GraphQL followed user into a FollowedUser.
 * @param data {any} - GraphQL followed user.
 */
export const convertGraphQLFollowedUser = (data: any): FollowedUser => {
  return {
    user: convertGraphQLProfile(data.counterparty),
    status: DataStatus.SYNCED,
    lastEdited: new Date(Date.now()).toISOString(),
  } as FollowedUser;
};

/**
 * Converts a GraphQL follower user into a FollowedUser.
 * @param data {any} - GraphQL followed user.
 */
export const convertGraphQLFollower = (data: any): FollowedUser => {
  return {
    user: convertGraphQLProfile(data.creator),
    status: DataStatus.SYNCED,
    lastEdited: new Date(Date.now()).toISOString(),
  } as FollowedUser;
};
