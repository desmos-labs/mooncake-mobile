import {useQuery} from '@apollo/client';
import {useLoadProfiles} from '@recoil/profiles';
import {defaultProfilePic} from 'assets/images';
import React, {FC, useCallback, useEffect, useMemo} from 'react';
import GetProfileForAddresses from 'services/graphql/queries/GetProfileForAddresses';
import {isEqual} from 'lodash';

import {ActivityIndicator} from 'react-native-paper';
import AddProfileBadge, {ProfileRadioValue} from '../AddProfileBadge';

/**
 * @property {number} page - The current page number.
 * @property {string[]} addresses - An array of addresses that we want to search for.
 * @property {ProfileData[]} selectedProfiles - The list of profiles that have been selected by the
 * user.
 * @property onSelect - This is a function that is called when a profile is selected.
 * @property setProfileCount - This is a function that will be called when the component is mounted. It
 * will be called with the page number and the number of profiles that were found.
 */
export type AddProfileBadgeGroupProps = {
  page: number;
  addresses: string[];
  selectedProfiles: ProfileData[];
  onSelect: (profile: ProfileData) => void;
  setProfileCount: (page: number, count: number) => void;
};

const AddProfileBadgeGroup: FC<AddProfileBadgeGroupProps> = ({
  page,
  addresses,
  selectedProfiles,
  onSelect,
  setProfileCount,
}) => {
  const {loading, error, data, variables} = useQuery<{profile: ProfileData[]}>(
    GetProfileForAddresses,
    {variables: {addresses}},
  );
  if (error) throw error;
  const profiles = data?.profile ?? [];

  const {profiles: loadedProfiles, loading: loadingProfiles} =
    useLoadProfiles();

  /* Creating a new array of ProfieRadioValue. */
  const values = useMemo<ProfileRadioValue[]>(() => {
    return profiles.map(({address, nickname, dtag, profile_pic}) => ({
      id: address,
      nickname,
      dTag: `@${dtag}`,
      profilePicture: profile_pic ? {uri: profile_pic} : defaultProfilePic,
      isSelected: selectedProfiles.some(p => p.address === address),
      disabled: loadedProfiles.some(p => p.address === address),
    }));
  }, [profiles, loadedProfiles, selectedProfiles]);

  /* Update profile count for this page for the parent component */
  useEffect(() => {
    if (!loadingProfiles) setProfileCount(page, loadedProfiles.length);
  }, [loadingProfiles, loadedProfiles]);

  /* A callback function that is used to handle the selection of a profile. */
  const handleSelect = useCallback(
    (id: string) => {
      const disabled = loadedProfiles.some(p => p.address === id);
      if (disabled) return;
      const profile = profiles.find(p => p.address === id);
      if (profile) onSelect(profile);
    },
    [loadedProfiles, selectedProfiles, onSelect],
  );

  /* This is a check to see if the data is loading, then it will return an activity indicator. */
  if (loading || loadingProfiles || !isEqual(addresses, variables?.addresses)) {
    return <ActivityIndicator />;
  }

  return (
    <>
      {values.map(value => (
        <AddProfileBadge
          value={value}
          onSelect={handleSelect}
          key={value.id}
          disabled={value.disabled}
        />
      ))}
    </>
  );
};

export default AddProfileBadgeGroup;
