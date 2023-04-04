import { useCallback, useState } from 'react';
import { DesmosProfile } from 'types/desmos';
import { convertGraphQLProfile } from 'lib/GraphQLUtils';
import sleep from 'lib/sleep';
import useCustomLazyQuery from 'hooks/graphql/useCustomLazyQuery';
import GetProfileForDTag from 'services/graphql/queries/GetProfileForDTag';

/**
 * Hook that contains all the logic for the search view component
 * @param addressToSearch The profile to search for inside the search bar
 */
const useHooks = (addressToSearch: string) => {
  const [getLazyData, { fetchMore }] = useCustomLazyQuery(GetProfileForDTag);
  const [profiles, setProfiles] = useState<DesmosProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  /**
   * Gets the profile for the given DTag
   */
  const getProfileForDTag = useCallback(async () => {
    setIsSearching(true);
    let results;
    if (addressToSearch !== '') {
      results = await getLazyData({
        variables: {
          dTag: `%${addressToSearch}%`,
          limit: 20,
          offset: 0,
        },
      });
    } else {
      results = await getLazyData({
        variables: {
          dTag: addressToSearch,
          limit: 20,
          offset: 0,
        },
      });
    }
    const convertedProfiles = results.profile.map((profile: any) => convertGraphQLProfile(profile));
    setProfiles(convertedProfiles);
    await sleep(500);
    setIsSearching(false);
  }, [addressToSearch, getLazyData]);

  const fetchMoreProfiles = useCallback(async () => {
    const results = await fetchMore({
      variables: { offset: profiles.length },
    });

    const convertedProfiles = results.data.profile.map((profile: any) =>
      convertGraphQLProfile(profile),
    );
    setProfiles(prev => [...prev, ...convertedProfiles]);
  }, [fetchMore, profiles.length]);

  return {
    getProfileForDTag,
    profiles,
    isSearching,
    fetchMoreProfiles,
  };
};

export default useHooks;
