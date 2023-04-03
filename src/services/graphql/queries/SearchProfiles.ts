import { gql } from '@apollo/client';
import ProfileFields from 'services/graphql/queries/fragments/ProfilesFields';

const SearchProfiles = gql`
  ${ProfileFields}
  query SearchProfiles($search: String, $offset: Int!, $limit: Int!) @api(name: desmos) {
    profiles: profile(
      where: { _or: [{ dtag: { _ilike: $search } }, { nickname: { _ilike: $search } }] }
      offset: $offset
      limit: $limit
    ) {
      ...ProfileFields
    }
  }
`;

export default SearchProfiles;
