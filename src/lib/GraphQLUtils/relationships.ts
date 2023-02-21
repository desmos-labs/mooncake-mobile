import { FollowedUser } from 'types/relationships';
import { DataStatus } from 'types/cache';
import { convertGraphQLProfile } from 'lib/GraphQLUtils/profiles';

/**
 * Converts a GraphQL followed user into a FollowedUser.
 * @param data {any} - GraphQL followed user.
 */
// It's fine to disable the rule here as we might want to export more functions in the future.
// eslint-disable-next-line import/prefer-default-export
export const convertGraphQLFollowedUser = (data: any): FollowedUser => {
  return {
    user: convertGraphQLProfile(data.counterparty),
    status: DataStatus.SYNCED,
    lastEdited: new Date(Date.now()).toISOString(),
  } as FollowedUser;
};
