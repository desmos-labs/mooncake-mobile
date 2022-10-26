import {gql} from '@apollo/client';

const GetContractsConfig = gql`
  query ContractsConfig @api(name: desmos) {
    contract {
      address
      type
    }
  }
`;

export default GetContractsConfig;
