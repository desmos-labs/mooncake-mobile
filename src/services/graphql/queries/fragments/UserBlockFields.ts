import { gql } from '@apollo/client';
import ProfileFields from 'services/graphql/queries/fragments/ProfilesFields';

const UserBlockFields = gql`
  ${ProfileFields}
  fragment UserBlockFields on user_block {
    blocked {
      ...ProfileFields
    }
    blocker {
      ...ProfileFields
    }
    reason
  }
`;

export default UserBlockFields;
