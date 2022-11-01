import {gql} from '@apollo/client';

const GetContractsConfig = gql`
  query ContractsConfig @api(name: desmos) {
    contract {
      address
      config
      type
    }
  }
`;

export default GetContractsConfig;
