import {MMKVKEYS, useMMKVStorage} from 'lib/MMKVStorage';
import {useGetProfileData} from '@recoil/activeProfileState';

/**
 * WIP hook to retrieve the user's most recent active account
 * Later on, additional features such as caching and unlocking the app between
 * sessions should be added here
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
