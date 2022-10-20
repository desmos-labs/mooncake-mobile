import {StdFee} from '@cosmjs/amino';
import {toHex, toUtf8} from '@cosmjs/encoding';
import {OfflineSigner} from '@cosmjs/proto-signing';
import {
  getPubKeyBytes,
  getSignatureBytes,
  getSignedBytes,
  MsgAuthenticateEncodeObject,
} from '@desmoslabs/desmjs';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import useSignCustomTx from 'hooks/broadcastTx/useSignCustomTx';
import useActiveAccount from 'hooks/useActiveAccount';
import useUnlockWallet from 'hooks/useUnlockWallet';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Linking} from 'react-native';
import CheckTwitterUsername from 'services/axios/requests/CheckTwitterUsername';
import PostProof from 'services/axios/requests/PostProof';

export type ConnectAppParams = {
  mode: 'connect' | 'tweet';
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.CONNECT_APP>;

const useHooks = () => {
  const {navigate} = useNavigation<NavProps['navigation']>();
  const {
    params: {mode},
  } = useRoute<NavProps['route']>();
  const [openingTwitterApp, setOpeningTwitterApp] = useState<boolean>(false);
  const [generatingProof, setGeneratingProof] = useState<boolean>(false);
  const [twitted, setTwitted] = useState<boolean>(false);
  const [wallet, setWallet] = useState<OfflineSigner>();
  const [proofString, setProofString] = useState<string>('');
  const [twitterUsername, setTwitterUsername] = useState<string>('');
  const [twitterUsernameExisting, setTwitterUsernameExisting] =
    useState<boolean>(false);
  const [checkingUsername, setCheckingUsername] = useState<boolean>(false);
  const {chainAccount} = useActiveAccount();
  const unlockWallet = useUnlockWallet();
  const signCustomTx = useSignCustomTx();
  const {t} = useTranslation('connectApp');

  const handleUnlockWallet = useCallback(async () => {
    if (chainAccount) {
      const unlockResult = await unlockWallet({
        chainAccount,
        enterPwScreenOptions: {titleLabelOverride: t('proof')},
      });
      if (unlockResult) {
        setWallet(unlockResult.wallet);
        navigate(ROUTES.CONNECT_APP, {
          mode: 'tweet',
        });
      }
    }
  }, [chainAccount, unlockWallet]);

  const handleSelectTweet = useCallback(() => {
    navigate(ROUTES.SELECT_TWEET, {username: twitterUsername});
  }, [twitterUsername]);

  const handleOnPress = useCallback(() => {
    navigate(ROUTES.CONFIRM_MODAL, {
      title: t('proof'),
      subtitle: t('proof description'),
      primaryButtonLabel: 'confirm',
      onPressPrimary: handleUnlockWallet,
      removeModalAfterButtonPress: true,
    });
  }, [handleUnlockWallet]);

  const openTwitterApp = useCallback(() => {
    setOpeningTwitterApp(true);
    Linking.openURL(
      `twitter://post?message=${encodeURIComponent(
        t('link proof') + proofString,
      )}`,
    )
      .catch(() => {
        Linking.openURL(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            t('link proof') + proofString,
          )}`,
        );
      })
      .finally(() => {
        setTimeout(() => {
          setTwitted(true);
          setOpeningTwitterApp(false);
        }, 1000);
      });
  }, [twitted, t, proofString]);

  const generateProof = useCallback(async () => {
    if (!wallet) return;
    const accounts = await wallet.getAccounts();
    const msg: MsgAuthenticateEncodeObject = {
      typeUrl: '/desmjs.v1.MsgAuthenticate',
      value: {
        user: accounts[0].address,
        nonce: toUtf8(twitterUsername),
      },
    };

    const fee: StdFee = {
      amount: [],
      gas: '0',
    };

    const signed = await signCustomTx(wallet, [msg], fee);

    return {
      desmos_address: accounts[0].address,
      pubkey_bytes: toHex(getPubKeyBytes(signed)),
      signed_bytes: toHex(getSignedBytes(signed)),
      signature_bytes: toHex(getSignatureBytes(signed)),
    };
  }, [wallet, signCustomTx]);

  const postProof = useCallback(async () => {
    try {
      setGeneratingProof(true);
      const toUpload = await generateProof();
      const result = await PostProof(toUpload);
      setProofString(result.url);
    } catch (e: any) {
      navigate(ROUTES.RESULT_MODAL, {
        title: t('common:failed'),
        subtitle: e.toString(),
        primaryButtonLabel: t('common:retry')!,
        onPressPrimary: () =>
          navigate(ROUTES.CONNECT_APP, {
            mode: 'tweet',
          }),
      });
    } finally {
      setGeneratingProof(false);
    }
  }, [generateProof]);

  useFocusEffect(
    useCallback(() => {
      if (mode === 'tweet') {
        postProof();
      }
    }, [mode]),
  );

  const checkTwitterUsername = useCallback(
    async (username: string) => {
      try {
        setCheckingUsername(true);
        const result = await CheckTwitterUsername(username);
        if (result) {
          setTwitterUsernameExisting(true);
        }
      } catch (e) {
        setTwitterUsernameExisting(false);
      } finally {
        setCheckingUsername(false);
      }
    },
    [checkingUsername, twitterUsernameExisting],
  );

  return {
    mode,
    twitterUsername,
    setTwitterUsername,
    postProof,
    openTwitterApp,
    handleOnPress,
    handleSelectTweet,
    generatingProof,
    proofString,
    openingTwitterApp,
    twitted,
    checkTwitterUsername,
    twitterUsernameExisting,
    checkingUsername,
  };
};

export default useHooks;
