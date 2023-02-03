import { PostsParams } from 'types/desmos';

/**
 * Format an incoming posts params data from the server into a format that is easier to parse by the app.
 * @param {any} params - Desmos posts params fetched from the server.
 * @returns {PostsParams} - A formatted PostsParams object
 */
export const convertGraphQLPostsParams = (params: any) =>
  ({
    maxTextLength: params.max_text_length,
  } as PostsParams);
