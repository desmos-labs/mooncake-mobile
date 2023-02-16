import { PostReaction } from 'types/desmos';
import { convertGraphQLProfile } from 'lib/GraphQLUtils/profiles';
import { DataStatus } from 'types/cache';
import { convertGraphQLPost } from 'lib/GraphQLUtils/posts';

/**
 * Format an incoming reaction data from the server into a format that is easier to parse by the app.
 * @param {any} reaction - Post reaction data fetched from the server.
 * @returns {PostReaction} - A formatted PostReaction object
 */
// It's fine to ignore the default export warning here since we might add more functions in the future
// eslint-disable-next-line import/prefer-default-export
export const convertGraphQLReaction = (reaction: any): PostReaction => {
  return {
    post: convertGraphQLPost(reaction.post),
    id: reaction.id,
    author: convertGraphQLProfile(reaction.author),
    status: DataStatus.SYNCED,
    lastEdited: new Date(Date.now()).toISOString(),
  };
};
