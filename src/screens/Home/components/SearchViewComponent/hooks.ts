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
  const getProfile = useCustomLazyQuery(GetProfileForDTag);
  const [profiles, setProfiles] = useState<DesmosProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const getProfileForDTag = useCallback(async () => {
    setIsSearching(true);
    let results;
    if (addressToSearch !== '') {
      results = await getProfile({
        variables: {
          dTag: `%${addressToSearch}%`,
        },
      });
    } else {
      results = await getProfile({
        variables: {
          dTag: addressToSearch,
        },
      });
    }
    const convertedProfiles = results.profile.map((profile: any) => convertGraphQLProfile(profile));
    setProfiles(convertedProfiles);
    await sleep(500);
    setIsSearching(false);
  }, [addressToSearch, getProfile]);

  return {
    getProfileForDTag,
    profiles,
    isSearching,
  };
};

export default useHooks;
