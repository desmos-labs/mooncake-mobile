import {gql} from '@apollo/client';

const GetContractsConfig = gql`
  query ContractsConfig @api(name: desmos) {
    contract {
      config
      address
      type
    }
  }
`;

export default GetContractsConfig;
