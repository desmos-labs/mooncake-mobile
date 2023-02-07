import { PostsParams } from 'types/desmos';

/**
 * Format an incoming posts params data from the server into a format that is easier to parse by the app.
 * @param {any} params - Desmos posts params fetched from the server.
 * @returns {PostsParams} - A formatted PostsParams object
 */
// It is fine to disable the default export warning here since we might add other functions in the future
// eslint-disable-next-line import/prefer-default-export
export const convertGraphQLPostsParams = (params: any) =>
  ({
    maxTextLength: params.max_text_length,
  } as PostsParams);
