import {gql} from '@apollo/client';
import {POST_FIELDS} from 'services/graphql/queries/GetPosts';

const GetPostsForAddress = gql`
  ${POST_FIELDS}
  query GetPostsForAddress($address: String) @api(name: desmos) {
    post(
      order_by: {creation_date: desc}
      where: {author_address: {_eq: $address}, _not: {conversation: {}}}
    ) {
      ...PostFields
    }
  }
`;

export default GetPostsForAddress;
