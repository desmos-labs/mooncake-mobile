import { GQLImpactPoints } from 'services/graphql/queries/GetImpactPoints';

export function convertGQLImpactPoints(gqlImpactPoints: GQLImpactPoints): number {
  return gqlImpactPoints.impact_record_aggregate.aggregate.sum.rewarded_points;
}
