import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { useActiveAccountAddress } from '@recoil/accounts';
import {
  block,
  profileBack,
  profileContextButton,
  reportIcon,
  tipUserIcon,
  unblock,
} from 'assets/images';
import AnimatedCoverPicture from 'components/AnimatedCoverPicture';
import TipUserBottomSheet from 'components/BottomSheets/TipUser';
import Button from 'components/Button';
import DView from 'components/DView';
import MooncakeLoader from 'components/Loaders/MooncakeLoader';
import PopupMenu from 'components/PopupMenu';
import ProfileHeaderButton from 'components/ProfileHeaderButton';
import Spacer from 'components/Spacer';
import ToggleFollowageButton from 'components/ToggleFollowageButton';
import CommonStyles from 'config/theme/CommonStyles';
import { ImageSource } from 'expo-image';
import useShowBottomSheet from 'hooks/bottomsheets/useShowBottomSheet';
import useGetStatusBarColorFromImage from 'hooks/colors/useGetStatusBarColorFromImage';
import useSetStatusBarDarkOnImageFullScreen from 'hooks/colors/useSetStatusBarDarkOnImageFullScreen';
import useSetStatusBarStyle from 'hooks/colors/useSetStatusBarStyle';
import useNavigateToProfileConnections from 'hooks/navigation/useNavigateToProfileConnections';
import usePostsByAddress from 'hooks/posts/usePostsByAddress';
import useProfileGivenAddress from 'hooks/profiles/useProfileGivenAddress';
import useBlockOrUnblockUser from 'hooks/relationships/useBlockOrUnblockUser';
import { getCoverPicture, getProfilePicture } from 'lib/ProfileUtils';
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
import AnimatedProfilePicture from 'screens/Profile/components/AnimatedProfilePicture';
import Biography from 'screens/Profile/components/Biography';
import EditProfileSection from 'screens/Profile/components/EditProfileSection';
import PostsSection from 'screens/Profile/components/PostsSection';
import useStyles, { PROFILE_HEADER_HEIGHT, PROFILE_HEADER_HEIGHT_COMPACT } from './useStyles';

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
  const { navigate, goBack } = navigation;

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

  const { posts, loading: arePostsLoading, refetch: refreshPosts } = usePostsByAddress(address, 25);

  const blockOrUnblockUser = useBlockOrUnblockUser();

  // -------------------------------------------------------------------------------------
  // --- Local state
  // -------------------------------------------------------------------------------------
  const [popupMenuOpened, setPopupMenuOpened] = useState(false);
  const [pageRefreshing, setPageRefreshing] = useState(false);
  // Fullscreen image
  const [fullscreenImage, setFullscreenImage] = useState({
    image: {} as ImageSource,
    isVisible: false,
  });

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  /**
   * Function to refresh the page
   */
  const refreshPage = useCallback(async () => {
    setPageRefreshing(true);
    requestAnimationFrame(async () => {
      setTimeout(async () => {
        await refreshProfile().then(() => {
          refreshPosts();
        });
        InteractionManager.runAfterInteractions(() => {
          setPageRefreshing(false);
        });
      }, 250);
    });
  }, [refreshPosts, refreshProfile]);

  // -------------------------------------------------------------------------------------
  // --- Animations
  // -------------------------------------------------------------------------------------
  const opacity = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });
  const scrollY = useSharedValue(1);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: scrollEvent => {
      const { contentOffset } = scrollEvent;
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
    if (!isActiveAccount && profile) {
      // if the user is blocked, show the unblock button, otherwise show a follow or unfollow button
      if (profile.isBlockedByUser) {
        return <Button onPress={handlePressBlock}>{t('unblock', { ns: 'relationships' })}</Button>;
      }
      return (
        <View style={styles.followUnfollowSection}>
          <ToggleFollowageButton user={profile} style={[CommonStyles.flex['1']]} />
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
        label: profile?.isBlockedByUser
          ? t('unblock', { ns: 'relationships' })
          : t('block', { ns: 'relationships' }),
        onPress: () => handlePressBlock(),
        icon: profile?.isBlockedByUser ? unblock : block,
      },
    ];

    return (
      <PopupMenu
        menuItems={menuItems}
        popupMenuOpened={popupMenuOpened}
        setPopupMenuOpened={setPopupMenuOpened}
      />
    );
  }, [
    popupMenuOpened,
    setPopupMenuOpened,
    handlePressBlock,
    isActiveAccount,
    profile?.isBlockedByUser,
    t,
  ]);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  if (!profile) {
    // We also check the profileError field because the profile becomes
    // defined after the isProfileLoading becomes false.
    if (isProfileLoading || profileError === undefined) {
      return (
        <DView
          disableHideKeyboardTouchable={true}
          backgroundColor={theme.colors.white}
          edges={['top']}
          style={styles.flexCenter}>
          <MooncakeLoader speed={3} />
        </DView>
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
        {!isActiveAccount && (
          <>
            <View style={styles.topButtonsContainer}>
              <ProfileHeaderButton
                image={profileBack}
                style={styles.topButton}
                containerStyle={styles.topButton}
                onPress={goBack}
              />
              <ProfileHeaderButton
                image={profileContextButton}
                style={styles.topButton}
                containerStyle={styles.topButton}
                onPress={() => setPopupMenuOpened(prev => !prev)}
              />
            </View>
            {PopupContextMenu}
          </>
        )}
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
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={1}>
        <View style={styles.contentView}>
          <View style={styles.innerContainer}>
            {/* Posts, following and followers counters */}
            <View style={styles.innerTopSection}>
              <View style={CommonStyles.flex['1']}>
                {/* Profile nickname */}
                <Typography.Semibold20 style={styles.nickname} numberOfLines={1}>
                  {profile.nickname}
                </Typography.Semibold20>
                {/* Profile DTag */}
                <Typography.Regular12 style={styles.profileDtag} numberOfLines={1}>
                  @{profile.dTag}
                </Typography.Regular12>
              </View>
              {profile?.bio && (
                <Spacer paddingVertical="s">
                  <Biography text={profile.bio} numberOfLines={3} />
                </Spacer>
              )}
              <View style={styles.profileConnectionsButtonContainer}>
                {/* Followers count */}
                <TouchableOpacity style={styles.connectionButton} onPress={handleFollowersPressed}>
                  <Typography.Semibold16>{profile.followersCount}</Typography.Semibold16>
                  <Typography.Regular14>{t('followers')}</Typography.Regular14>
                </TouchableOpacity>
                {/* Followage count */}
                <TouchableOpacity style={styles.connectionButton} onPress={handleFollowingPressed}>
                  <Typography.Semibold16>{profile.followingCount}</Typography.Semibold16>
                  <Typography.Regular14>{t('following')}</Typography.Regular14>
                </TouchableOpacity>
              </View>
            </View>
            {/* Section to edit the profile */}
            {isActiveAccount && <EditProfileSection profile={profile} />}
            {/* Follow/Unfollow button */}
            {ProfileInteractionButton}
            {/* Lower section (balance, posts, NFTs, badges, etc) */}
            <View style={styles.container}>
              {/* Posts */}
              <PostsSection
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
