import { gql } from '@apollo/client';

const GetProfileForDTag = gql`
  query DTagAvailability($dTag: String) @api(name: desmos) {
    profile(where: { dtag: { _ilike: $dTag } }) {
      dtag
    }
  }
`;

export default GetProfileForDTag;
