import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {
  connectedAppsState,
  useGetConnectedAppsPolling,
} from '@recoil/connectedApps';
import {isFollowingAddr} from '@recoil/following';
import useNumRelationships from '@recoil/numRelationshipState';
import {
  defaultBanner,
  defaultProfilePic,
  editButton,
  followedIcon,
  followIcon,
} from 'assets/images';
import Button from 'components/Button';
import ImageButton from 'components/ImageButton';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import EnvConfig from 'config/EnvConfig';
import useActiveAccount from 'hooks/useActiveAccount';
import useChainLinks from 'hooks/useChainLinks';
import useProfileDataGivenAddress from 'hooks/useProfileDataGivenAddress';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  RefreshControl,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Snackbar, useTheme} from 'react-native-paper';
import Animated, {
  FadeIn,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRecoilState, useRecoilValue} from 'recoil';
import Loading from 'screens/Following/components/Loading/Loading';
import ChainsCountersBar from 'screens/Profile/components/ChainsCountersBar';
import ProfileSectionButton from 'screens/Profile/components/ProfileSectionButton';
import {
  mapConnectedAppImages,
  mapConnectedChainImages,
} from 'screens/Profile/utils';
import useFollowOrUnfollow from 'services/axios/requests/CentralizedBroadcastTx/useFollowOrUnfollow';
import {usePollProfileData} from '@recoil/activeProfileState';
import AddressCopy from './components/AddressCopy';
import ProfileHeader from './components/ProfileHeader';
import SocialCounter from './components/SocialCounter';
import UserBio from './components/UserBio';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.USER_PROFILE>;

export interface UserProfileParams {
  visitingProfileAddress?: string;
}

