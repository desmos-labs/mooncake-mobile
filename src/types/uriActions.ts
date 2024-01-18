/**
 * This file contains the types used to represent a parsed uri that have the following syntax:
 * mooncake://<context>?params.
 */

/**
 * Supported contexts.
 */
export enum UriContexts {
  /**
   * Action related to the events.
   */
  Posts = 'posts',
  /**
   * Action related to a general context
   */
  General = '',
}

/**
 * Supported actions.
 */
export enum UriActions {
  Show = 'show',
}

/**
 * Actions that represents a request to see a post.
 */
export interface ShowPostActionUri {
  readonly context: UriContexts.Posts;
  readonly action: UriActions.Show;
  readonly postId: string;
}

/**
 * Type union that represents all the action related to an event.
 */
export type PostsActionUri = ShowPostActionUri;

/**
 * Action representing a generic operation
 * where the user will be prompted to see another user's profile
 */
export interface GeneralActionUri {
  readonly context: UriContexts.General;
  readonly userAddress: string;
}

/**
 * Type union that group all the action that the application can
 * perform from an uri.
 */
export type UriAction = PostsActionUri | GeneralActionUri;
