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
import {checkBlackIcon, twitterIcon} from 'assets/images';
import Button from 'components/Button';
import DTextInput from 'components/DTextInput';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import useSignCustomTx from 'hooks/broadcastTx/useSignCustomTx';
import useActiveAccount from 'hooks/useActiveAccount';
import useUnlockWallet from 'hooks/useUnlockWallet';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import PostProof from 'services/axios/requests/PostProof';
import useStyles from './useStyles';

export type ConnectAppParams = {
  mode: 'connect' | 'tweet';
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.CONNECT_APP>;

const ConnectApp = () => {
  const styles = useStyles();
  const {t} = useTranslation('connectApp');
  const theme = useTheme();
  const {navigate} = useNavigation<NavProps['navigation']>();
  const [loading, setLoading] = useState<boolean>(false);
  const [generatingProof, setGeneratingProof] = useState<boolean>(false);
  const [twitted, setTwitted] = useState<boolean>(false);
  const [wallet, setWallet] = useState<OfflineSigner>();
  const [proofString, setProofString] = useState<string>('');
  const [twitterUsername, setTwitterUsername] = useState<string>('');
  const {chainAccount} = useActiveAccount();
  const unlockWallet = useUnlockWallet();
  const signCustomTx = useSignCustomTx();
  const {
    params: {mode},
  } = useRoute<NavProps['route']>();

  const handleUnlockWallet = useCallback(async () => {
    console.log('unlockWallet');
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
    setLoading(true);
    Linking.openURL('twitter://post?message=hello%20world')
      .catch(() => {
        Linking.openURL(
          'https://twitter.com/compose/tweet?message=hello%20world',
        );
      })
      .finally(() => {
        setTimeout(() => {
          setTwitted(true);
          setLoading(false);
        }, 1000);
      });
  }, [twitted]);

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
      console.log(result);
      setProofString(result.url);
    } catch (e) {
      console.error(e);
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

  return (
    <DView
      topBar={<TopBar />}
      style={styles.container}
      showLoadingOverlay={generatingProof}
      backgroundColor={theme.colors.white}>
      {mode === 'connect' ? (
        <>
          <View style={{flex: 1}}>
            <Spacer paddingVertical={theme.spacing.m}>
              <Image source={twitterIcon} style={styles.image} />
            </Spacer>
            <Typography.Subtitle2>{t('twitter username')}</Typography.Subtitle2>
            <DTextInput
              autoCapitalize="none"
              placeholder={t('username')}
              style={styles.input}
              value={twitterUsername}
              onChangeText={text => setTwitterUsername(text)}
            />
          </View>
          <KeyboardAvoidingView
            keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Button
              disabled={!twitterUsername}
              mode="contained"
              color={theme.colors.surfaceBlack}
              loading={loading}
              onPress={handleOnPress}
              style={styles.button}>
              <Typography.Button2 style={{color: theme.colors.white}}>
                {t('common:next')}
              </Typography.Button2>
            </Button>
          </KeyboardAvoidingView>
        </>
      ) : (
        <>
          <View style={{flex: 1}}>
            <Spacer paddingVertical={theme.spacing.m}>
              <Image source={twitterIcon} style={styles.image} />
            </Spacer>
            <View style={{alignSelf: 'center'}}>
              <Typography.Subtitle2 style={{alignSelf: 'center'}}>
                {twitterUsername}
              </Typography.Subtitle2>
              <Typography.Body6
                style={{color: theme.colors.grey02, alignSelf: 'center'}}>
                @twitter
              </Typography.Body6>
            </View>
            <Spacer paddingVertical={theme.spacing.m} />
            <Typography.Body5>{t('tweet content')}</Typography.Body5>
            <View style={styles.tweetContent}>
              {proofString ? (
                <Typography.Body5
                  selectable={true}
                  selectionColor={theme.colors.butterOrange01}>
                  {t('link proof')} {proofString}
                </Typography.Body5>
              ) : (
                <Typography.Body5>Generating proof...</Typography.Body5>
              )}
            </View>
          </View>
          {twitted && (
            <View style={styles.tweetBadge}>
              <Typography.Button2>{t('tweet made')}</Typography.Button2>
              <Image
                source={checkBlackIcon}
                style={{width: 24, height: 24, marginLeft: 2}}
              />
            </View>
          )}
          <Button
            disabled={!twitterUsername}
            mode="contained"
            color={theme.colors.surfaceBlack}
            loading={loading}
            onPress={twitted ? handleSelectTweet : openTwitterApp}
            style={styles.button}>
            <Typography.Button2 style={{color: theme.colors.white}}>
              {twitted ? t('common:next') : t('tweet it now')}
            </Typography.Button2>
          </Button>
        </>
      )}
    </DView>
  );
};

export default ConnectApp;
