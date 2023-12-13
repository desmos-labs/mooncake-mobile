import { convertGraphQLProfile } from 'lib/GraphQLUtils/profiles';
import { GqlPostReaction, PostReaction } from 'types/desmos';

/**
 * Format an incoming reaction data from the server into a format that is easier to parse by the app.
 * @returns {PostReaction} - A formatted PostReaction object
 * @param reaction - The reaction to format
 */
// It's fine to ignore the default export warning here since we might add more functions in the future
// eslint-disable-next-line import/prefer-default-export
export const convertGraphQLReaction = (reaction: GqlPostReaction): PostReaction => {
  return {
    author: convertGraphQLProfile(reaction.author),
  };
};
