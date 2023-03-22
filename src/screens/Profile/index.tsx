import { BlurView } from '@react-native-community/blur';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { profileBack, profileSettings } from 'assets/images';
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
  InteractionManager,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Divider, useTheme } from 'native-base';
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
import BalanceSection from 'screens/Profile/components/BalanceSection';
import PostsSection from 'screens/Profile/components/PostsSection';
import SocialAndWalletsCountersBar from 'screens/Profile/components/SocialAndWalletsCountersBar';
import UserBio from 'screens/Profile/components/UserBio';
import useProfileGivenAddress from 'hooks/profiles/useProfileGivenAddress';
import { getCoverPicture, getProfilePicture } from 'lib/ProfileUtils';
import useFollowOrUnfollowUser from 'hooks/relationships/useFollowOrUnfollowUser';
import useNavigateToProfileConnections from 'hooks/navigation/useNavigateToProfileConnections';
import useFollowersCount from 'hooks/relationships/useFollowersCount';
import useFollowingCount from 'hooks/relationships/useFollowingCount';
import useAccountBalance from 'hooks/balance/useAccountBalance';
import useIsFollowing from 'hooks/relationships/useIsFollowing';
import useAppLinksGivenAddress from 'hooks/profiles/applinks/useAppLinksGivenAddress';
import { useActiveAccountAddress } from '@recoil/accounts';
import EditProfileSection from 'screens/Profile/components/EditProfileSection';
import usePostsByAddress from 'hooks/posts/usePostsByAddress';
import usePostsCountByAddress from 'hooks/posts/usePostsCountByAddress';
import FollowUnfollowButton from 'components/FollowUnfollowButton';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.PROFILE | ROUTES.GUEST_PROFILE>;

