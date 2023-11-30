import { gql } from '@apollo/client';

const GetButterConfig = gql`
  query GetButterConfig @api(name: butter) {
    config {
      desmos_address
      ibc {
        port
        channel
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
}

export interface GqlButterConfigData {
  config: GqlButterConfig;
}

export default GetButterConfig;
