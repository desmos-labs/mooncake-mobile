import {useQuery} from '@apollo/client';
import React, {
  FC,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import GetProfileForAddresses from 'services/graphql/queries/GetProfileForAddresses';
import {isEqual} from 'lodash';
import AddProfileBadge, {
  ProfileRadioValue,
  profileToRadioValue,
} from '../AddProfileBadge';

/**
 * @property {number} page - The current page number.
 * @property {string[]} addresses - An array of addresses that we want to search for.
 * @property {ProfileData[]} selectedProfiles - The list of profiles that have been selected by the
 * user.
 * @property onSelect - This is a function that is called when a profile is selected.
 * @property setProfileCount - This is a function that will be called when the component is mounted. It
 * will be called with the page number and the number of profiles that were found.
 * @property loadMoreAccounts - load more profiles
 */
export type AddProfileBadgeGroupProps = {
  page: number;
  addresses: string[];
  selectedProfiles: ProfileData[];
  onSelect: (profile: ProfileData) => void;
  setProfileCount: (page: number, count: number) => void;
  loadMoreAccounts: () => void;
};

const AddProfileBadgeGroup: FC<AddProfileBadgeGroupProps> = ({
  page,
  addresses,
  selectedProfiles,
  onSelect,
  setProfileCount,
  loadMoreAccounts,
}) => {
  const {loading, error, data, variables} = useQuery<{profile: ProfileData[]}>(
    GetProfileForAddresses,
    {variables: {addresses}},
  );
  if (error) throw error;
  const profiles = data?.profile ?? [];

  /* Creating a new array of ProfieRadioValue. */
  const values = useMemo<ProfileRadioValue[]>(() => {
    return profiles.map(profile => ({
      ...profileToRadioValue(profile),
      isSelected: selectedProfiles.some(p => p.address === profile.address),
    }));
  }, [profiles, selectedProfiles]);

  /* A callback function that is used to handle the selection of a profile. */
  const handleSelect = useCallback(
    (id: string) => {
      const profile = profiles.find(p => p.address === id);
      if (profile) onSelect(profile);
    },
    [selectedProfiles, onSelect],
  );

  const isLoadedRef = useRef(false);
  const isLoaded = !loading && isEqual(addresses, variables?.addresses);

  useEffect(() => {
    if (isLoaded && !isLoadedRef.current) {
      isLoadedRef.current = true;
      setProfileCount(page, profiles.length);
      // if user picked the #400 account to create his profile, then it will nned 3 loadMoreAccounts to load his profile
      startTransition(loadMoreAccounts);
    }
  }, [isLoaded]);

  /* This is a check to see if the data is loading, then it will return an activity indicator. */
  if (!isLoadedRef.current) {
    return null;
  }

  return (
    <>
      {values.map(value => (
        <AddProfileBadge value={value} onSelect={handleSelect} key={value.id} />
      ))}
    </>
  );
};

export default AddProfileBadgeGroup;
