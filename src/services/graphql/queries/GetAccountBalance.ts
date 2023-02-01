import {gql} from '@apollo/client';

const GetAccountBalance = gql`
  query Balance($address: String!) @api(name: forbole) {
    action_account_balance(address: $address) {
      coins
    }
  }
`;

export default GetAccountBalance;
