import React from 'react';
import GetProfileForAddress from 'services/graphql/queries/GetProfileForAddress';
import { convertGraphQLProfile } from 'lib/GraphQLUtils';
import { DesmosProfile } from 'types/desmos';
import useCustomLazyQuery from 'hooks/graphql/useCustomLazyQuery';

/**
 * Hook that provides a function to fetch the profile
 * associated with an address.
 */
const useGetOnChainProfile = () => {
  const [getLazyData] = useCustomLazyQuery(GetProfileForAddress);

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
