import { gql } from '@apollo/client';

const GetAccountBalance = gql`
  query GetAccountBalance($address: String!) @api(name: forbole) {
    balance: action_account_balance(address: $address) {
      coins
    }
  }
`;

export default GetAccountBalance;
