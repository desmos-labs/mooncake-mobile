import {gql} from '@apollo/client';

const GetContractsConfig = gql`
  query Contracts($config: jsonb!) @api(name: desmos) {
    contract(where: {type: {_ilike: "tips"}, config: {_contains: $config}}) {
      address
      type
      config
    }
  }
`;

export default GetContractsConfig;
