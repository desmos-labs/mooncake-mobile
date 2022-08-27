import {gql} from '@apollo/client';

export const POST_FIELDS = gql`
  fragment PostFields on post {
    id
    creation_date
    author_address
    attachments {
      id
      content
    }
    author {
      address
      bio
      dtag
      profile_pic
      nickname
    }
    subspace_id
    reactions {
      id
      value
    }
    reactions_aggregate {
      aggregate {
        count
      }
    }
    references {
      type
      reference_id
    }
    text
    conversation {
      author {
        address
      }
    }
  }
`;

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
