import {gql} from '@apollo/client';

const GetConfig = gql`
  query Config @api(name: butter) {
    config {
      desmos_address
      ibc {
        port
        channel
      }
    }
  }
`;

export default GetConfig;
