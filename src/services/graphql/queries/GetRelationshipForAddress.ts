import { gql } from '@apollo/client';

const GetRelationshipForAddress = gql`
  query GetRelationshipForAddress($userAddress: String!, $counterpartyAddress: String!) {
    relationships: user_relationship(
      where: {
        creator_address: { _eq: $userAddress }
        counterparty_address: { _eq: $counterpartyAddress }
      }
    ) {
      creator_address
    }
  }
`;

export default GetRelationshipForAddress;
