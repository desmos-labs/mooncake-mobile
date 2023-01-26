import {BlurView} from '@react-native-community/blur';
import {
  CompositeScreenProps,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {
  connectIcon,
  defaultBanner,
  profileScan,
  profileSettings,
} from 'assets/images';
import ImageButton from 'components/ImageButton';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import EnvConfig from 'config/EnvConfig';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import {BottomTabsParamList} from 'navigation/RootNavigator/BottomTabs';
import ROUTES from 'navigation/routes';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  ImageBackground,
  InteractionManager,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Divider, useTheme} from 'react-native-paper';
import Animated, {
  Extrapolation,
  FadeIn,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AddressCopy from 'screens/Profile/components/AddressCopy';
import BadgesSection from 'screens/Profile/components/BadgesSection';
import BalanceSection from 'screens/Profile/components/BalanceSection';
import ImpactPointsSection from 'screens/Profile/components/ImpactPointsSection';
import NftsSection from 'screens/Profile/components/NftsSection';
import PostsSection from 'screens/Profile/components/PostsSection';
import SocialAndWalletsCountersBar from 'screens/Profile/components/SocialAndWalletsCountersBar';
import UserBio from 'screens/Profile/components/UserBio';
import useProfileDataQueries from 'screens/Profile/useProfileDataQueries';
import useQueries from 'screens/Profile/useQueries';
import {mapConnectedChainImages} from 'screens/Profile/utils';
import useStyles from './useStyles';

type NavProps = CompositeScreenProps<
  StackScreenProps<BottomTabsParamList, ROUTES.USER_PROFILE>,
  StackScreenProps<RootNavigatorParamList>
>;

const HEADER_HEIGHT_COMPACT = 95;
const HEADER_HEIGHT_EXPANDED = 60;

const Profile = () => {
  const theme = useTheme();
  const {t} = useTranslation('profile');
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProps['navigation']>();
  const [initialLoading, setInitialLoading] = useState(true);
  const [userDataLoading, setUserDataLoading] = useState(false);
  const styles = useStyles({insets});
  const {navigate} = navigation;

  const {
    profileLoading,
    nickname,
    dtag,
    bio,
    address,
    profile_pic,
    cover_pic,
    refetchProfileData,
    numRelationships,
    numRelationshipsLoading,
    refreshNumRelationships,
  } = useProfileDataQueries();

  // refresh number of followers on screen focus
  useFocusEffect(
    React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        // Only refresh following list on focus
        refreshNumRelationships();
      });
      return () => task.cancel();
    }, [refreshNumRelationships]),
  );

  const {
    posts,
    postsData,
    postsLoading,
    convertedBalance,
    balanceData,
    balanceLoading,
    appLinks,
    chainLinks,
    appLinksLoading,
    chainLinksLoading,
    refetchAppLinks,
    refetchChainLinks,
    refetchBalance,
    refetchPosts,
    impactPoints,
    impactPointsLoading,
    refetchImpactPoints,
    postsCounter,
    refetchPostsCounter,
  } = useQueries(address);

  /**
   * Animations
   */

  const AnimatedImageBackground =
    Animated.createAnimatedComponent(ImageBackground);
  // @ts-ignore
  const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);
  const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

  const scrollY = useSharedValue(0);
  const scrollOffset = useSharedValue(45 + HEADER_HEIGHT_EXPANDED);

  const animatedDtagStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [160, 200], [0, 1]);

    const translateY = interpolate(scrollY.value, [140, 200], [30, 0], {
      extrapolateRight: Extrapolation.CLAMP,
      extrapolateLeft: Extrapolation.CLAMP,
    });

    return {
      opacity,
      transform: [{translateY}],
    };
  });

  const animatedImageBGStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [-200, 0], [5, 1], {
      extrapolateRight: Extrapolation.CLAMP,
      extrapolateLeft: Extrapolation.EXTEND,
    });

    return {
      transform: [{scale}],
    };
  });

  const animatedBlurStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [-50, 0, 50, 100], [1, 0, 0, 1]);

    return {
      opacity,
    };
  });

  const animatedProfilePicStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT_EXPANDED],
      [1, 0.5],
      {
        extrapolateRight: Extrapolation.CLAMP,
        extrapolateLeft: Extrapolation.CLAMP,
      },
    );

    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT_EXPANDED],
      [0, 46],
      {
        extrapolateRight: Extrapolation.CLAMP,
        extrapolateLeft: Extrapolation.CLAMP,
      },
    );

    const top = scrollOffset.value;
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT_EXPANDED],
      [1, 0],
      {
        extrapolateRight: Extrapolation.CLAMP,
        extrapolateLeft: Extrapolation.CLAMP,
      },
    );

    return {
      opacity,
      top,
      transform: [{translateY}, {scale}],
    };
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      const {contentOffset} = event;
      scrollOffset.value = 45 + HEADER_HEIGHT_EXPANDED - contentOffset.y;
      scrollY.value = contentOffset.y;
    },
  });

  /**
   * Handlers
   */

  const handlePostsSectionPressed = () => {
    navigate(ROUTES.PROFILE_POSTS, {
      userAddress: address!,
      initialTabsRouteName: ROUTES.PROFILE_POSTS_POSTS,
    });
  };

  const handleConnectionButtonPressed = useCallback(() => {
    navigate(ROUTES.MANAGE_CONNECTIONS_MODAL, {
      appsConnected: true,
      chainsConnected: true,
    });
  }, []);

  const refetchUserData = React.useCallback(async () => {
    await Promise.all([
      refetchProfileData(),
      refetchChainLinks(),
      refetchAppLinks(),
      refetchBalance(),
      refetchImpactPoints(),
      refetchPosts(),
      refetchPostsCounter(),
      refreshNumRelationships(),
    ]);
  }, [
    refetchProfileData,
    refetchChainLinks,
    refetchAppLinks,
    refetchBalance,
    refetchImpactPoints,
    refetchPosts,
    refetchPostsCounter,
    refreshNumRelationships,
  ]);

  const handleFollowingPressed = () =>
    navigate(ROUTES.FOLLOWING_AND_FOLLOWERS, {
      screen: ROUTES.FOLLOWING,
      params: {
        subspaceID: EnvConfig.APP_SUBSPACE_ID,
        userAddress: address,
        headerTitle: nickname.trim() || `@${dtag}`,
      },
    });

  const handleFollowersPressed = () =>
    navigate(ROUTES.FOLLOWING_AND_FOLLOWERS, {
      screen: ROUTES.FOLLOWERS,
      params: {
        subspaceID: EnvConfig.APP_SUBSPACE_ID,
        userAddress: address,
        headerTitle: nickname.trim() || `@${dtag}`,
      },
    });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (userDataLoading) {
        InteractionManager.runAfterInteractions(() => {
          refetchUserData().then(() =>
            setTimeout(() => setUserDataLoading(false), 500),
          );
        });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [userDataLoading, refetchUserData]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!profileLoading && !appLinksLoading && !chainLinksLoading) {
      timeout = setTimeout(() => setInitialLoading(false), 500);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [profileLoading, appLinksLoading, chainLinksLoading]);

  /**
   * Memoized components
   */

  const ConnectedChains = React.useMemo(() => {
    const images = [...mapConnectedChainImages(chainLinks)];

    if (images.length > 3) images.length = 3;
    if (chainLinks.length !== 0 || appLinks.length !== 0) {
      return (
        <View>
          <SocialAndWalletsCountersBar
            visitingProfile={false}
            loading={appLinksLoading && chainLinksLoading}
            connectedChainsCounter={chainLinks.length}
            twitterUsername={appLinks[0]?.username}
            connectedChainsImages={images}
            handlePressCounters={() => navigate(ROUTES.SETTINGS)}
          />
        </View>
      );
    } else if (
      chainLinks.length !== 0 ||
      appLinks.length !== 0 ||
      appLinksLoading ||
      chainLinksLoading
    ) {
      return (
        <View style={{alignSelf: 'flex-start'}}>
          <ActivityIndicator color={theme.colors.surfaceBlack} />
        </View>
      );
    }
    return undefined;
  }, [chainLinks, appLinks, appLinksLoading && chainLinksLoading]);

  const Banner = useMemo(() => {
    return (
      <AnimatedImageBackground
        resizeMode="cover"
        source={cover_pic !== '' ? {uri: cover_pic} : defaultBanner}
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            zIndex: 0,
            height: HEADER_HEIGHT_EXPANDED + HEADER_HEIGHT_COMPACT,
          },
          animatedImageBGStyle,
        ]}>
        <AnimatedBlurView
          blurType="dark"
          blurAmount={96}
          style={[
            {
              ...StyleSheet.absoluteFillObject,
              zIndex: 2,
            },
            animatedBlurStyle,
          ]}
        />
      </AnimatedImageBackground>
    );
  }, [cover_pic]);

  const Avatar = useMemo(() => {
    return (
      <AnimatedFastImage
        source={profile_pic !== '' ? {uri: profile_pic} : defaultBanner}
        style={[
          {
            zIndex: 2,
            position: 'absolute',
            width: 100,
            height: 100,
            borderRadius: 50,
            borderWidth: 3,
            left: theme.spacing.m,
            borderColor: theme.colors.white,
            backgroundColor: theme.colors.white,
          },
          animatedProfilePicStyle,
        ]}
      />
    );
  }, [profile_pic]);

  /**
   * Render section
   */

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.flexCenter}>
        <ActivityIndicator color={theme.colors.surfaceBlack} />
      </SafeAreaView>
    );
  }

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(300)}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <ImageButton
        image={profileSettings}
        buttonStyle={[styles.buttonStyleRight, {right: 20}]}
        style={styles.topBarImage}
        onPress={() => navigate(ROUTES.SETTINGS)}
      />
      <ImageButton
        image={profileScan}
        buttonStyle={[styles.buttonStyleRight, {right: 60}]}
        style={styles.topBarImage}
      />
      {/* Dtag */}
      <Animated.View style={[styles.animatedDtag, animatedDtagStyle]}>
        <View
          style={{
            paddingTop: theme.spacing.s,
          }}>
          <Typography.Subtitle3 numberOfLines={1} style={styles.dtag}>
            @{dtag}
          </Typography.Subtitle3>
        </View>
      </Animated.View>

      {/* Banner */}
      {Banner}
      {/* Profile image */}
      {Avatar}
      <Animated.ScrollView
        overScrollMode="never"
        pinchGestureEnabled={false}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        refreshControl={
          <RefreshControl
            enabled={true}
            onRefresh={() => setUserDataLoading(true)}
            refreshing={userDataLoading}
            tintColor={theme.colors.white}
          />
        }
        scrollEventThrottle={1}
        style={{
          marginTop: HEADER_HEIGHT_COMPACT,
          paddingTop: HEADER_HEIGHT_EXPANDED,
        }}>
        <View style={styles.contentContainer}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'row', right: 0, marginLeft: 'auto'}}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Typography.Subtitle3>{postsCounter || 0}</Typography.Subtitle3>
                <Typography.Caption1>{t('posts')}</Typography.Caption1>
              </View>
              <TouchableOpacity
                style={styles.centerLeftSpacingM}
                onPress={handleFollowingPressed}>
                {numRelationshipsLoading ? (
                  <ActivityIndicator
                    size={21}
                    color={theme.colors.surfaceBlack}
                  />
                ) : (
                  <Typography.Subtitle3>
                    {numRelationships?.numFollowing}
                  </Typography.Subtitle3>
                )}
                <Typography.Caption1>{t('following')}</Typography.Caption1>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.centerLeftSpacingM}
                onPress={handleFollowersPressed}>
                {numRelationshipsLoading ? (
                  <ActivityIndicator
                    size={21}
                    color={theme.colors.surfaceBlack}
                  />
                ) : (
                  <Typography.Subtitle3>
                    {numRelationships?.numFollowers}
                  </Typography.Subtitle3>
                )}
                <Typography.Caption1>{t('followers')}</Typography.Caption1>
              </TouchableOpacity>
            </View>
          </View>
          <Typography.H5
            style={{
              marginTop: 10,
            }}
            numberOfLines={1}>
            {nickname}
          </Typography.H5>

          <Typography.Body7
            style={{
              marginVertical: 4,
              color: theme.colors.darkGrey,
            }}
            numberOfLines={1}>
            @{dtag}
          </Typography.Body7>

          <AddressCopy address={address} />

          <Spacer paddingVertical={theme.spacing.m}>
            <UserBio content={bio} />
            {ConnectedChains}
          </Spacer>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigate(ROUTES.EDIT_PROFILE)}>
              <Typography.Subtitle4>{t('edit profile')}</Typography.Subtitle4>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConnectionButtonPressed}
              style={{
                backgroundColor: theme.colors.surfaceGrey,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
                height: 35,
                width: 40,
              }}>
              <FastImage
                source={connectIcon}
                style={{height: 22, width: 22}}
                tintColor={theme.colors.surfaceBlack}
              />
            </TouchableOpacity>
          </View>

          <Spacer paddingVertical={theme.spacing.s} />
          <Divider style={styles.divider} />
          <View style={styles.container}>
            <>
              <ImpactPointsSection
                impactPoints={impactPoints}
                impactPointsLoading={impactPointsLoading}
              />
              <Divider style={styles.divider} />
            </>
            <BalanceSection
              address={address!}
              balanceData={balanceData}
              balanceLoading={balanceLoading}
              convertedBalance={convertedBalance}
            />
            <Divider style={styles.divider} />
            <PostsSection
              onPress={handlePostsSectionPressed}
              posts={posts}
              postsData={postsData}
              postsLoading={postsLoading}
            />
            <Divider style={styles.divider} />
            <NftsSection />
            <Divider style={styles.divider} />
            <BadgesSection />
          </View>
        </View>
      </Animated.ScrollView>
    </Animated.View>
  );
};

export default Profile;
