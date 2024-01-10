import { gql } from '@apollo/client';

/**
 * GraphQL query to retrieve creators' profiles.
 *
 * @param {string} $userAddress - The address of the user that will be filtered out.
 * @param {number} $offset - The offset for paginating through the results (default is 0).
 * @param {number} $limit - The limit for the number of profiles to retrieve (default is 20).
 *
 * @returns {{
 *   profile: any[];
 * }} - An object containing an array of profiles with fields specified in the ProfileFields fragment.
 *
 * @example
 * ```typescript
 * const variables = {
 *   userAddress: 'desmos1...',
 *   offset: 10,
 *   limit: 5,
 * };
 *
 * const result = await apolloClient.query({
 *   query: GetCreators,
 *   variables,
 * });
 *
 * // Access the data
 * const creators = result.data.profile;
 * console.log(creators);
 * ```
 */
const GetCreators = gql`
  query GetCreators($userAddress: String, $offset: Int = 0, $limit: Int = 20) @api(name: butter) {
    public_users(
      where: { address: { _neq: $userAddress } }
      limit: $limit
      offset: $offset
      order_by: { dtag: asc }
    ) {
      address
      bio
      dtag
      creation_time
      cover_picture: cover_pic
      nickname
      profile_picture: profile_pic
    }
  }
`;

export interface GetCreatorsGqlResponse {
  public_users: any[];
}

export default GetCreators;
