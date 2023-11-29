import { gql } from '@apollo/client';

const GetProfileParams = gql`
  query GetProfileParams @api(name: desmos) {
    params: profiles_params {
      params
    }
  }
`;

export default GetProfileParams;
