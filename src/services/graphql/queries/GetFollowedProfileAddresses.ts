import { gql } from '@apollo/client';

/**
 * GraphQL query to retrieve the profile addresses of users followed by a given user.
 *
 * @param {bigint} $subspaceId - The ID of the subspace.
 * @param {string} $userAddress - The address of the user.
 * @param {string[]} $couterpartyAddresses - An array of addresses of users to check for relationships.
 *
 * @returns {{
 *   relationships: {
 *     counterpartyAddress: string;
 *   }[];
 * }} - An object containing an array of relationships with the counterparty address.
 *
 * @example
 * ```typescript
 * const variables = {
 *   subspaceId: 123,
 *   userAddress: 'desmos1....',
 *   couterparty_addresses: ['desmos1...', 'desmos1...'],
 * };
 *
 * const result = await apolloClient.query({
 *   query: GetFollowedProfileAddresses,
 *   variables,
 * });
 *
 * // Access the data
 * const followedProfileAddresses = result.data.relationships.map((relationship) => relationship.counterpartyAddress);
 * console.log(followedProfileAddresses);
 * ```
 */
const GetFollowedProfileAddresses = gql`
  query GetFollowedProfileAddresses(
    $subspaceId: bigint!
    $userAddress: String!
    $couterpartyAdresses: [String!]
  ) @api(name: desmos) {
    relationships: user_relationship(
      where: {
        subspace_id: { _eq: $subspaceId }
        creator_address: { _eq: $userAddress }
        counterparty_address: { _in: $couterpartyAdresses }
      }
    ) {
      counterpartyAddress: counterparty_address
    }
  }
`;

export interface GetFollowedProfileAddressesGqlResponse {
  relationships: {
    counterpartyAddress: string;
  }[];
}

export default GetFollowedProfileAddresses;
