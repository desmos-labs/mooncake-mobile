import {gql} from '@apollo/client';

const GetProfileParams = gql`
  query ProfileParams @api(name: desmos) {
    profiles_params {
      params
    }
  }
`;

export default GetProfileParams;
