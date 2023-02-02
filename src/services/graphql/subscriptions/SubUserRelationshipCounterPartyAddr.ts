import { gql } from '@apollo/client';

const SubUserRelationshipCounterPartyAddr = gql`
  subscription SubUserRelationshipCounterPartyAddr($address: String!) @api(name: butter) {
    user_relationship(where: { creator_address: { _eq: $address } }) {
      counterparty_address
    }
  }
`;

export default SubUserRelationshipCounterPartyAddr;
