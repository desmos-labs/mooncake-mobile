import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import React, {useMemo} from 'react';
import {FlatList, ListRenderItemInfo} from 'react-native';
import {useTheme} from 'react-native-paper';
import NoTweets from 'screens/SelectTweet/components/NoConnections';
import TweetComponent from 'screens/SelectTweet/components/TweetComponent';
import useHooks from './useHooks';
import useStyles from './useStyles';

export type SelectTweetParams = {
  username: string;
};

const SelectTweet = () => {
  const styles = useStyles();
  const theme = useTheme();
  const {
    loading,
    getTweets,
    user,
    tweets,
    selectedTweetId,
    setSelectedTweetId,
    handleConnectTweet,
    t,
    openTwitterApp,
  } = useHooks();

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

  const EmptyComponent = useMemo(() => {
    return (
      <>
        <NoTweets />
        <Spacer paddingVertical={12} />
        <Button
          color={theme.colors.surfaceBlack}
          mode="outlined"
          onPress={openTwitterApp}
          style={{
            alignSelf: 'center',
            borderColor: theme.colors.surfaceBlack,
            width: 140,
            height: 42,
            justifyContent: 'center',
          }}>
          {t('tweet now')}
        </Button>
      </>
    );
  }, []);

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
          style={styles.flatlist}
          ListEmptyComponent={EmptyComponent}
          contentContainerStyle={styles.flatlistContainer}
        />
        {tweets.length > 0 && (
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
        )}
      </>
    </DView>
  );
};

export default SelectTweet;
