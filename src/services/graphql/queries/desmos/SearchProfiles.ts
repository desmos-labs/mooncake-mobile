import { gql } from '@apollo/client';
import ProfileFields from './fragments/ProfilesFields';

const SearchProfiles = gql`
  ${ProfileFields}
  query SearchProfiles($search: String) @api(name: desmos) {
    profiles: profile(
      where: { _or: [{ dtag: { _ilike: $search } }, { nickname: { _ilike: $search } }] }
    ) {
      ...ProfileFields
    }
  }
`;

export default SearchProfiles;
