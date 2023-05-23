import { DesmosProfile } from 'types/desmos';
import { CacheableObject } from 'types/cache';

export interface BlockedUser extends CacheableObject {
  /**
   * Blocked user
   */
  readonly user: DesmosProfile;
}

/**
 * Type that can be used to compare two blocked users.
 */
export interface ComparableBlockedUser {
  address: string;
}

/**
 * Function that allows to check if two complete followed users are equal.
 */
export const areBlockedUsersEqual = (first: BlockedUser, second: BlockedUser): boolean => {
  return first.user.address === second.user.address;
};

/**
 * Function that allows to check if two followed users are equal.
 */
export const areBlockedUsersComparable = (
  first: BlockedUser,
  second: ComparableBlockedUser,
): boolean => {
  return first.user.address === second.address;
};
