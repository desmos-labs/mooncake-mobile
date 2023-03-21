import { gql } from '@apollo/client';
import ProfileFields from 'services/graphql/queries/fragments/ProfilesFields';

const RelationshipFields = gql`
  ${ProfileFields}
  fragment RelationshipFields on user_relationship {
    subspace_id
    creator {
      ...ProfileFields
    }
    counterparty {
      ...ProfileFields
    }
  }
`;

export default RelationshipFields;
