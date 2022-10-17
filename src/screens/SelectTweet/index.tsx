import Button from 'components/Button';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import useActiveAccount from 'hooks/useActiveAccount';
import useUnlockWallet from 'hooks/useUnlockWallet';
import React, {useCallback} from 'react';
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
  const {loading, getTweets, user, tweets} = useHooks();

  const handleConnectTweet = useCallback(async () => {
    if (chainAccount) {
      const unlockResult = await unlockWallet({
        chainAccount,
        enterPwScreenOptions: {titleLabelOverride: t('proof')},
      });
      if (unlockResult) {
        console.log('unlocked');
      }
    }
  }, [chainAccount, unlockWallet]);

  const renderItem = React.useCallback(({item}: ListRenderItemInfo<any>) => {
    return <TweetComponent selected={true} data={item} user={user} />;
  }, []);

  return (
    <DView
      topBar={<TopBar />}
      style={styles.container}
      showLoadingOverlay={loading}
      backgroundColor={theme.colors.white}>
      <>
        <Typography.H3>{t('select tweet')}</Typography.H3>
        <Typography.Body6>{t('select one tweet')}</Typography.Body6>
        <FlatList
          refreshing={loading}
          onRefresh={getTweets}
          data={tweets}
          renderItem={renderItem}
          contentContainerStyle={{
            flexGrow: 1,
          }}
        />
        <Button
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
