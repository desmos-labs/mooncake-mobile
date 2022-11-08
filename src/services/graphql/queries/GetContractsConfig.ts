import {gql} from '@apollo/client';

const GetContractsConfig = gql`
  query ContractsConfig @api(name: desmos) {
    contract(where: {type: {_ilike: "tips"}, config: {_contains: $config}}) {
      address
      config
      type
    }
  }
`;

export default GetContractsConfig;
