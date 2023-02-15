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

export interface GQLImpactPoints {
  impact_record_aggregate: {
    aggregate: {
      sum: {
        rewarded_points: number;
      };
    };
  };
}

export default GetImpactPoints;
