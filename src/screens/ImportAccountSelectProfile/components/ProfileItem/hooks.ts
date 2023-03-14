import React, { useState } from 'react';
import { DesmosProfile } from 'types/desmos';
import { useLazyQuery } from '@apollo/client';
import GetProfileForAddress from 'services/graphql/queries/GetProfileForAddress';
import { convertGraphQLProfile } from 'lib/GraphQLUtils';

const useGetOnChainProfile = () => {
  const [fetchProfile] = useLazyQuery(GetProfileForAddress, {
    fetchPolicy: 'cache-and-network',
  });

  return React.useCallback(
    async (address: string, abortController: AbortController) => {
      const { data, error } = await fetchProfile({
        variables: { address },
        context: {
          fetchOptions: {
            signal: abortController.signal,
          },
        },
      });

      if (!data || error) {
        return undefined;
      }

      const { profiles } = data;
      return profiles.length === 0 ? undefined : convertGraphQLProfile(profiles[0]);
    },
    [fetchProfile],
  );
};

/**
 * Hook that allows to fetch a profile given an address.
 * @param address {string} - Address of the user for which to get the profile.
 * @param fetchDelay {number} - Delay in milliseconds before fetching the profile.
 */
// It's fine to disable the rule here because we want to export only one function
// eslint-disable-next-line import/prefer-default-export
export const useFetchProfile = (address: string, fetchDelay: number = 250) => {
  const fetchProfile = useGetOnChainProfile();

  const [profileLoading, setProfileLoading] = useState(false);
  const [profile, setProfile] = useState<DesmosProfile | undefined>();

  React.useEffect(() => {
    const abortController = new AbortController();
    setProfileLoading(true);

    const timeout = setTimeout(async () => {
      setProfileLoading(true);
      const onChainProfile = await fetchProfile(address, abortController);
      setProfileLoading(false);
      setProfile(onChainProfile);
    }, fetchDelay);

    return () => {
      abortController.abort();
      clearTimeout(timeout);
      setProfile(undefined);
    };
  }, [fetchProfile, address, fetchDelay]);

  return {
    profile,
    profileLoading,
  };
};
