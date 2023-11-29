import { gql } from '@apollo/client';

/**
 * Query to get a list of bondscape users profiles
 *  that have their dtag or nickname that contains the provided text.
 *
 * Example:
 * constants { data } = useQuery(GetBondscapeUserMatchingDtagOrNickname, {
 *   variables: {
 *     likeSearch: 'desmos',
 *     limit: 20,
 *     offset: 0,
 *   },
 * });
 */
const GetBondscapeUserMatchingDtagOrNickname = gql`
  query GetProfilesMatchingDtagOrNickname($likeSearch: String!, $limit: Int = 20, $offset: Int = 0)
  @api(name: bondscape) {
    profile: public_users(
      where: { _or: [{ dtag: { _ilike: $likeSearch } }, { nickname: { _ilike: $likeSearch } }] }
      order_by: { nickname: asc }
      limit: $limit
      offset: $offset
    ) {
      address
      bio
      dTag: dtag
      coverPicture: cover_pic
      nickname
      profilePicture: profile_pic
    }
  }
`;

export default GetBondscapeUserMatchingDtagOrNickname;
