import { useQuery } from '@apollo/client';
import { toBase64 } from '@cosmjs/encoding';
import { OfflineDirectSigner } from '@cosmjs/proto-signing';
import { MsgSaveProfileEncodeObject } from '@desmoslabs/desmjs';
import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import inviteCodeState from '@recoil/inviteCodeState';
import signUpState from '@recoil/screens/signUpState';
import signUpPasswordState from '@recoil/signUpPasswordState';
import useActiveAccount from 'hooks/useActiveAccount';
import { GenericMsgEnums } from 'lib/desmos/msgtypes';
import LocalWallet, { randomMnemonic } from 'lib/LocalWallet';
import { saveLocalWallet, saveMnemonic, saveNewAccount } from 'lib/SecureStorage';
import _ from 'lodash';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { updateAuthToken } from 'services/axios';
import AcceptInvite from 'services/axios/requests/AcceptInvite';
import Login from 'services/axios/requests/Login';
import { generateLoginData } from 'services/axios/requests/Login/utils';
import UploadMedia from 'services/axios/requests/UploadMedia';
import GetAccountBalanceOnStartup from 'services/graphql/queries/GetAccountBalanceOnStartup';
import { ChainAccount, ChainAccountType } from 'types/chains';
import { DesmosHdPath } from 'types/hdpath';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SIGNUP>;

const useHooks = () => {
  const { navigate, goBack, push } = useNavigation<NavProps['navigation']>();
  const { t } = useTranslation('passwordManipulation');
  const [inviteCode, setInviteCode] = useRecoilState(inviteCodeState);
  const signUpInfo = useRecoilValue(signUpState);
  const setSignUpPassword = useSetRecoilState(signUpPasswordState);
  const [loading, setLoading] = React.useState(false);
  const [addressToCheck, setAddressToCheck] = React.useState('');
  const [signupValues, setSignupValues] = React.useState<any>({});
  const { setActiveAddress } = useActiveAccount();
  const { data, startPolling, stopPolling } = useQuery(GetAccountBalanceOnStartup, {
    variables: {
      address: addressToCheck,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });

  const initialFormValues = {
    dTag: '',
    newPassword: '',
    inviteCode,
    consent: false,
  };

  const handleFormSubmit = React.useCallback(
    async (formValues: typeof initialFormValues) => {
      try {
        setLoading(true);
        // First time user, create new wallet
        const mnemonic = randomMnemonic();

        const { newPassword, dTag } = formValues;
        const newWallet = await LocalWallet.fromMnemonic(mnemonic, {
          // TODO: dev only, remove before pushing
          // hdPath: {coinType: 852, account: 1, change: 0, addressIndex: 0},
        });
        const address = newWallet.bech32Address;

        const account: ChainAccount = {
          type: ChainAccountType.Local,
          address: newWallet.bech32Address,
          hdPath: {
            ...DesmosHdPath,
          },
          pubKey: toBase64(newWallet.publicKey),
          signAlgorithm: 'secp256k1',
        };

        if (inviteCode !== '') {
          console.log('Invite code', inviteCode);
          const { signatureBytes, pubkeyBytes, signedBytes } = await generateLoginData({
            wallet: newWallet as OfflineDirectSigner,
            address,
            signerData: {
              accountNumber: 0,
              sequence: 0,
              chainId: 'desmos',
            },
          });

          const { token } = await Login({
            address,
            signatureBytes,
            pubkeyBytes,
            signedBytes,
          });

          updateAuthToken(token);

          if (token) {
            console.log('Token', token);
            await AcceptInvite(inviteCode)
              .then(async result => {
                if (result) {
                  Alert.alert(
                    'Invite redeemed!',
                    'Invitation successfully redeemed! We are creating your new Desmos Profile, please wait...',
                  );
                  setAddressToCheck(address);
                  setSignupValues({
                    wallet: newWallet,
                    dTag,
                    address,
                    password: newPassword,
                  });
                  await saveNewAccount(account);
                  await saveLocalWallet(newWallet, newPassword);
                  await saveMnemonic(newWallet.bech32Address, mnemonic, newPassword);
                  setActiveAddress(address);
                  // setMMKV(MMKVKEYS.ACTIVE_ACCOUNT_ADDR, address);
                  startPolling(1000);
                }
              })
              .catch(e => {
                console.log('error', e);
                setLoading(false);
                Alert.alert('Error', e.response.data);
              });
          }
        } else {
          Alert.alert('Error', 'Your invite code is invalid');
        }
      } catch (e) {
        console.error('Error', e);
        setLoading(false);
        stopPolling();
      }
    },
    [signUpInfo, data, startPolling, stopPolling],
  );

  const saveProfileOnChain = useCallback(async () => {
    const { wallet, address, password, dTag } = signupValues;
    const { nickname, coverPicture, profilePicture, bio } = signUpInfo;

    const [uploadProfilePicResult, uploadCoverPicResult] = await Promise.all([
      profilePicture && UploadMedia({ mediaFile: profilePicture }),
      coverPicture && UploadMedia({ mediaFile: coverPicture }),
    ]);

    const profilePictureUrl = _.get(uploadProfilePicResult, 'url');
    const coverPictureUrl = _.get(uploadCoverPicResult, 'url');

    // Save new wallet as last selected wallet
    // Build save profile message
    const saveProfileMessage: MsgSaveProfileEncodeObject = {
      typeUrl: GenericMsgEnums.MsgSaveProfile,
      value: {
        creator: address,
        dtag: dTag,
        nickname: nickname || '[do-not-modify]',
        bio: bio || '[do-not-modify]',
        profilePicture: profilePictureUrl || '[do-not-modify]',
        coverPicture: coverPictureUrl || '[do-not-modify]',
      },
    };
    stopPolling();
    const messages = [saveProfileMessage];
    setLoading(false);
    setSignUpPassword(password);

    navigate(ROUTES.BROADCAST_TX, {
      title: t('broadcastTx:signUp') as string,
      messages,
      offlineSigner: wallet,
      successAction: () => {
        push(ROUTES.SAVE_ACCOUNT);
      },
      failureAction: () => {
        goBack();
      },
    });
  }, [signupValues, signUpInfo]);

  useEffect(() => {
    console.log('Waiting the account to be on-chain');
    if (
      data &&
      data?.action_account_balance?.coins?.length > 0 &&
      data?.action_account_balance?.coins[0]?.amount !== 0
    ) {
      console.log('Account on chain found, saving the profile on chain now');
      stopPolling();
      saveProfileOnChain();
    }
  }, [data, stopPolling]);

  const openInfoModal = useCallback(() => {
    navigate(ROUTES.TEXTONLY_MODAL, {
      title: t('signup:profile dtag'),
      body: t('signup:dtag info'),
    });
  }, []);

  const validateForm = useCallback((values: typeof initialFormValues) => {
    const errors: any = {};

    if (!values.consent) {
      errors.consent = t('consent not checked');
    }

    return errors;
  }, []);

  const handlePressPP = useCallback(() => {
    // go to Privacy policy page
  }, []);

  const handlePressTOS = useCallback(() => {
    // go to Terms of Service page
  }, []);

  return {
    handlePressPP,
    handlePressTOS,
    handleFormSubmit,
    openInfoModal,
    validateForm,
    initialFormValues,
    loading,
    inviteCode,
    setInviteCode,
  };
};

export default useHooks;
