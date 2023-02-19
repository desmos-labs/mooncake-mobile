import React, { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import GetProfileForAddress from 'services/graphql/queries/GetProfileForAddress';
import { DesmosProfile } from 'types/desmos';
import { useStoredProfiles, useStoreProfile } from '@recoil/profiles';
import { useActiveAccountAddress } from '@recoil/accounts';
import { convertGraphQLProfile } from 'lib/GraphQLUtils';

/**
 * Hook to retrieve the Desmos profile of the user having the given address.
 * @param address {string | undefined} - Address of the user for which to get
 * the profile. If no address is provided, the current active account address
 * will be used instead.
 */
const useProfileGivenAddress = (address?: string) => {
  const activeAccountAddress = useActiveAccountAddress();
  const userAddress = address || activeAccountAddress;
  const isForActiveUser = activeAccountAddress === userAddress;
  if (!userAddress) {
    throw new Error('Cannot get profile for undefined address');
  }

  const [fetchedProfile, setFetchedProfile] = useState<DesmosProfile | undefined>();

  const storeProfile = useStoreProfile();
  const storedProfiles = useStoredProfiles();

  const userProfile = useMemo(
    // If the user we're getting the profile for is the active user, get the cached one.
    // Otherwise, get the one that will be downloaded from the server
    () => (isForActiveUser && userAddress ? storedProfiles[userAddress] : fetchedProfile),
    [fetchedProfile, isForActiveUser, storedProfiles, userAddress],
  );

  const { data, loading, refetch } = useQuery(GetProfileForAddress, {
    variables: { address: userAddress },
    fetchPolicy: 'cache-and-network',
  });

  React.useEffect(() => {
    if (!data) {
      return;
    }

    const { profile } = data;
    const [firstProfile] = profile;
    const onChainProfile = convertGraphQLProfile(firstProfile);

    switch (isForActiveUser) {
      case true:
        // Cache the profile of the active user
        storeProfile(userAddress, onChainProfile);
        break;

      default:
        // Set the fetched profile if the queried user is not the active user
        setFetchedProfile(onChainProfile);
    }
  }, [data, isForActiveUser, storeProfile, userAddress]);

  return {
    profile: userProfile,
    loading,
    refetch,
  };
};

export default useProfileGivenAddress;
