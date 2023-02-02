import { APP_AUTHORIZATIONS } from 'lib/MMKVStorage/MMKVEnums';

export {};

declare global {
  /**
   * Typings for the App Authorizations that are stored on device
   */
  type AppAuthorizationType = {
    [key in APP_AUTHORIZATIONS]?: boolean;
  };
}
