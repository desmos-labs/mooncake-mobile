import { gql } from '@apollo/client';

const GetAccountImpactPoints = gql`
  query GetAccountImpactPoints @api(name: butter) {
    points: impact_record_aggregate {
      aggregate {
        sum {
          value: rewarded_points
        }
      }
    }
  }
`;

export default GetAccountImpactPoints;
