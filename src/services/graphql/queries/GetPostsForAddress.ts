import {gql} from '@apollo/client';
import {PROFILE_SUMMARY_FIELDS} from '../fragments';

const GetPostsForAddress = gql`
  ${PROFILE_SUMMARY_FIELDS}
  query GetPostsForAddress($address: String) @api(name: desmos) {
    post(
      order_by: {creation_date: desc}
      where: {author_address: {_eq: $address}}
    ) {
      id
      creation_date
      author_address
      attachments {
        id
        content
      }
      author {
        ...ProfileSummaryFields
        bio
      }
      subspace_id
      reactions {
        id
        value
      }
      text
      conversation {
        author {
          address
        }
      }
    }
  }
`;

export default GetPostsForAddress;
