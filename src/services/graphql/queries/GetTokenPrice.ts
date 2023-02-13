import { gql } from '@apollo/client';

const GetTokenPrice = gql`
  query Balance($tokenName: String!) @api(name: forbole) {
    token_price(where: { unit_name: { _ilike: $tokenName } }) {
      price
    }
  }
`;

export default GetTokenPrice;
