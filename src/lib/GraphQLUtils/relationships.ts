import { FollowedUser } from 'types/relationships';
import { DataStatus } from 'types/cache';
import { convertGraphQLProfile } from 'lib/GraphQLUtils/profiles';
import { BlockedUser } from 'types/blockedRelationships';
import { DesmosProfile } from 'types/desmos';

/**
 * Converts a GraphQL followed user into a FollowedUser.
 * @param data {any} - GraphQL followed user.
 */
// It's fine to disable the rule here as we might want to export more functions in the future.
export const convertGraphQLFollowedUser = (data: any): FollowedUser => {
  return {
    user: convertGraphQLProfile(data.counterparty),
    status: DataStatus.SYNCED,
    lastEdited: new Date(Date.now()).toISOString(),
  } as FollowedUser;
};

/**
 * Converts a GraphQL followed user into a BlockedUser.
 * @param data {any} - GraphQL blocked user.
 *
 * [Kevin]: this is a break from the pattern of separating blocked relationships with "followed"
 * relationships, but I feel like these helper functions can be grouped together like so.
 */
export const convertGraphQLBlockedUser = (data: {
  blocked: DesmosProfile;
  blocker: DesmosProfile;
  reason: string;
}): BlockedUser => {
  return {
    user: convertGraphQLProfile(data.blocked),
    status: DataStatus.SYNCED,
    lastEdited: new Date(Date.now()).toISOString(),
  } as BlockedUser;
};
