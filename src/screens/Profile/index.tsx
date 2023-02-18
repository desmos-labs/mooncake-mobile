import { BlurView } from '@react-native-community/blur';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { profileBack, profileScan, profileSettings } from 'assets/images';
import ImageButton from 'components/ImageButton';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  ImageBackground,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Divider, useTheme } from 'react-native-paper';
import Animated, {
  Extrapolation,
  FadeIn,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddressCopy from 'screens/Profile/components/AddressCopy';
import BadgesSection from 'screens/Profile/components/BadgesSection';
import BalanceSection from 'screens/Profile/components/BalanceSection';
import NFTsSection from 'screens/Profile/components/NFTsSection';
import PostsSection from 'screens/Profile/components/PostsSection';
import SocialAndWalletsCountersBar from 'screens/Profile/components/SocialAndWalletsCountersBar';
import UserBio from 'screens/Profile/components/UserBio';
import useProfileGivenAddress from 'hooks/useProfileGivenAddress';
import { getCoverPicture, getProfilePicture } from 'lib/ProfileUtils';
import useFollowOrUnfollowUser from 'hooks/useFollowOrUnfollowUser';
import useNavigateToProfileConnections from 'hooks/useNavigateToProfileConnections';
import useFollowersCount from 'hooks/useFollowersCount';
import useFollowingCount from 'hooks/useFollowingCount';
import useAccountBalance from 'hooks/useAccountBalance';
import useIsFollowing from 'hooks/useIsFollowing';
import useAppLinksGivenAddress from 'hooks/useAppLinksGivenAddress';
import useChainLinksGivenAddress from 'hooks/useChainLinksGivenAddress';
import ImpactPointsSection from 'screens/Profile/components/ImpactPointsSection';
import { useActiveAccountAddress } from '@recoil/accounts';
import EditProfileSection from 'screens/Profile/components/EditProfileSection';
import usePostsByAddress from 'hooks/usePostsByAddress';
import usePostsCountByAddress from 'hooks/usePostsCountByAddress';
import FollowUnfollowButton from 'components/FollowUnfollowButton';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.PROFILE | ROUTES.GUEST_PROFILE>;

const HEADER_HEIGHT_COMPACT = 95;
const HEADER_HEIGHT_EXPANDED = 60;

export interface ProfileParams {
  /**
   * Address of the profile to display.
   */
  readonly address: string;
}

/**
 * Screen that allows to display the details of a user profile.
 * @constructor
 */
const Profile = () => {
  const { t } = useTranslation('profile');
  const theme = useTheme();
  const styles = useStyles({ insets: useSafeAreaInsets() });

  const route = useRoute<NavProps['route']>();
  const navigation = useNavigation<NavProps['navigation']>();
  const { navigate, goBack } = navigation;

  const { params } = route;
  const givenAddress = params?.address;

  const [initialLoading, setInitialLoading] = useState(true);

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const activeAccountAddress = useActiveAccountAddress();
  const address = useMemo(
    () => givenAddress ?? activeAccountAddress ?? '',
    [activeAccountAddress, givenAddress],
  );

  const isActiveAccount = useMemo(
    () => address === activeAccountAddress,
    [activeAccountAddress, address],
  );

  const {
    profile,
    loading: isProfileLoading,
    refetch: refreshProfile,
  } = useProfileGivenAddress(address);

  const {
    count: followersCount,
    loading: isFollowersCountLoading,
    refetch: refreshFollowersCount,
  } = useFollowersCount(address);

  const {
    count: followageCount,
    loading: isFollowageCountLoading,
    refetch: refreshFollowageCount,
  } = useFollowingCount(address);

  const {
    balance,
    loading: isBalanceLoading,
    refetch: refreshBalance,
  } = useAccountBalance(address);

  const {
    appLinks,
    loading: areAppLinksLoading,
    refetch: refreshAppLinks,
  } = useAppLinksGivenAddress(address);

  const {
    chainLinks,
    loading: areChainLinksLoading,
    refetch: refreshChainLinks,
  } = useChainLinksGivenAddress(address);

  const { posts, loading: arePostsLoading, refetch: refreshPosts } = usePostsByAddress(address, 5);
  const { count: postsCount, refetch: refreshPostsCount } = usePostsCountByAddress(address);

  // Relationships data
  const isFollowing = useIsFollowing(address);
  const followOrUnfollowUser = useFollowOrUnfollowUser();

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  // Callback to refresh the data
  const refreshPage = useCallback(async () => {
    await refreshProfile();
    await refreshFollowageCount();
    await refreshFollowersCount();
    await refreshChainLinks();
    await refreshAppLinks();
    await refreshBalance();
    await refreshPosts();
    await refreshPostsCount();
  }, [
    refreshAppLinks,
    refreshBalance,
    refreshChainLinks,
    refreshFollowageCount,
    refreshFollowersCount,
    refreshPosts,
    refreshPostsCount,
    refreshProfile,
  ]);

  const userDataLoading = useMemo(() => {
    return isProfileLoading;
  }, [isProfileLoading]);

  // Refresh the data on the focus of the screen
  useEffect(() => {
    setInitialLoading(true);
    refreshPage().finally(() => setInitialLoading(false));
    // Suppress the warning of the next line in order to update the data only on the first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------------------------------------
  // --- Animations
  // -------------------------------------------------------------------------------------

  const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);
  // @ts-ignore
  const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);
  const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

  const scrollY = useSharedValue(0);
  const scrollOffset = useSharedValue(45 + HEADER_HEIGHT_EXPANDED);

  const animatedDTagStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [160, 200], [0, 1]);

    const translateY = interpolate(scrollY.value, [140, 200], [30, 0], {
      extrapolateRight: Extrapolation.CLAMP,
      extrapolateLeft: Extrapolation.CLAMP,
    });

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const animatedImageBGStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [-200, 0], [5, 1], {
      extrapolateRight: Extrapolation.CLAMP,
      extrapolateLeft: Extrapolation.EXTEND,
    });

    return {
      transform: [{ scale }],
    };
  });

  const animatedBlurStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [-50, 0, 50, 100], [1, 0, 0, 1]);

    return {
      opacity,
    };
  });

  const animatedProfilePicStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [0, HEADER_HEIGHT_EXPANDED], [1, 0.5], {
      extrapolateRight: Extrapolation.CLAMP,
      extrapolateLeft: Extrapolation.CLAMP,
    });

    const translateY = interpolate(scrollY.value, [0, HEADER_HEIGHT_EXPANDED], [0, 46], {
      extrapolateRight: Extrapolation.CLAMP,
      extrapolateLeft: Extrapolation.CLAMP,
    });

    const top = scrollOffset.value;
    const opacity = interpolate(scrollY.value, [0, HEADER_HEIGHT_EXPANDED], [1, 0], {
      extrapolateRight: Extrapolation.CLAMP,
      extrapolateLeft: Extrapolation.CLAMP,
    });

    return {
      opacity,
      top,
      transform: [{ translateY }, { scale }],
    };
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      const { contentOffset } = event;
      scrollOffset.value = 45 + HEADER_HEIGHT_EXPANDED - contentOffset.y;
      scrollY.value = contentOffset.y;
    },
  });

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const navigateToFollowageScreen = useNavigateToProfileConnections();

  const handlePostsSectionPressed = () => {
    navigate(ROUTES.PROFILE_POSTS, {
      userAddress: address,
      initialTabRouteName: ROUTES.PROFILE_POSTS_POSTS,
    });
  };

  const handleFollowingPressed = useCallback(() => {
    navigateToFollowageScreen(ROUTES.PROFILE_FOLLOWING, profile?.address ?? '');
  }, [navigateToFollowageScreen, profile?.address]);

  const handleFollowersPressed = useCallback(() => {
    navigateToFollowageScreen(ROUTES.PROFILE_FOLLOWERS, profile?.address ?? '');
  }, [navigateToFollowageScreen, profile?.address]);

  const handlePressFollow = useCallback(async () => {
    await followOrUnfollowUser(profile?.address ?? '');
  }, [followOrUnfollowUser, profile?.address]);

  // -------------------------------------------------------------------------------------
  // --- Child components
  // -------------------------------------------------------------------------------------

  const ConnectedChains = React.useMemo(() => {
    // Show the loading indicator
    if (areAppLinksLoading || areChainLinksLoading) {
      return (
        <View style={{ alignSelf: 'flex-start' }}>
          <ActivityIndicator color={theme.colors.surfaceBlack} />
        </View>
      );
    }

    // Show the various app links and chain links
    if (chainLinks.length > 0 || appLinks.length > 0) {
      return (
        <View>
          <SocialAndWalletsCountersBar
            loading={areAppLinksLoading || areChainLinksLoading}
            address={profile?.address ?? ''}
            chainLinks={chainLinks}
            appLinks={appLinks}
            handlePressCounters={() => navigate(ROUTES.SETTINGS)}
          />
        </View>
      );
    }

    // Nothing to show
    return undefined;
  }, [
    areAppLinksLoading,
    areChainLinksLoading,
    chainLinks,
    appLinks,
    theme.colors.surfaceBlack,
    profile?.address,
    navigate,
  ]);

  // TODO: Move the styles into useStyles
  const Banner = useMemo(() => {
    return (
      <AnimatedImageBackground
        resizeMode="cover"
        source={getCoverPicture(profile)}
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
  }, [AnimatedBlurView, AnimatedImageBackground, animatedBlurStyle, animatedImageBGStyle, profile]);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.flexCenter}>
        <ActivityIndicator color={theme.colors.surfaceBlack} />
      </SafeAreaView>
    );
  }

  if (!profile) {
    if (isProfileLoading) {
      return (
        <SafeAreaView style={styles.flexCenter}>
          <ActivityIndicator color={theme.colors.surfaceBlack} />
        </SafeAreaView>
      );
    }

    // TODO: Show an error here as the profile no longer exists
    goBack();
    return null;
  }

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(300)}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

      {/* Back button */}
      {!isActiveAccount && (
        <ImageButton
          image={profileBack}
          buttonStyle={styles.buttonStyleLeft}
          style={styles.topBarImage}
          onPress={goBack}
        />
      )}

      {/* Edit and scan buttons */}
      {isActiveAccount && (
        <>
          <ImageButton
            image={profileSettings}
            buttonStyle={[styles.buttonStyleRight, { right: 20 }]}
            style={styles.topBarImage}
            onPress={() => navigate(ROUTES.SETTINGS)}
          />
          <ImageButton
            image={profileScan}
            buttonStyle={[styles.buttonStyleRight, { right: 60 }]}
            style={styles.topBarImage}
          />
        </>
      )}

      {/* DTag */}
      <Animated.View style={[styles.animatedDtag, animatedDTagStyle]}>
        <View
          style={{
            paddingTop: theme.spacing.s,
          }}>
          <Typography.Subtitle3 numberOfLines={1} style={styles.dtag}>
            @{profile.dTag}
          </Typography.Subtitle3>
        </View>
      </Animated.View>

      {/* Banner */}
      {Banner}

      {/* Profile image */}
      <AnimatedFastImage
        source={getProfilePicture(profile)}
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

      <Animated.ScrollView
        overScrollMode="never"
        pinchGestureEnabled={false}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        refreshControl={
          <RefreshControl
            enabled={true}
            onRefresh={refreshPage}
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
          {/* Posts, following and followers counters */}
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flexDirection: 'row', right: 0, marginLeft: 'auto' }}>
              {/* Posts count */}
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Typography.Subtitle3>{postsCount}</Typography.Subtitle3>
                <Typography.Caption1>{t('posts')}</Typography.Caption1>
              </View>

              {/* Followage count */}
              <TouchableOpacity style={styles.centerLeftSpacingM} onPress={handleFollowingPressed}>
                {isFollowageCountLoading ? (
                  <ActivityIndicator size={21} color={theme.colors.surfaceBlack} />
                ) : (
                  <Typography.Subtitle3>{followageCount}</Typography.Subtitle3>
                )}
                <Typography.Caption1>{t('following')}</Typography.Caption1>
              </TouchableOpacity>

              {/* Followers count */}
              <TouchableOpacity style={styles.centerLeftSpacingM} onPress={handleFollowersPressed}>
                {isFollowersCountLoading ? (
                  <ActivityIndicator size={21} color={theme.colors.surfaceBlack} />
                ) : (
                  <Typography.Subtitle3>{followersCount}</Typography.Subtitle3>
                )}
                <Typography.Caption1>{t('followers')}</Typography.Caption1>
              </TouchableOpacity>
            </View>
          </View>

          {/* Profile nickname */}
          <Typography.H5
            style={{
              marginTop: 10,
            }}
            numberOfLines={1}>
            {profile.nickname}
          </Typography.H5>

          {/* Profile DTag */}
          <Typography.Body7
            style={{
              marginVertical: 4,
              color: theme.colors.darkGrey,
            }}
            numberOfLines={1}>
            @{profile.dTag}
          </Typography.Body7>

          {/* Profile address */}
          <AddressCopy address={address} />

          {/* Profile biography */}
          {profile?.bio && (
            <Spacer paddingVertical={theme.spacing.m}>
              <UserBio content={profile.bio} />
              {ConnectedChains}
            </Spacer>
          )}

          {/* Section to edit the profile */}
          {isActiveAccount && (
            <EditProfileSection profile={profile} chainLinks={chainLinks} appLinks={appLinks} />
          )}

          {/* Follow/Unfollow button */}
          {!isActiveAccount && (
            <FollowUnfollowButton isFollowing={isFollowing} onPress={handlePressFollow} />
          )}

          <Spacer paddingVertical={theme.spacing.s} />
          <Divider style={styles.divider} />

          {/* Lower section (balance, posts, NFTs, badges, etc) */}
          <View style={styles.container}>
            {/* Impact points */}
            {isActiveAccount && (
              <>
                <ImpactPointsSection />
                <Divider style={styles.divider} />
              </>
            )}

            {/* Balance */}
            <BalanceSection address={address} balance={balance} isLoading={isBalanceLoading} />
            {/* TODO: Add the operations section if the active user */}

            <Divider style={styles.divider} />

            {/* Posts */}
            <PostsSection
              address={address}
              posts={posts}
              loading={arePostsLoading}
              onPress={handlePostsSectionPressed}
            />
            <Divider style={styles.divider} />

            {/* NFTs */}
            <NFTsSection />

            <Divider style={styles.divider} />

            {/* Badges */}
            <BadgesSection />
          </View>
        </View>
      </Animated.ScrollView>
    </Animated.View>
  );
};

export default Profile;
