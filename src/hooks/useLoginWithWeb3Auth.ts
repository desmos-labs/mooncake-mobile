import { useCallback, useState } from 'react';
import { SupportedChain } from 'types/chains';
import { Web3AuthLoginProvider } from 'types/web3auth';
import { Web3AuthKeyProvider } from '@desmoslabs/desmjs-web3auth-mobile';
import { newWeb3AuthClient, web3AuthLoginParams } from 'lib/Web3AuthUtils';
import { PrivateKeyProviderStatus } from '@desmoslabs/desmjs';
import { generateWeb3AuthWallet } from 'lib/WalletUtils';
import useSearchOnChainAccount from 'hooks/accounts/useSearchOnChainAccount';
import useSaveAccount from 'hooks/accounts/useSaveAccount';
import useGetOnChainProfile from 'hooks/profiles/useGetOnChainProfile';
import { useStoreProfile } from '@recoil/profiles';
import useSaveProfile from 'hooks/profiles/useSaveProfile';
import ROUTES from 'navigation/routes';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';

const useLoginWithWeb3Auth = (chain: SupportedChain) => {
  const navigation = useNavigation<NavigationProp<RootNavigatorParamList>>();
  const checkAccountBalance = useSearchOnChainAccount();
  const saveAccount = useSaveAccount();
  const fetchProfile = useGetOnChainProfile();
  const storeProfile = useStoreProfile();
  const createOrSaveProfile = useSaveProfile();

  const [loginLoading, setLoginLoading] = useState(false);
  const login = useCallback(
    async (loginProvider: Web3AuthLoginProvider) => {
      const keyProvider = new Web3AuthKeyProvider(newWeb3AuthClient(), {
        loginParams: web3AuthLoginParams(loginProvider),
        logoutParams: {},
      });

      try {
        await keyProvider.connect();
      } catch (e) {
        // Ignore cancel exception.
      }

      // If not connected return.
      if (keyProvider.status !== PrivateKeyProviderStatus.Connected) {
        return;
      }

      // Get the obtained private key.
      const privateKey = await keyProvider.getPrivateKey();

      // Generate the wallet to check.
      setLoginLoading(true);
      const account = await generateWeb3AuthWallet(chain.prefix, loginProvider, privateKey.key);

      // Check if the wallet is already on the chain.
      if (account.wallet.address) {
        const result = await checkAccountBalance(account.wallet.address);
        if (result) {
          // The account is already on the chain, so we need to save it
          // and check if it has a profile
          const profile = await fetchProfile(account.wallet.address);
          setLoginLoading(false);
          switch (profile) {
            case undefined:
              // The user does not have a profile, so we need to tell them to create one
              createOrSaveProfile({
                storeOnChain: false,
                account,
                onSuccess: () => saveAccount(account),
              });
              break;

            default:
              // The user has a profile, so we need to save both the account and the profile
              saveAccount(account);
              storeProfile(account.account.address, profile);
          }
        } else {
          setLoginLoading(false);
          navigation.navigate(ROUTES.SIGNUP, { account });
        }
      }
    },
    [
      chain.prefix,
      checkAccountBalance,
      createOrSaveProfile,
      fetchProfile,
      navigation,
      saveAccount,
      storeProfile,
    ],
  );

  return {
    login,
    loginLoading,
  };
};

export default useLoginWithWeb3Auth;
