import { gql } from '@apollo/client';
import ProfileFields from 'services/graphql/queries/fragments/ProfilesFields';

const ReactionFields = gql`
  ${ProfileFields}
  fragment ReactionFields on reaction {
    id
    post {
      subspace_id
      id
    }
    value
    author {
      ...ProfileFields
    }
  }
`;

export default ReactionFields;
