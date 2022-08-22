import React from 'react';
import {MMKVKEYS, useMMKVStorage} from 'lib/MMKVStorage';
import {useGetProfileData} from '@recoil/activeProfileState';
import {ChainAccount} from 'types/chains';
import {getAccounts} from 'lib/SecureStorage';

/**
 * WIP hook to retrieve the user's most recent active account
 *
 */
const useActiveAccount = () => {
  const [chainAccount, setChainAccount] = React.useState<ChainAccount>();

  const [activeAddress] = useMMKVStorage<string | undefined>(
    MMKVKEYS.ACTIVE_ACCOUNT_ADDR,
  );

  React.useEffect(() => {
    const loadChainAccount = async () => {
      const _chainAccounts = await getAccounts();
      if (_chainAccounts) {
        const _currentChainAccount = _chainAccounts.find(
          x => x.address === activeAddress,
        );
        console.log(_currentChainAccount);
        setChainAccount(_currentChainAccount);
      }
    };

    if (activeAddress) {
      loadChainAccount();
    }
  }, [activeAddress]);

  const {profileData, loading} = useGetProfileData(activeAddress || '');

  return {
    activeAddress,
    profileData,
    loading,
    chainAccount,
  };
};

export default useActiveAccount;
