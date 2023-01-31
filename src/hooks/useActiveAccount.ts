import React from 'react';
import {useGetProfileData} from '@recoil/activeProfileState';
import {ChainAccount} from 'types/chains';
import {getAccounts} from 'lib/SecureStorage';
import {useRecoilState} from 'recoil';
import activeAccountAddressState from '@recoil/activeAccount';

/**
 * WIP hook to retrieve the user's most recent active account
 *
 */
const useActiveAccount = () => {
  const [chainAccount, setChainAccount] = React.useState<ChainAccount>();

  const [activeAddress, setActiveAddress] = useRecoilState(
    activeAccountAddressState,
  );

  // You may be tempted to turn this into a useCallback, but
  // keeping it in a useEffect allows it to change should the user
  // change their active account
  React.useEffect(() => {
    const loadChainAccount = async () => {
      const _chainAccounts = await getAccounts();
      if (_chainAccounts) {
        const _currentChainAccount = _chainAccounts.find(
          x => x.address === activeAddress,
        );
        setChainAccount(_currentChainAccount);
      }
    };

    if (activeAddress) {
      loadChainAccount();
    }
  }, [activeAddress]);

  const {profileData, loading, refetch} = useGetProfileData(
    activeAddress || '',
  );

  return {
    activeAddress,
    setActiveAddress,
    profileData,
    loading,
    chainAccount,
    refetch,
  };
};

export default useActiveAccount;
