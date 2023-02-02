import { gql } from '@apollo/client';

const GetButterConfig = gql`
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

export default GetButterConfig;
