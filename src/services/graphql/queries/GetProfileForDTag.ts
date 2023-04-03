import { gql } from '@apollo/client';
import ProfileFields from 'services/graphql/queries/fragments/ProfilesFields';

const GetProfileForDTag = gql`
  ${ProfileFields}
  query GetProfileForDTag($dTag: String, $offset: Int!, $limit: Int!) @api(name: desmos) {
    profile(where: { dtag: { _ilike: $dTag } }, offset: $offset, limit: $limit) {
      ...ProfileFields
    }
  }
`;

export default GetProfileForDTag;
