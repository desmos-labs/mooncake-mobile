import {gql} from '@apollo/client';
import {POST_FIELDS} from '../fragments';

const GetPosts = gql`
  ${POST_FIELDS}
  query GetPostsBetweenDates($offset: Int, $limit: Int, $subspaceID: bigint)
  @api(name: desmos) {
    post(
      offset: $offset
      limit: $limit
      order_by: {creation_date: desc}
      where: {subspace_id: {_eq: $subspaceID}, _not: {conversation: {}}}
    ) {
      ...PostFields
    }
  }
`;

export default GetPosts;
