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

export interface GqlButterConfig {
  desmos_address: string;
  ibc: {
    port: string;
    channel: string;
  };
  invites: {
    required_impact_points: number[];
  };
}

export interface GqlButterConfigData {
  config: GqlButterConfig;
}

export default GetButterConfig;
