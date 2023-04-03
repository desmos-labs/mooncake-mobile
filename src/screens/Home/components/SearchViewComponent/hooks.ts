import { useCallback, useState } from 'react';
import { DesmosProfile } from 'types/desmos';
import { convertGraphQLProfile } from 'lib/GraphQLUtils';
import sleep from 'lib/sleep';
import useCustomLazyQuery from 'hooks/graphql/useCustomLazyQuery';
import SearchProfiles from 'services/graphql/queries/SearchProfiles';

/**
 * Hook that contains all the logic for the search view component
 * @param addressToSearch The profile to search for inside the search bar
 * @param resultsPerPage The number of results to show per page
 */
const useSearch = (addressToSearch: string, resultsPerPage: number = 20) => {
  const [getLazyData, { fetchMore }] = useCustomLazyQuery(SearchProfiles, {
    variables: {
      search: `%${addressToSearch}%`,
      limit: resultsPerPage,
      offset: 0,
    },
  });
  const [profiles, setProfiles] = useState<DesmosProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchProfilesOnChain = useCallback(async () => {
    const results = await getLazyData();
    return ((results && results?.profiles) || []).map((profile: any) =>
      convertGraphQLProfile(profile),
    );
  }, [getLazyData]);

  /**
   * Gets the profile for the given DTag
   */
  const getProfileFromSearchValue = useCallback(async () => {
    setIsSearching(true);
    const convertedProfiles = addressToSearch === '' ? [] : await searchProfilesOnChain();
    setProfiles(convertedProfiles);
    await sleep(500);
    setIsSearching(false);
  }, [addressToSearch, searchProfilesOnChain]);

  const fetchMoreProfiles = useCallback(async () => {
    const results = await fetchMore({
      variables: { offset: profiles.length },
    });

    const convertedProfiles =
      addressToSearch === ''
        ? []
        : ((results && results?.data.profiles) || []).map((profile: any) =>
            convertGraphQLProfile(profile),
          );
    setProfiles(prev => [...prev, ...convertedProfiles]);
  }, [addressToSearch, fetchMore, profiles.length]);

  return {
    getProfileForDTag: getProfileFromSearchValue,
    profiles,
    isSearching,
    fetchMoreProfiles,
  };
};

export default useSearch;
