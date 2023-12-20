import { gql } from '@apollo/client';
import ProfileFields from './fragments/ProfilesFields';

const GetCreators = gql`
  ${ProfileFields}
  query GetCreators($offset: Int = 0, $limit: Int = 20) @api(name: butter) {
    profile(limit: $limit, offset: $offset, order_by: { dtag: asc }) {
      ...ProfileFields
    }
  }
`;

export default GetCreators;
