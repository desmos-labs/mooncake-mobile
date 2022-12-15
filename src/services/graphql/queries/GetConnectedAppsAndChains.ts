import {gql} from '@apollo/client';

const GetConnectedAppsAndChains = gql`
  query GetChainLinkByAddress($address: String) @api(name: desmos) {
    chain_link(where: {user_address: {_eq: $address}}) {
      user_address
      external_address
      chain_config {
        name
      }
      creation_time
    }
    application_link(where: {user_address: {_eq: $address}}) {
      application
      creation_time
      username
      state
      result
    }
  }
`;

export default GetConnectedAppsAndChains;
