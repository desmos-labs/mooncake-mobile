import { gql } from '@apollo/client';
import ProfileFields from 'services/graphql/queries/fragments/ProfilesFields';
import PostFields from 'services/graphql/queries/fragments/PostFields';

const GetPostTips = gql`
  ${ProfileFields}
  ${PostFields}
  query GetPostTips($postId: bigint, $subspaceId: bigint, $offset: Int, $limit: Int)
  @api(name: butter) {
    tips: tip_post(
      where: { post: { subspace_id: { _eq: $subspaceId }, id: { _eq: $postId } } }
      offset: $offset
      limit: $limit
    ) {
      sender {
        ...ProfileFields
      }
      post {
        ...PostFields
      }
      amount
    }
  }
`;

export default GetPostTips;
