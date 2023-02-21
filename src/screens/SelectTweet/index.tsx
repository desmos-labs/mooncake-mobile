import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Linking, ListRenderItemInfo, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import NoTweets from 'screens/SelectTweet/components/NoConnections';
import TweetListItem from 'screens/SelectTweet/components/TweetListItem';
import { TwitterTweet } from 'types/twitter';
import useTwitterData from 'hooks/twitter/useUserTweets';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import useConnectTwitter from 'hooks/twitter/useConnectTwitter';
import useNavigateToProfile from 'hooks/navigation/useNavigateToProfile';
import useStyles from './useStyles';

export type SelectTweetParams = {
  username: string;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SELECT_TWEET>;

/**
 * Screen that allows the user to select a Tweet as the verification method
 * when connecting their Desmos profile to their Twitter account
 * @constructor
 */
const SelectTweet = () => {
  const { t } = useTranslation('connectApp');
  const styles = useStyles();
  const theme = useTheme();

  const { params } = useRoute<NavProps['route']>();
  const { username } = params;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const navigateToProfile = useNavigateToProfile();

  const { user, tweets, loading, refetch: refreshTweets, error } = useTwitterData(username);
  const connectTwitter = useConnectTwitter();
  const [selectedTweet, setSelectedTweet] = useState<TwitterTweet | undefined>();

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  // Open the Twitter app or the Twitter website
  const openTwitterApp = useCallback(() => {
    Linking.openURL('twitter://').catch(() => {
      Linking.openURL('https://twitter.com/');
    });
  }, []);

  // Callback to start the connection process
  const handleConnect = useCallback(async () => {
    if (!user || !selectedTweet) return;

    const result = await connectTwitter(user, selectedTweet);
    if (result.isErr()) {
      // TODO: Properly handle this error
      Alert.alert('Error', result.error.message);
      return;
    }

    navigateToProfile();
  }, [connectTwitter, navigateToProfile, selectedTweet, user]);

  // -------------------------------------------------------------------------------------
  // --- Child components
  // -------------------------------------------------------------------------------------

  // Callback to render each tweet
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<TwitterTweet>) => {
      return (
        <TweetListItem
          selected={item.id === selectedTweet?.id}
          tweet={item}
          user={user!}
          onPress={setSelectedTweet}
        />
      );
    },
    [selectedTweet?.id, user],
  );

  // Component to show when there are no tweets
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
  }, [openTwitterApp, t, theme.colors.surfaceBlack]);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  if (!user) {
    return <View>{error}</View>;
  }

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
          onRefresh={refreshTweets}
          data={tweets}
          renderItem={renderItem}
          style={styles.tweetsList}
          ListEmptyComponent={loading ? null : EmptyComponent}
          contentContainerStyle={styles.tweetsListContainer}
        />
        {tweets.length > 0 && (
          <Button
            disabled={selectedTweet === undefined}
            mode="contained"
            color={theme.colors.surfaceBlack}
            onPress={handleConnect}
            style={styles.button}>
            <Typography.Button2 style={{ color: theme.colors.white }}>
              {t('common:next')}
            </Typography.Button2>
          </Button>
        )}
      </>
    </DView>
  );
};

export default SelectTweet;