export const HEADER_HEIGHT_COMPACT = 95;
export const HEADER_HEIGHT_EXPANDED = 60;

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

  const { posts, loading: arePostsLoading, refetch: refreshPosts } = usePostsByAddress(address, 5);
  const { count: postsCount, refetch: refreshPostsCount } = usePostsCountByAddress(address);

  // Relationships data
  const isFollowing = useIsFollowing(address);
  const followOrUnfollowUser = useFollowOrUnfollowUser();

  // -------------------------------------------------------------------------------------
  // --- Local state
  // -------------------------------------------------------------------------------------

  const [pageRefreshing, setPageRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  // Callback to refresh the data
  const refreshPage = useCallback(async () => {
    setPageRefreshing(true);
    await refreshProfile();
    await refreshFollowageCount();
    await refreshFollowersCount();
    await refreshAppLinks();
    await refreshBalance();
    await refreshPosts();
    await refreshPostsCount();
    setPageRefreshing(false);
  }, [
    refreshAppLinks,
    refreshBalance,
    refreshFollowageCount,
    refreshFollowersCount,
    refreshPosts,
    refreshPostsCount,
    refreshProfile,
  ]);

  // Refresh the data on the focus of the screen
  useEffect(() => {
    setInitialLoading(true);
    refreshPage().finally(() => setInitialLoading(false));
    // Suppress the warning of the next line in order to update the data only on the first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh the data when using pull to refresh gesture. Please note, this trick is needed because
  // we need to manage animations in a smooth way.
  // If we use a classic pull to refresh technique, the animation will look weird lagging and behaving badly
  // Interaction Manager is used to manage the animation in a smooth way waiting for the end of all the previous interactions
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (pageRefreshing) {
        InteractionManager.runAfterInteractions(() => {
          refreshPage().finally(() => setTimeout(() => setPageRefreshing(false), 500));
        });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [pageRefreshing, refreshPage]);

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
    await followOrUnfollowUser(profile!);
  }, [followOrUnfollowUser, profile]);

  // -------------------------------------------------------------------------------------
  // --- Child components
  // -------------------------------------------------------------------------------------

  // TODO: Removed from the beta version
  const ConnectedApps = React.useMemo(() => {
    // Show the loading indicator
    if (areAppLinksLoading) {
      return (
        <View style={styles.flexStart}>
          <ActivityIndicator color={theme.colors.surfaceBlack} />
        </View>
      );
    }

    // Show the various app links and chain links
    if (appLinks.length > 0) {
      return (
        <View>
          <SocialAndWalletsCountersBar
            loading={areAppLinksLoading}
            address={profile?.address ?? ''}
            chainLinks={[]}
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
    appLinks,
    styles.flexStart,
    theme.colors.surfaceBlack,
    profile?.address,
    navigate,
  ]);

  // Banner image needs to be memoized to avoid flickering
  const Banner = useMemo(() => {
    return (
      <AnimatedImageBackground
        resizeMode="cover"
        source={getCoverPicture(profile)}
        style={[styles.banner, animatedImageBGStyle]}>
        <AnimatedBlurView
          blurType="dark"
          blurAmount={96}
          style={[styles.bannerBlur, animatedBlurStyle]}
        />
      </AnimatedImageBackground>
    );
  }, [
    AnimatedBlurView,
    AnimatedImageBackground,
    animatedBlurStyle,
    animatedImageBGStyle,
    profile,
    styles.banner,
    styles.bannerBlur,
  ]);

  // Profile image needs to be memoized to avoid flickering
  const ProfileImage = useMemo(() => {
    return (
      <AnimatedFastImage
        source={getProfilePicture(profile)}
        style={[styles.profileImage, animatedProfilePicStyle]}
      />
    );
  }, [AnimatedFastImage, animatedProfilePicStyle, profile, styles.profileImage]);

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

    // TODO: Show an error here as the profile no longer exists -> Waiting for the design
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
        <ImageButton
          image={profileSettings}
          buttonStyle={[styles.buttonStyleRight, styles.r20]}
          style={styles.topBarImage}
          onPress={() => navigate(ROUTES.SETTINGS)}
        />
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
      {ProfileImage}

      <Animated.ScrollView
        overScrollMode="never"
        pinchGestureEnabled={false}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        refreshControl={
          <RefreshControl
            enabled={true}
            onRefresh={() => setPageRefreshing(true)}
            refreshing={pageRefreshing}
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
          <View style={styles.flexRow}>
            <View style={styles.innerContainer}>
              {/* Posts count */}
              <TouchableOpacity style={styles.postCount} onPress={handlePostsSectionPressed}>
                <Typography.Subtitle3>{postsCount}</Typography.Subtitle3>
                <Typography.Caption1>{t('posts')}</Typography.Caption1>
              </TouchableOpacity>

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
          <Typography.H5 style={styles.nickname} numberOfLines={1}>
            {profile.nickname}
          </Typography.H5>

          {/* Profile Dtag */}
          <Typography.Body7 style={styles.profileDtag} numberOfLines={1}>
            @{profile.dTag}
          </Typography.Body7>

          {/* Profile address */}
          <AddressCopy address={address} />

          {/* Profile biography */}
          {profile?.bio && (
            <Spacer paddingVertical={theme.spacing.m}>
              <UserBio content={profile.bio} />
              {ConnectedApps}
            </Spacer>
          )}

          {/* Section to edit the profile */}
          {isActiveAccount && <EditProfileSection profile={profile} appLinks={appLinks} />}

          {/* Follow/Unfollow button */}
          {!isActiveAccount && (
            <FollowUnfollowButton isFollowing={isFollowing} onPress={handlePressFollow} />
          )}

          <Spacer paddingVertical={theme.spacing.s} />
          <Divider style={styles.divider} />

          {/* Lower section (balance, posts, NFTs, badges, etc) */}
          <View style={styles.container}>
            {/* Balance */}
            <BalanceSection address={address} balance={balance} isLoading={isBalanceLoading} />

            <Divider style={styles.divider} />

            {/* Posts */}
            <PostsSection
              address={address}
              posts={posts}
              loading={arePostsLoading}
              onPress={handlePostsSectionPressed}
            />
          </View>
        </View>
      </Animated.ScrollView>
    </Animated.View>
  );
};

export default Profile;
