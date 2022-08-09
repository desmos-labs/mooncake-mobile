export {};

declare global {
  enum APP_AUTHORIZATIONS {
    POST,
    LIKE,
    FOLLOW,
    UNFOLLOW,
    REPORT,
    TIP,
    // block and unblock are not part of MVP
    BLOCK,
    UNBLOCK,
  }

  /**
   * Typings for the App Authorizations that are stored on device
   */
  type MMKVAppAuthorization = {
    [index: string]: {
      [key in APP_AUTHORIZATIONS]?: boolean;
    };
  };
}
