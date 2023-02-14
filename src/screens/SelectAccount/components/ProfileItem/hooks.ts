import { useEffect, useState } from 'react';
import { DesmosProfile } from 'types/desmos';
import { useLazyQuery } from '@apollo/client';
import GetProfileForAddress from 'services/graphql/queries/GetProfileForAddress';
import { convertGraphQLProfile } from 'lib/GraphQLUtils';

/**
 * Hook that allows to fetch a profile given an address.
 * @param address {string} - Address of the user for which to get the profile.
 * @param fetchDelay
 */
export const useFetchProfile = (address: string, fetchDelay: number) => {
  const [profileLoading, setProfileLoading] = useState(false);
  const [profile, setProfile] = useState<DesmosProfile>();
  const [lazyFetchProfile] = useLazyQuery(GetProfileForAddress, {
    variables: { address: '' },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    const abortController = new AbortController();
    setProfileLoading(true);

    const timeout = setTimeout(async () => {
      try {
        const { data } = await lazyFetchProfile({
          variables: { address },
          context: {
            fetchOptions: {
              signal: abortController.signal,
            },
          },
        });
        setProfile(convertGraphQLProfile(data.profile[0]));
      } catch (e) {
        // Ignore fetch error.
      } finally {
        setProfileLoading(false);
      }
    }, fetchDelay);
    return () => {
      abortController.abort();
      clearTimeout(timeout);
      setProfile(undefined);
    };
  }, [lazyFetchProfile, address, fetchDelay]);

  return {
    profile,
    profileLoading,
  };
};
