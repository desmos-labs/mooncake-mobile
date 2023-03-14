import { useLazyQuery } from '@apollo/client';
import React from 'react';
import GetProfileForAddress from 'services/graphql/queries/GetProfileForAddress';
import { convertGraphQLProfile } from 'lib/GraphQLUtils';
import { DesmosProfile } from 'types/desmos';

/**
 * Hook that provides a function to fetch the profile
 * associated with an address.
 */
const useGetOnChainProfile = () => {
  const [getProfile] = useLazyQuery(GetProfileForAddress, {
    fetchPolicy: 'cache-first',
  });

  return React.useCallback(
    async (address: string): Promise<DesmosProfile | undefined> => {
      const { data } = await getProfile({
        variables: { address },
      });
      if (!data) {
        return undefined;
      }

      const { profiles } = data;
      return profiles.length === 0 ? undefined : convertGraphQLProfile(profiles[0]);
    },
    [getProfile],
  );
};

export default useGetOnChainProfile;
