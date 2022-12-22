import {gql} from '@apollo/client';

const SubUserRelationshipAggregate = gql`
  subscription SubUserRelationshipAggregate($address: String!) {
    user_relationship_aggregate(where: {creator: {address: {_eq: $address}}}) {
      aggregate {
        count
      }
    }
  }
`;

export default SubUserRelationshipAggregate;
