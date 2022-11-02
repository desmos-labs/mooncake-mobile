import {gql} from '@apollo/client';

const GetDTagAvailability = gql`
  query DTagAvailability($dTag: String) @api(name: desmos) {
    profile(where: {dtag: {_islike: $dTag}}) {
      dtag
    }
  }
`;

export default GetDTagAvailability;
