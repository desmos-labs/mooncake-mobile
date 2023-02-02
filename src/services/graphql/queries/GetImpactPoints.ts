import { gql } from '@apollo/client';

const GetImpactPoints = gql`
  query ImpactPointsCount @api(name: butter) {
    impact_record_aggregate {
      aggregate {
        sum {
          rewarded_points
        }
      }
    }
  }
`;

export default GetImpactPoints;
