import { gql } from '@apollo/client';
import ProfileFields from 'services/graphql/queries/fragments/ProfilesFields';

const GetProfileForDTag = gql`
  ${ProfileFields}
  query GetProfileForDTag($dTag: String) @api(name: desmos) {
    profile(where: { dtag: { _ilike: $dTag } }) {
      ...ProfileFields
    }
  }
`;

export default GetProfileForDTag;
