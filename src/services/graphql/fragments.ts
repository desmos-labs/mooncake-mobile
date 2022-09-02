import {gql} from '@apollo/client';

export const PROFILE_SUMMARY_FIELDS = gql`
  fragment ProfileSummaryFields on profile {
    address
    dtag
    profile_pic
    nickname
  }
`;

export const POST_FIELDS = gql`
  ${PROFILE_SUMMARY_FIELDS}
  fragment PostFields on post {
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
  }
`;
