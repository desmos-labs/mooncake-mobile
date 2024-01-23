import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { useActiveAccountAddress } from '@recoil/accounts';
import * as WebBrowser from '@toruslabs/react-native-web-browser';
import {
  block,
  profileBack,
  profileContextButton,
  reportIcon,
  settingsButton,
  tipUserIcon,
  unblock,
} from 'assets/images';
import AnimatedCoverPicture from 'components/AnimatedCoverPicture';
import TipUserBottomSheet from 'components/BottomSheets/TipUser';
import Button from 'components/Button';
import MooncakeLoader from 'components/Loaders/MooncakeLoader';
import PopupMenu from 'components/PopupMenu';
import ProfileHeaderButton from 'components/ProfileHeaderButton';
import Spacer from 'components/Spacer';
import StyledSpinner from 'components/StyledSpinner';
import CommonStyles from 'config/theme/CommonStyles';
import { ImageSource } from 'expo-image';
import useAccountBalance from 'hooks/balance/useAccountBalance';
import useShowBottomSheet from 'hooks/bottomsheets/useShowBottomSheet';
import useGetStatusBarColorFromImage from 'hooks/colors/useGetStatusBarColorFromImage';
import useSetStatusBarDarkOnImageFullScreen from 'hooks/colors/useSetStatusBarDarkOnImageFullScreen';
import useSetStatusBarStyle from 'hooks/colors/useSetStatusBarStyle';
import useNavigateToProfileConnections from 'hooks/navigation/useNavigateToProfileConnections';
import usePostsByAddress from 'hooks/posts/usePostsByAddress';
import usePostsCountByAddress from 'hooks/posts/usePostsCountByAddress';
import useProfileGivenAddress from 'hooks/profiles/useProfileGivenAddress';
import useBlockOrUnblockUser from 'hooks/relationships/useBlockOrUnblockUser';
import useFollowersCount from 'hooks/relationships/useFollowersCount';
import useFollowingCount from 'hooks/relationships/useFollowingCount';
import useIsBlocked from 'hooks/relationships/useIsBlocked';
import useIsFollowing from 'hooks/relationships/useIsFollowing';
import { getCoverPicture, getProfilePicture } from 'lib/ProfileUtils';
import { useTheme } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  InteractionManager,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageView from 'react-native-image-viewing';
import Reanimated, {
  FadeIn,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddressCopy from 'screens/Profile/components/AddressCopy';
import AnimatedProfilePicture from 'screens/Profile/components/AnimatedProfilePicture';
import BalanceSection from 'screens/Profile/components/BalanceSection';
import Biography from 'screens/Profile/components/Biography';
import EditProfileSection from 'screens/Profile/components/EditProfileSection';
import PostsSection from 'screens/Profile/components/PostsSection';
import ToggleFollowageButton from 'components/ToggleFollowageButton';
import useStyles, {
  PROFILE_HEADER_HEIGHT,
  PROFILE_HEADER_HEIGHT_COMPACT,
  PROFILE_HEADER_HEIGHT_EXPANDED,
} from './useStyles';

const AnimatedView = Reanimated.createAnimatedComponent(View);
const AnimatedScrollView = Reanimated.createAnimatedComponent(ScrollView);
const AnimatedPressable = Reanimated.createAnimatedComponent(Pressable);

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.PROFILE | ROUTES.GUEST_PROFILE>;

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
  const insets = useSafeAreaInsets();
  const route = useRoute<NavProps['route']>();
  const navigation = useNavigation<NavProps['navigation']>();
  const { navigate, goBack, pop } = navigation;

  const { params } = route;
  const givenAddress = params?.address;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  // Memoized values
  const activeAccountAddress = useActiveAccountAddress();
  const address = useMemo(
    () => givenAddress ?? activeAccountAddress ?? '',
    [activeAccountAddress, givenAddress],
  );

  const isActiveAccount = useMemo(
    () => address === activeAccountAddress,
    [activeAccountAddress, address],
  );
  const styles = useStyles({ insets, isActiveAccount });

  const {
    profile,
    profileError,
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

  const { posts, loading: arePostsLoading, refetch: refreshPosts } = usePostsByAddress(address, 5);
  const { count: postsCount, refetch: refreshPostsCount } = usePostsCountByAddress(address);

  // Relationships data
  const { refetch: refreshFollowing } = useIsFollowing(address);

  const { isBlocked, refetch: refreshIsBlocked } = useIsBlocked(address);
  const blockOrUnblockUser = useBlockOrUnblockUser();

  // -------------------------------------------------------------------------------------
  // --- Local state
  // -------------------------------------------------------------------------------------

  const [pageRefreshing, setPageRefreshing] = useState(false);
  // Fullscreen image
  const [fullscreenImage, setFullscreenImage] = useState({
    image: {} as ImageSource,
    isVisible: false,
  });

  // -------------------------------------------------------------------------------------
  // --- useCallback(
  // -------------------------------------------------------------------------------------

  const openSettings = useCallback(() => {
    navigation.navigate(ROUTES.SETTINGS);
  }, [navigation]);

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  // Callback to refresh the data
  const refreshPage = useCallback(async () => {
    setPageRefreshing(true);

    await refreshFollowing();
    await refreshIsBlocked();
    await refreshProfile();
    await refreshFollowageCount();
    await refreshFollowersCount();
    await refreshBalance();
    await refreshPosts();
    await refreshPostsCount();
    setPageRefreshing(false);
  }, [
    refreshBalance,
    refreshFollowageCount,
    refreshFollowersCount,
    refreshFollowing,
    refreshIsBlocked,
    refreshPosts,
    refreshPostsCount,
    refreshProfile,
  ]);

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
  const opacity = useSharedValue(0);
  const scrollOffset = useSharedValue(40 + PROFILE_HEADER_HEIGHT_EXPANDED);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });
  const scrollY = useSharedValue(1);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: scrollEvent => {
      const { contentOffset } = scrollEvent;
      scrollOffset.value = 40 + PROFILE_HEADER_HEIGHT_EXPANDED - contentOffset.y;
      scrollY.value = contentOffset.y;
    },
  });

  const animatedPressableStyle = useAnimatedStyle(() => {
    return {
      height:
        PROFILE_HEADER_HEIGHT - scrollY.value >= PROFILE_HEADER_HEIGHT_COMPACT
          ? PROFILE_HEADER_HEIGHT - scrollY.value
          : PROFILE_HEADER_HEIGHT_COMPACT,
    };
  });

  // Animate opacity
  useEffect(() => {
    opacity.value = withDelay(500, withTiming(1));
  }, [address, opacity, profile]);

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------
  const { statusBarStyle } = useGetStatusBarColorFromImage(profile?.coverPicture);
  useSetStatusBarStyle(statusBarStyle);
  useSetStatusBarDarkOnImageFullScreen(statusBarStyle, fullscreenImage.isVisible);

  const navigateToFollowageScreen = useNavigateToProfileConnections();

  const handlePostsSectionPressed = () => {
    navigate(ROUTES.PROFILE_POSTS, {
      userAddress: address,
      initialTabRouteName: ROUTES.PROFILE_POSTS_POSTS,
    });
  };

  const handleFollowingPressed = useCallback(() => {
    navigateToFollowageScreen(ROUTES.PROFILE_FOLLOWING, profile);
  }, [navigateToFollowageScreen, profile]);

  const handleFollowersPressed = useCallback(() => {
    navigateToFollowageScreen(ROUTES.PROFILE_FOLLOWERS, profile);
  }, [navigateToFollowageScreen, profile]);

  const handlePressBlock = useCallback(async () => {
    // This assertion is necessary, otherwise it will throw a ts error
    await blockOrUnblockUser(profile!);
  }, [blockOrUnblockUser, profile]);

  const handlePressBalanceInfo = useCallback(() => {
    navigate(ROUTES.CONFIRM_MODAL, {
      title: t('DSM', { ns: 'common' }),
      // Subtitle needs to be passed as a component, as Trans component in the default implementation will cause
      // unwanted interpolation of the less than (<) character in the string
      subtitle: <Typography.Regular16>{t('balanceInfo')}</Typography.Regular16>,
      subtitleStyle: { textAlign: 'left' },
      primaryButtonLabel: t('learnMore'),
      onPressPrimary: () => {
        WebBrowser.openBrowserAsync('https://desmos.network');
      },
      secondaryButtonLabel: t('cancel', { ns: 'common' }),
      // goBack will make the underlying screen goBack, instead of hiding the modal, so pop is used instead.
      onPressSecondary: pop,
    });
  }, [t, navigate, pop]);

  const { show: showBottomSheet } = useShowBottomSheet();
  const tipUser = useCallback(() => {
    showBottomSheet(TipUserBottomSheet, {
      toTipUserAddress: address,
    });
  }, [address, showBottomSheet]);

  // -------------------------------------------------------------------------------------
  // --- Memoized values
  // -------------------------------------------------------------------------------------
  // This section will only be rendered if visiting another user's profile
  const ProfileInteractionButton = React.useMemo(() => {
    if (!isActiveAccount) {
      // if the user is blocked, show the unblock button, otherwise show a follow or unfollow button
      if (isBlocked) {
        return <Button onPress={handlePressBlock}>{t('unblock', { ns: 'relationships' })}</Button>;
      }
      return (
        <View style={styles.followUnfollowSection}>
          <ToggleFollowageButton user={profile!} style={[CommonStyles.flex['1']]} />
          <Spacer paddingLeft="s" />
          <Button onPress={tipUser} height={32} style={[styles.btStyle, styles.tipStyle]}>
            <Image style={styles.tipUserIcon} source={tipUserIcon} />
            <Typography.Regular14>{t('tip')}</Typography.Regular14>
          </Button>
        </View>
      );
    }
    return undefined;
  }, [
    handlePressBlock,
    isActiveAccount,
    isBlocked,
    profile,
    styles.btStyle,
    styles.followUnfollowSection,
    styles.tipStyle,
    styles.tipUserIcon,
    t,
    tipUser,
  ]);

  // -------------------------------------------------------------------------------------
  // --- Conditional rendering
  // -------------------------------------------------------------------------------------
  const PopupContextMenu = React.useMemo(() => {
    // Don't show PopupMenu if active user
    if (isActiveAccount) {
      return undefined;
    }

    const menuItems = [
      {
        label: t('report', { ns: 'postOperations' }),
        onPress: () => {
          // implement
        },
        icon: reportIcon,
      },
      {
        label: isBlocked
          ? t('unblock', { ns: 'relationships' })
          : t('block', { ns: 'relationships' }),
        onPress: () => handlePressBlock(),
        icon: isBlocked ? unblock : block,
      },
    ];

    return (
      <PopupMenu
        menuItems={menuItems}
        menuIcon={profileContextButton}
        menuIconStyle={styles.contextButtonStyle}
      />
    );
  }, [handlePressBlock, isActiveAccount, isBlocked, styles.contextButtonStyle, t]);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  if (!profile) {
    // We also check the profileError field because the profile becomes
    // defined after the isProfileLoading becomes false.
    if (isProfileLoading || profileError === undefined) {
      return (
        <SafeAreaView style={styles.flexCenter}>
          <MooncakeLoader speed={3} />
        </SafeAreaView>
      );
    }

    // TODO: Show an error here as the profile no longer exists -> Waiting for the design
    goBack();
    return null;
  }

  return (
    <AnimatedView style={styles.root} entering={FadeIn.duration(500)}>
      {/* Fake Android statusbar */}
      {Platform.OS === 'android' && (
        <View
          style={{
            backgroundColor: theme.colors.black,
            height: insets.top,
          }}
        />
      )}
      <AnimatedView style={[styles.topBarView, animatedStyle]}>
        <View style={styles.topButtonsContainer}>
          {!isActiveAccount && (
            <ProfileHeaderButton
              image={profileBack}
              style={styles.topButton}
              containerStyle={styles.topButton}
              onPress={goBack}
            />
          )}
          {isActiveAccount && (
            <ProfileHeaderButton
              image={settingsButton}
              style={styles.topButton}
              containerStyle={styles.topButtonRight}
              onPress={openSettings}
            />
          )}
        </View>
        <View>{PopupContextMenu}</View>
      </AnimatedView>
      {/* Cover picture fake pressable */}
      <AnimatedPressable
        style={[styles.coverPicturePressable, animatedPressableStyle]}
        onTouchStart={() =>
          setFullscreenImage({ image: getCoverPicture(profile), isVisible: true })
        }
      />
      <AnimatedCoverPicture
        picture={getCoverPicture(profile)}
        scrollY={scrollY}
        heightFixed={PROFILE_HEADER_HEIGHT}
        cachePolicy="memory-disk"
      />
      {/* User's profile picture */}
      <AnimatedProfilePicture
        picture={getProfilePicture(profile)}
        scrollY={scrollY}
        scrollOffset={scrollOffset}
        cachePolicy="memory-disk"
        onPress={() => setFullscreenImage({ image: getProfilePicture(profile), isVisible: true })}
      />
      <AnimatedScrollView
        onStartShouldSetResponder={() => true}
        refreshControl={
          <RefreshControl
            refreshing={pageRefreshing}
            onRefresh={refreshPage}
            tintColor={theme.colors.white}
            colors={[theme.colors.black]}
          />
        }
        onScroll={scrollHandler}
        style={styles.scrollView}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.contentContainerStyle}
        scrollEventThrottle={16}>
        <View style={styles.contentView}>
          <View style={styles.innerContainer}>
            {/* Posts, following and followers counters */}
            <View style={styles.innerTopSection}>
              <View style={CommonStyles.flex['1']}>
                {/* Profile nickname */}
                <Typography.Semibold20 style={styles.nickname} numberOfLines={1}>
                  {profile.nickname}
                </Typography.Semibold20>
                {/* Profile Dtag */}
                <Typography.Regular12 style={styles.profileDtag} numberOfLines={1}>
                  @{profile.dTag}
                </Typography.Regular12>
                {/* Profile address */}
                <AddressCopy address={address} />
                {/* Profile biography */}
              </View>
              <View style={styles.rightButtonsContainer}>
                {/* Posts count */}
                <TouchableOpacity style={styles.postCount} onPress={handlePostsSectionPressed}>
                  <Typography.Semibold14>{postsCount}</Typography.Semibold14>
                  <Typography.Regular12>{t('posts')}</Typography.Regular12>
                </TouchableOpacity>
                {/* Followage count */}
                <TouchableOpacity
                  style={styles.centerLeftSpacingM}
                  onPress={handleFollowingPressed}>
                  {isFollowageCountLoading ? (
                    <StyledSpinner size={21} />
                  ) : (
                    <Typography.Semibold14>{followageCount}</Typography.Semibold14>
                  )}
                  <Typography.Regular12>{t('following')}</Typography.Regular12>
                </TouchableOpacity>
                {/* Followers count */}
                <TouchableOpacity
                  style={styles.centerLeftSpacingM}
                  onPress={handleFollowersPressed}>
                  {isFollowersCountLoading ? (
                    <StyledSpinner size={21} />
                  ) : (
                    <Typography.Semibold14>{followersCount}</Typography.Semibold14>
                  )}
                  <Typography.Regular12>{t('followers')}</Typography.Regular12>
                </TouchableOpacity>
              </View>
            </View>
            {profile?.bio && (
              <Spacer paddingVertical="s">
                <Biography text={profile.bio} numberOfLines={3} />
              </Spacer>
            )}
            {/* Section to edit the profile */}
            {isActiveAccount && <EditProfileSection profile={profile} />}
            {/* Follow/Unfollow button */}
            {ProfileInteractionButton}
            <Spacer paddingVertical={theme.spacing.s} />
            {/* Lower section (balance, posts, NFTs, badges, etc) */}
            <View style={styles.container}>
              {/* Balance, visibile only if displaing the current active account's profile */}
              {isActiveAccount && (
                <>
                  <BalanceSection
                    address={address}
                    balance={balance}
                    isLoading={isBalanceLoading}
                    handlePressBalanceInfo={handlePressBalanceInfo}
                  />
                  <View style={styles.divider} />
                </>
              )}
              {/* Posts */}
              <PostsSection
                address={address}
                posts={posts}
                loading={arePostsLoading}
                onPress={handlePostsSectionPressed}
              />
            </View>
          </View>
        </View>
      </AnimatedScrollView>
      <ImageView
        presentationStyle="fullScreen"
        images={[fullscreenImage.image]}
        imageIndex={0}
        visible={fullscreenImage.isVisible}
        onRequestClose={() =>
          setFullscreenImage({
            image: {},
            isVisible: false,
          })
        }
      />
    </AnimatedView>
  );
};

export default Profile;
