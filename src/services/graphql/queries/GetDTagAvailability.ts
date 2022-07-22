import {gql} from '@apollo/client';

const GetDTagAvailability = gql`
  query DTagAvailability($dTag: String) @api(name: desmos) {
    profile(where: {dtag: {_ilike: $dTag}}) {
      dtag
    }
  }
`;

export default GetDTagAvailability;