const Profile = () => {
  const theme = useTheme();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const {t} = useTranslation('profile');
  const styles = useStyles();
  const {navigate, goBack} = useNavigation<NavProps['navigation']>();
  const {params} = useRoute<NavProps['route']>();
  const {top} = useSafeAreaInsets();
  const {chainLinks} = useChainLinks();
  const [connectedApps] = useRecoilState(connectedAppsState);
  const [globalLoading, setGlobalLoading] = useState(true);
  useGetConnectedAppsPolling();

  /** Animations start
   * These hooks act as the animation driver for the ProfileHeader component
   * The actual animations are created in the component itself.
   * */
  const scrollProgress = useSharedValue(0);
  const scrollOffset = useSharedValue(0);
  const AVATAR_TOP_OFFSET = 100 + top;

  // Calculate the percentage of scroll and set it to shared value
  const scrollHandler = useAnimatedScrollHandler(event => {
    const {contentOffset, contentSize, layoutMeasurement} = event;
    const denominator = contentSize.height - layoutMeasurement.height;
    const numerator = contentOffset.y;

    scrollOffset.value = contentOffset.y;
    // clamp value between 0 and 1
    scrollProgress.value = Math.min(Math.max(numerator / denominator, 0), 1);
  });

  const animatedAvatarStyle = useAnimatedStyle(() => {
    return {
      top: AVATAR_TOP_OFFSET - scrollOffset.value,
      // transform: [{scale: 1.0}],
    };
  });
  /** Animations end * */

  const {visitingProfileData, visitingProfileLoading} =
    useProfileDataGivenAddress(params?.visitingProfileAddress || '');
  const {activeAddress, profileData} = useActiveAccount();
  const {loading, refetch} = usePollProfileData(activeAddress!);

  const screenMode = useMemo(() => {
    if (params?.visitingProfileAddress) {
      return activeAddress !== params.visitingProfileAddress
        ? 'guestProfile'
        : 'myProfile';
    }

    return 'myProfile';
  }, [params?.visitingProfileAddress, activeAddress]);

  const {address, bio, dtag, cover_pic, profile_pic, nickname} =
    screenMode === 'guestProfile'
      ? visitingProfileData
      : (profileData as ProfileData);

  const {numRelationships, refreshNumRelationships} =
    useNumRelationships(address);

  React.useEffect(() => {
    refreshNumRelationships();
  }, []);

  const twitterAccount = useMemo(() => {
    return connectedApps.findIndex(app => app.application === 'twitter') !== -1;
  }, [connectedApps]);

  const profileLoading =
    screenMode === 'myProfile' ? loading : visitingProfileLoading;

  const handlePressConnectAddress = useCallback(() => {
    navigate(ROUTES.MANAGE_CONNECTED_CHAINS);
  }, []);

  const handlePressSettings = useCallback(() => {
    navigate(ROUTES.SETTINGS);
  }, []);

  const handlePressConnectApp = useCallback(() => {
    navigate(ROUTES.CONNECT_APP, {mode: 'connect'});
  }, []);

  const handlePressEdit = useCallback(() => {
    navigate(ROUTES.EDIT_PROFILE);
  }, []);

  const bannerImage = useMemo(() => {
    return cover_pic ? {uri: cover_pic} : defaultBanner;
  }, [cover_pic]);

  const profileImage = useMemo(() => {
    return profile_pic ? {uri: profile_pic} : defaultProfilePic;
  }, [profile_pic]);

  const isFollowing = useRecoilValue(isFollowingAddr(address));

  const {followOrUnfollowUser} = useFollowOrUnfollow();

  const FollowButton = useMemo(() => {
    if (screenMode === 'myProfile') {
      return (
        <ImageButton
          image={editButton}
          style={styles.editButton}
          onPress={handlePressEdit}
        />
      );
    }

    return (
      <ImageButton
        image={isFollowing ? followedIcon : followIcon}
        style={styles.editButton}
        onPress={() => followOrUnfollowUser({addrToFollow: address})}
      />
    );
  }, [followOrUnfollowUser]);

  const subspaceID = EnvConfig.APP_SUBSPACE_ID;

  /* A hook that returns a props object that can be used to pass to a component that will navigate to
  the following and followers screen. */
  const handleFollowingPressed = () =>
    navigate(ROUTES.FOLLOWING_AND_FOLLOWERS, {
      screen: ROUTES.FOLLOWING,
      params: {
        subspaceID,
        userAddress: address,
        headerTitle: nickname.trim() || `@${dtag}`,
      },
    });

  const handleFollowersPressed = () =>
    navigate(ROUTES.FOLLOWING_AND_FOLLOWERS, {
      screen: ROUTES.FOLLOWERS,
      params: {
        subspaceID,
        userAddress: address,
        headerTitle: nickname.trim() || `@${dtag}`,
      },
    });

  const handlePostsSectionPressed = useCallback(() => {
    navigate(ROUTES.PROFILE_POSTS, {
      userAddress:
        screenMode === 'myProfile'
          ? activeAddress!
          : params?.visitingProfileAddress!,
      initialTabsRouteName: ROUTES.PROFILE_POSTS_POSTS,
    });
  }, [activeAddress]);

  const handleNftSectionPressed = useCallback(() => {
    navigate(ROUTES.PROFILE_NFTS);
  }, []);

  const handlePoapSectionPressed = useCallback(() => {
    console.log('test');
  }, []);

  const ConnectedChains = React.useMemo(() => {
    const images = [
      ...mapConnectedChainImages(chainLinks),
      ...mapConnectedAppImages(connectedApps),
    ];

    if (images.length > 3) images.length = 3;

    if (chainLinks.length !== 0 || connectedApps.length !== 0) {
      return (
        <View style={{marginTop: 16}}>
          <ChainsCountersBar
            loading={false}
            connectedChainsCounter={chainLinks.length}
            connectedAppsCounter={connectedApps.length}
            connectedChainsImages={images}
            handlePressCounters={() => navigate(ROUTES.SETTINGS)}
          />
        </View>
      );
    }
    return undefined;
  }, [chainLinks, connectedApps]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!profileLoading) {
      timeout = setTimeout(() => setGlobalLoading(false), 500);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [profileLoading]);

  if (globalLoading) {
    return (
      <SafeAreaView>
        <Loading />
      </SafeAreaView>
    );
  }

  return (
    <Animated.View entering={FadeIn.duration(250)} style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <FastImage source={bannerImage} style={styles.bannerImage} />
      {/* avatar needs to be in a view for positioning and ios zIndex compat */}
      <Animated.View
        style={[
          styles.avatarContainer,
          {position: 'absolute', left: 0, right: 0},
          animatedAvatarStyle,
        ]}>
        <FastImage style={styles.avatar} source={profileImage} />
      </Animated.View>
      <Animated.ScrollView
        overScrollMode="never"
        onScroll={scrollHandler}
        scrollEventThrottle={10}
        // Hardcoded value to avoid overlapping with header
        refreshControl={
          <RefreshControl enabled onRefresh={refetch} refreshing={loading} />
        }
        contentContainerStyle={styles.contentContainerStyle}>
        <View style={[styles.scrollviewContentWrapper, {marginTop: 100 + top}]}>
          <View style={styles.contentGroup}>
            <View style={{paddingHorizontal: theme.spacing.m}}>
              {FollowButton}

              <Typography.H3
                style={[styles.nameText, !nickname ? {opacity: 0} : {}]}>
                {nickname}
              </Typography.H3>

              <Typography.Body7 style={styles.dTagText}>
                @{dtag}
              </Typography.Body7>

              <Spacer paddingVertical={theme.spacing.s}>
                <AddressCopy
                  address={address}
                  externalCallback={() => setShowSnackbar(true)}
                />
              </Spacer>
              <Spacer paddingVertical={6} />
              <UserBio content={bio || ''} />
              <View style={styles.socialCounterGroup}>
                <TouchableOpacity onPress={handleFollowingPressed}>
                  <SocialCounter
                    count={numRelationships?.numFollowing}
                    label={t('following')}
                  />
                </TouchableOpacity>

                <View style={styles.separator} />

                <TouchableOpacity onPress={handleFollowersPressed}>
                  <SocialCounter
                    count={numRelationships?.numFollowers}
                    label={t('followers')}
                  />
                </TouchableOpacity>
              </View>

              {screenMode === 'myProfile' && (
                <>
                  <View style={styles.connectButtonGroup}>
                    <Button
                      mode="outlined"
                      style={{borderColor: theme.colors.surfaceBlack}}
                      contentStyle={styles.connectButton}
                      onPress={handlePressConnectAddress}>
                      <Typography.Button2>
                        {t('connectAddress')}
                      </Typography.Button2>
                    </Button>
                    <Button
                      disabled={twitterAccount}
                      mode="outlined"
                      style={{borderColor: theme.colors.surfaceBlack}}
                      contentStyle={styles.connectButton}
                      onPress={handlePressConnectApp}>
                      <Typography.Button2>
                        {twitterAccount
                          ? 'Twitter connected'
                          : t('connectTwitter')}
                      </Typography.Button2>
                    </Button>
                  </View>
                  {ConnectedChains}
                </>
              )}
            </View>
          </View>
          <Spacer paddingVertical={4} />
          {screenMode !== 'myProfile' && <Spacer paddingVertical={16} />}
          <ProfileSectionButton
            onPress={handlePostsSectionPressed}
            titleLabel={t('posts')}
            bodyLabel={t('check posts')}
            screenMode={screenMode}
          />
          <ProfileSectionButton
            onPress={handleNftSectionPressed}
            titleLabel={t('nft')}
            bodyLabel={t('link nft')}
            screenMode={screenMode}
          />
          <ProfileSectionButton
            onPress={handlePoapSectionPressed}
            titleLabel={t('poap')}
            bodyLabel={t('claim poap')}
            screenMode={screenMode}
          />
        </View>
      </Animated.ScrollView>

      <ProfileHeader
        disableRightButtons={screenMode === 'guestProfile'}
        scrollProgress={scrollProgress}
        handlePressHome={goBack}
        handlePressNotification={() => navigate(ROUTES.ACTIVITIES)}
        handlePressScan={() => {
          console.log('scan');
        }}
        handlePressSettings={handlePressSettings}
        hasNotification
        username={nickname || `@${dtag}`}
        bannerImage={bannerImage}
      />

      <Snackbar
        visible={showSnackbar}
        style={styles.snackbar}
        onDismiss={() => setShowSnackbar(false)}
        action={{
          label: t('hide'),
        }}
        duration={Snackbar.DURATION_SHORT}>
        <Typography.Caption1>{t('common:addressCopied')}</Typography.Caption1>
      </Snackbar>
    </Animated.View>
  );
};

export default Profile;
