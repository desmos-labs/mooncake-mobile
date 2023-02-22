import { useApolloClient } from '@apollo/client';
import React from 'react';
import GetProfileForAddress from 'services/graphql/queries/GetProfileForAddress';
import { convertGraphQLProfile } from 'lib/GraphQLUtils';
import { err, ok, ResultAsync } from 'neverthrow';

/**
 * Hook that provides a function to fetch the profile
 * associated with an address.
 */
export const useGetOnChainProfile = () => {
  const apollo = useApolloClient();

  return React.useCallback(
    async (address: string) => {
      const result = await ResultAsync.fromPromise(
        apollo.query({
          query: GetProfileForAddress,
          variables: {
            address,
          },
        }),
        e => Error((e as Partial<Error> | undefined)?.message ?? 'Error fetching profile'),
      );
      if (result.isErr()) {
        return err(result.error);
      }
      const { profile } = result.value.data;
      const [firstProfile] = profile;
      return ok(convertGraphQLProfile(firstProfile));
    },
    [apollo],
  );
};
