import { Tip, TipTargetType } from 'types/tips';
import { convertGraphQLPost } from 'lib/GraphQLUtils/posts';
import { convertGraphQLProfile } from 'lib/GraphQLUtils/profiles';
import { DataStatus } from 'types/cache';

/**
 * Format an incoming tip data from the server into a format that is easier to parse by the app.
 * @param data - Tip data fetched from the server.
 */
// It's fine to ignore the default export warning here since we might add more functions in the future
// eslint-disable-next-line import/prefer-default-export
export const convertGraphQLPostTip = (data: any): Tip => {
  return {
    amount: data.tip,
    target: {
      type: TipTargetType.POST,
      post: convertGraphQLPost(data.post),
    },
    sender: convertGraphQLProfile(data.sender),
    lastEdited: new Date(Date.now()).toISOString(),
    creationDate: new Date(Date.now()).toISOString(),
    status: DataStatus.SYNCED,
  };
};
