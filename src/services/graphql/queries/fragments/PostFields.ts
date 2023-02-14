import { gql } from '@apollo/client';
import ProfileFields from 'services/graphql/queries/fragments/ProfilesFields';

const PostFields = gql`
  ${ProfileFields}
  fragment PostFields on post {
    id
    subspace_id
    external_id
    conversation {
      id
    }
    text
    attachments {
      id
      content
      size {
        width
        height
      }
    }
    creation_date
    author {
      ...ProfileFields
    }
    transactions {
      hash
    }
  }
`;

export default PostFields;
