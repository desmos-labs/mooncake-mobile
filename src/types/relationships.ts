import { DesmosProfile } from 'types/desmos';
import { CacheableObject } from 'types/cache';

export interface FollowedUser extends CacheableObject {
  /**
   * Followed user
   */
  readonly user: DesmosProfile;
}

/**
 * Type that can be used to compare two followed users.
 */
export interface ComparableFollowedUser {
  address: string;
}

/**
 * Function that allows to check if two followed users are equal.
 */
export const areFollowedUsersEqual = (
  first: FollowedUser,
  second: ComparableFollowedUser,
): boolean => {
  return first.user.address === second.address;
};
