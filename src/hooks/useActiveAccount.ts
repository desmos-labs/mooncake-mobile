import {MMKVKEYS, useMMKVStorage} from 'lib/MMKVStorage';
import {useGetProfileData} from '@recoil/activeProfileState';

/**
 * WIP hook to retrieve the user's most recent active account
 */
const useActiveAccount = () => {
  const [activeAddress] = useMMKVStorage<string | undefined>(
    MMKVKEYS.ACTIVE_ACCOUNT_ADDR,
  );

  const {profileData, loading} = useGetProfileData(activeAddress || '');

  return {
    activeAddress,
    profileData,
    loading,
  };
};

export default useActiveAccount;
