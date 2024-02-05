import useCustomLazyQuery from 'hooks/graphql/useCustomLazyQuery';
import { convertGraphQLProfile } from 'lib/GraphQLUtils';
import React from 'react';
import GetProfileDataForAddress from 'services/graphql/queries/GetProfileDataForAddress';
import { DesmosProfile } from 'types/desmos';

/**
 * Hook that provides a function to fetch the profile
 * associated with an address.
 */
const useGetOnChainProfile = () => {
  const [getLazyData] = useCustomLazyQuery(GetProfileDataForAddress, {
    fetchPolicy: 'cache-first',
  });

  return React.useCallback(
    async (address: string): Promise<DesmosProfile | undefined> => {
      const data = await getLazyData({
        variables: { address },
      });

      return data?.profiles?.length > 0 ? convertGraphQLProfile(data.profiles[0]) : undefined;
    },
    [getLazyData],
  );
};

export default useGetOnChainProfile;
