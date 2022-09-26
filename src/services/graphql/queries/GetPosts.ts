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
      author {
        address
      }
    }
    reactions_aggregate {
      aggregate {
        count
      }
    }
    text
    conversation {
      author {
        address
      }
    }
    repliesCount: referees_aggregate(
      where: {type: {_eq: "POST_REFERENCE_TYPE_REPLY"}}
    ) {
      aggregate {
        count
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
