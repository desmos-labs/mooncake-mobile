import {gql} from '@apollo/client';
import {POST_FIELDS} from 'services/graphql/queries/GetPosts';

const GetPostsFromFollowing = gql`
  ${POST_FIELDS}
  query GetPostsBetweenDates(
    $offset: Int
    $limit: Int
    $subspaceID: bigint
    $following: [String!]
  ) @api(name: desmos) {
    post(
      offset: $offset
      limit: $limit
      order_by: {creation_date: desc}
      where: {
        subspace_id: {_eq: $subspaceID}
        _not: {conversation: {}}
        author_address: {_in: $following}
      }
    ) {
      ...PostFields
    }
  }
`;

export default GetPostsFromFollowing;
