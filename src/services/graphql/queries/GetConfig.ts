import {gql} from '@apollo/client';

const GetConfig = gql`
  query Config @api(name: butter) {
    config {
      desmos_address
      ibc {
        port
        channel
      }
      invites {
        required_impact_points
      }
    }
  }
`;

export default GetConfig;
