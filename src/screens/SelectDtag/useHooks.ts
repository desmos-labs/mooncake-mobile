import React from 'react';
import LocalWallet from 'lib/LocalWallet';
import {saveLocalWallet, saveMnemonic, saveNewAccount} from 'lib/SecureStorage';
import ROUTES from 'navigation/routes';
import {useNavigation, useRoute} from '@react-navigation/native';
import useActiveAccount from 'hooks/useActiveAccount';

import {useRecoilValue, useResetRecoilState} from 'recoil';
import createLocalWalletState from '@recoil/createLocalWalletState';
import {NavProps} from './index';

/**
 * Hooks for the SelectDtag screen.
 */
const useHooks = () => {
  const {reset} = useNavigation<NavProps['navigation']>();
  const {setActiveAddress} = useActiveAccount();

  const {
    params: {accountsWithWalletData, password},
  } = useRoute<NavProps['route']>();

  const createLocalWalletValues = useRecoilValue(createLocalWalletState);
  const resetCreateLocalWalletAtom = useResetRecoilState(
    createLocalWalletState,
  );

  const handlePressProfileItem = React.useCallback(async (address: string) => {
    console.log('hello world');

    console.log(accountsWithWalletData, address);

    // implementation
    const walletData = accountsWithWalletData.find(
      x => x.chainAccount.address === address,
    );

    console.log(walletData);

    if (!walletData) return;
    const {wallet, chainAccount} = walletData;

    if (wallet) {
      const deserializedWallet = await LocalWallet.deserialize(wallet);

      await saveLocalWallet(deserializedWallet, password!);
      await saveMnemonic(
        deserializedWallet.bech32Address,
        createLocalWalletValues.mnemonic!,
        password!,
      );
    }
    await saveNewAccount(chainAccount);

    setActiveAddress(address);

    resetCreateLocalWalletAtom();

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
