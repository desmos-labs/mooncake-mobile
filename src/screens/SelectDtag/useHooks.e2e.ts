import React from 'react';
import ROUTES from 'navigation/routes';
import {useNavigation, useRoute} from '@react-navigation/native';
import useActiveAccount from 'hooks/useActiveAccount';

import {useResetRecoilState} from 'recoil';
import createLocalWalletState from '@recoil/createLocalWalletState';
import {NavProps} from './index';

/**
 * Mock Hooks for the SelectDtag screen. This mock should be considered temporary
 * until it is synced with the logic refactor.
 */
const useHooks = () => {
  const {reset} = useNavigation<NavProps['navigation']>();
  const {setActiveAddress} = useActiveAccount();

  const {
    params: {accountsWithWalletData},
  } = useRoute<NavProps['route']>();

  const resetCreateLocalWalletAtom = useResetRecoilState(
    createLocalWalletState,
  );

  const handlePressProfileItem = React.useCallback(async (address: string) => {
    // implementation
    const walletData = accountsWithWalletData.find(
      x => x.chainAccount.address === address,
    );
    if (!walletData) return;

    setActiveAddress(address);

    resetCreateLocalWalletAtom();

    // don't save wallet or account data and just go straight to the home screen
    reset({
      index: 0,
      routes: [
        {
          name: ROUTES.BOTTOM_TABS,
        },
      ],
    });
  }, []);

  return {
    handlePressProfileItem,
  };
};

export default useHooks;
