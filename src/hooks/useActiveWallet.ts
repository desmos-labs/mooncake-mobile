import React from 'react';
import LocalWallet from 'lib/LocalWallet';
import {getMMKV, MMKVKEYS} from 'lib/MMKVStorage';
import {getItem} from 'lib/SecureStorage';

const useActiveWallet = ({password}: {password: string}) => {
  const [wallet, setWallet] = React.useState<LocalWallet | undefined>();
  const walletAddr = getMMKV(MMKVKEYS.ACTIVE_WALLET_ADDR);

  const getWalletFromSecureStorage = React.useCallback(async () => {
    const _wallet = await getItem(`${walletAddr}_key`, {password});
    if (_wallet) {
      setWallet(await LocalWallet.deserialize(_wallet));
    }
  }, []);

  React.useEffect(() => {
    if (walletAddr) {
      getWalletFromSecureStorage();
    }
  }, [walletAddr]);

  return {
    wallet,
  };
};

export default useActiveWallet;
