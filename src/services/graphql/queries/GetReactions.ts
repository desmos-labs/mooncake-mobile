import {gql} from '@apollo/client';
import {PROFILE_SUMMARY_FIELDS} from '../fragments';

const GetPostReactions = gql`
  ${PROFILE_SUMMARY_FIELDS}
  query PostReactions(
    $subspaceID: bigint!
    $postID: bigint!
    $limit: Int!
    $offset: Int!
  ) @api(name: desmos) {
    reaction(
      where: {post: {subspace_id: {_eq: $subspaceID}, id: {_eq: $postID}}}
      limit: $limit
      offset: $offset
    ) {
      id
      value
      author {
        ...ProfileSummaryFields
      }
    }
  }
`;

export default GetPostReactions;
