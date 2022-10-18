import {MsgLinkApplicationEncodeObject} from '@desmoslabs/desmjs';
import {useButterConfig} from '@recoil/butterConfigState';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import useActiveAccount from 'hooks/useActiveAccount';
import useUnlockWallet from 'hooks/useUnlockWallet';
import _ from 'lodash';
import Long from 'long';
import ROUTES from 'navigation/routes';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, ListRenderItemInfo} from 'react-native';
import {useTheme} from 'react-native-paper';
import TweetComponent from 'screens/SelectTweet/components/TweetComponent';
import useHooks from './useHooks';
import useStyles from './useStyles';

export type SelectTweetParams = {
  username: string;
};

const SelectTweet = () => {
  const styles = useStyles();
  const {t} = useTranslation('connectApp');
  const theme = useTheme();
  const {chainAccount} = useActiveAccount();
  const unlockWallet = useUnlockWallet();
  const [selectedTweetId, setSelectedTweetId] = useState<number>();
  const {butterConfig} = useButterConfig();
  const {navigate, loading, getTweets, user, tweets} = useHooks();

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
          value: JSON.stringify(selectedTweetId),
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
              title: t('failed'),
              subtitle: t('connected'),
              primaryButtonLabel: t('go to profile')!,
            }),
          failureAction: () =>
            navigate(ROUTES.RESULT_MODAL, {
              onPressPrimary: () =>
                navigate(ROUTES.SELECT_TWEET, {
                  username: user.username,
                }),
              title: t('failed'),
              subtitle: t('not connected'),
              primaryButtonLabel: t('retry')!,
            }),
        });
      }
    }
  }, [chainAccount, unlockWallet, user, selectedTweetId]);

  const renderItem = React.useCallback(
    ({item}: ListRenderItemInfo<any>) => {
      return (
        <TweetComponent
          selected={item.id === selectedTweetId}
          data={item}
          user={user}
          onPress={id => setSelectedTweetId(id)}
        />
      );
    },
    [user, selectedTweetId],
  );

  return (
    <DView
      topBar={<TopBar />}
      style={styles.container}
      showLoadingOverlay={loading}
      backgroundColor={theme.colors.white}>
      <>
        <Typography.H3>{t('select tweet')}</Typography.H3>
        <Spacer paddingVertical={theme.spacing.s}>
          <Typography.Body6>{t('select one tweet')}</Typography.Body6>
        </Spacer>
        <FlatList
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={getTweets}
          data={tweets}
          renderItem={renderItem}
          style={{marginHorizontal: -theme.spacing.m, flexGrow: 1}}
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.m,
            flexGrow: 1,
          }}
        />
        <Button
          disabled={!selectedTweetId}
          mode="contained"
          color={theme.colors.surfaceBlack}
          onPress={handleConnectTweet}
          style={styles.button}>
          <Typography.Button2 style={{color: theme.colors.white}}>
            {t('common:next')}
          </Typography.Button2>
        </Button>
      </>
    </DView>
  );
};

export default SelectTweet;
