import {gql} from '@apollo/client';

const SubUserRelationshipCounterPartyAddr = gql`
  subscription SubUserRelationshipCounterPartyAddr($address: String!)
  @api(name: desmos) {
    user_relationship(where: {creator: {address: {_eq: $address}}}) {
      counterparty_address
    }
  }
`;

export default SubUserRelationshipCounterPartyAddr;
