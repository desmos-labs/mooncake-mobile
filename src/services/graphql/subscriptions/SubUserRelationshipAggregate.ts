import {gql} from '@apollo/client';

const SubUserRelationshipAggregate = gql`
  subscription SubUserRelationshipAggregate($address: String!)
  @api(name: desmos) {
    user_relationship_aggregate(where: {creator: {address: {_eq: $address}}}) {
      aggregate {
        count
      }
    }
  }
`;

export default SubUserRelationshipAggregate;
