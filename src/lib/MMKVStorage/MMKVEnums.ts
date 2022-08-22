/**
 * For all MMKV related enums (except MMKVKeys)
 */

// eslint-disable-next-line import/prefer-default-export
export enum APP_AUTHORIZATIONS {
  POST = 'POST',
  LIKE = 'LIKE',
  FOLLOW_UNFOLLOW = 'FOLLOW_UNFOLLOW',
  REPORT = 'REPORT',
  TIP = 'TIP',
  // block and unblock are not part of MVP
  BLOCK_UNBLOCK = 'BLOCK_UNBLOCK',
}
