import { gql } from '@apollo/client';
import ProfileFields from './fragments/ProfilesFields';

/**
 * GraphQL query to retrieve creators' profiles.
 *
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
  ${ProfileFields}
  query GetCreators($offset: Int = 0, $limit: Int = 20) @api(name: butter) {
    profile(limit: $limit, offset: $offset, order_by: { dtag: asc }) {
      ...ProfileFields
    }
  }
`;

export interface GetCreatorsGqlResponse {
  profile: any[];
}

export default GetCreators;
