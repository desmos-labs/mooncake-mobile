import { gql } from '@apollo/client';
import ProfileFields from 'services/graphql/queries/fragments/ProfilesFields';
import PostFields from 'services/graphql/queries/fragments/PostFields';

const ReactionFields = gql`
  ${ProfileFields}
  ${PostFields}
  fragment ReactionFields on reaction {
    id
    post {
      ...PostFields
    }
    value
    author {
      ...ProfileFields
    }
  }
`;

export default ReactionFields;
