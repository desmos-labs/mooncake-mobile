import {gql} from '@apollo/client';

const POST_FIELDS = gql`
  fragment PostFields on post {
    id
    creation_date
    author_address
    attachments {
      id
      content
      size {
        width
        height
      }
    }
    external_id
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
    tips {
      amount
    }
    text
    conversation {
      id
      author {
        address
      }
      conversation {
        id
      }
    }
    transactions {
      hash
    }
    replies: references(where: {type: {_eq: "POST_REFERENCE_TYPE_REPLY"}}) {
      type
      post {
        id
      }
      reference {
        id
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

export default POST_FIELDS;
