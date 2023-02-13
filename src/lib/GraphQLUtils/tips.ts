import { Tip, TipTargetType } from 'types/tips';
import { convertGraphQLPost } from 'lib/GraphQLUtils/posts';
import { convertGraphQLProfile } from 'lib/GraphQLUtils/profiles';
import { DataStatus } from 'types/cache';

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
