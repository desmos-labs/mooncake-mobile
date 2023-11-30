import { gql } from '@apollo/client';
import ProfileFields from './fragments/ProfilesFields';

const SearchProfilesCount = gql`
  ${ProfileFields}
  query SearchProfilesCount($search: String) @api(name: desmos) {
    profilesCount: profile_aggregate(
      where: { _or: [{ dtag: { _ilike: $search } }, { nickname: { _ilike: $search } }] }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export default SearchProfilesCount;
