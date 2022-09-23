import {useQuery} from '@apollo/client';
import {useLoadProfiles} from '@recoil/profiles';
import {defaultProfilePic} from 'assets/images';
import React, {FC, useCallback, useEffect, useMemo} from 'react';
import GetProfileForAddresses from 'services/graphql/queries/GetProfileForAddresses';
import {ChainAccount} from 'types/chains';
import {isEqual} from 'lodash';

import {ActivityIndicator} from 'react-native-paper';
import AddProfileBadge from '../AddProfileBadge';

export type AddProfileBadgeGroupProps = {
  page: number;
  accounts: ChainAccount[];
  selectedProfiles: ProfileData[];
  onSelect: (profile: ProfileData) => void;
  setProfileCount: (page: number, count: number) => void;
};

const AddProfileBadgeGroup: FC<AddProfileBadgeGroupProps> = ({
  page,
  accounts,
  selectedProfiles,
  onSelect,
  setProfileCount,
}) => {
  const addresses = useMemo(
    () => accounts.map(account => account.address),
    [accounts],
  );
  const {loading, error, data, variables} = useQuery<{profile: ProfileData[]}>(
    GetProfileForAddresses,
    {variables: {addresses}},
  );
  if (error) throw error;
  const profiles = data?.profile ?? [];

  const {profiles: loadedProfiles, loading: loadingProfiles} =
    useLoadProfiles();

  const values = useMemo(() => {
    return profiles.map(({address, nickname, dtag, profile_pic}) => ({
      id: address,
      nickname,
      dTag: `@${dtag}`,
      profilePicture: profile_pic ? {uri: profile_pic} : defaultProfilePic,
      isSelected: selectedProfiles.some(p => p.address === address),
      disabled: loadedProfiles.some(p => p.address === address),
    }));
  }, [profiles, loadedProfiles, selectedProfiles]);

  useEffect(() => {
    if (!loadingProfiles) setProfileCount(page, loadedProfiles.length);
  }, [loadingProfiles, loadedProfiles]);

  const handleSelect = useCallback(
    (id: string) => {
      const disabled = loadedProfiles.some(p => p.address === id);
      if (disabled) return;
      const profile = profiles.find(p => p.address === id);
      if (profile) onSelect(profile);
    },
    [loadedProfiles, selectedProfiles, onSelect],
  );

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
