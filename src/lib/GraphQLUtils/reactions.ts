import { PostReaction } from 'types/desmos';
import { convertGraphQLProfile } from 'lib/GraphQLUtils/profiles';

/**
 * Format an incoming reaction data from the server into a format that is easier to parse by the app.
 * @param {any} reaction - Post reaction data fetched from the server.
 * @returns {PostReaction} - A formatted PostReaction object
 */
// It's fine to ignore the default export warning here since we might add more functions in the future
// eslint-disable-next-line import/prefer-default-export
export const convertGraphQLReaction = (reaction: any): PostReaction => {
  return {
    author: convertGraphQLProfile(reaction.author),
  };
};
