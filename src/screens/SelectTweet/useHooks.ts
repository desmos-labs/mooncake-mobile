import {MsgLinkApplicationEncodeObject} from '@desmoslabs/desmjs';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {useButterConfig} from '@recoil/butterConfigState';
import {errorImage} from 'assets/images';
import useActiveAccount from 'hooks/useActiveAccount';
import useUnlockWallet from 'hooks/useUnlockWallet';
import _ from 'lodash';
import Long from 'long';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, Linking} from 'react-native';
import GetTweetsGivenAnUsername from 'services/axios/requests/GetTweetsGivenAnUsername';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SELECT_TWEET>;

const useHooks = () => {
  const [loading, setLoading] = useState(false);
  const [tweets, setTweets] = useState<any[]>([]);
  const [user, setUser] = useState<any>();
  const [selectedTweetId, setSelectedTweetId] = useState<number>();
  const {chainAccount} = useActiveAccount();
  const unlockWallet = useUnlockWallet();
  const {butterConfig} = useButterConfig();
  const {navigate} = useNavigation<NavProps['navigation']>();
  const {
    params: {username},
  } = useRoute<NavProps['route']>();
  const {t} = useTranslation('connectApp');

  const getTweets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await GetTweetsGivenAnUsername({username});
      if (response) {
        setUser(response.user);
        setTweets(response.tweets);
      }
    } catch (e: any) {
      Alert.alert('Fetch error', e.toString());
    } finally {
      setLoading(false);
    }
  }, [loading, tweets, username]);

  const handleConnectTweet = useCallback(async () => {
    if (chainAccount) {
      const unlockResult = await unlockWallet({
        chainAccount,
        enterPwScreenOptions: {
          titleLabelOverride: t('connect twitter account'),
        },
      });
      if (unlockResult) {
        if (!unlockResult.wallet) return;
        const accounts = await unlockResult.wallet.getAccounts();
        const ibc = _.get(butterConfig, 'ibc');
        const verificationData = {
          method: 'tweet',
          value: selectedTweetId?.toString(),
        };
        const verificationDataHex = Buffer.from(
          JSON.stringify(verificationData),
        ).toString('hex');

        const msg: MsgLinkApplicationEncodeObject = {
          typeUrl: '/desmos.profiles.v3.MsgLinkApplication',
          value: {
            sender: accounts[0].address,
            linkData: {
              application: 'twitter',
              username: user.username,
            },
            callData: verificationDataHex,
            sourcePort: ibc.port,
            sourceChannel: ibc.channel,
            timeoutHeight: undefined,
            timeoutTimestamp: Long.fromNumber((Date.now() + 3600000) * 1000000),
          },
        };

        navigate(ROUTES.BROADCAST_TX, {
          messages: [msg],
          offlineSigner: unlockResult.wallet,
          successAction: () =>
            navigate(ROUTES.RESULT_MODAL, {
              onPressPrimary: () =>
                navigate(ROUTES.USER_PROFILE, {
                  visitingProfileAddress: accounts[0].address,
                }),
              title: t('common:success'),
              subtitle: t('connected'),
              primaryButtonLabel: t('common:goToProfile') as string,
            }),
          failureAction: () =>
            navigate(ROUTES.CONFIRM_MODAL, {
              title: t('common:failed'),
              subtitle: t('not connected'),
              primaryButtonLabel: t('common:retry')!,
              image: errorImage,
              onPressPrimary: () =>
                navigate(ROUTES.SELECT_TWEET, {
                  username: user.username,
                }),
              secondaryButtonLabel: t('common:goToProfile')!,
              secondaryButtonMode: 'outlined',
              onPressSecondary: () =>
                navigate(ROUTES.USER_PROFILE, {
                  visitingProfileAddress: accounts[0].address,
                }),
            }),
        });
      }
    }
  }, [chainAccount, unlockWallet, user, selectedTweetId]);

  const openTwitterApp = useCallback(() => {
    Linking.openURL('twitter://').catch(() => {
      Linking.openURL('https://twitter.com/');
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      getTweets();
    }, [username]),
  );

  return {
    navigate,
    loading,
    user,
    tweets,
    getTweets,
    t,
    selectedTweetId,
    setSelectedTweetId,
    handleConnectTweet,
    openTwitterApp,
  };
};

export default useHooks;
