import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {
  defaultBanner,
  defaultProfilePic,
  editButton,
  followOrangeFilledIcon,
} from 'assets/images';
import Button from 'components/Button';
import DropShadowWrapper from 'components/DropShadowWrapper';
import ImageButton from 'components/ImageButton';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import useActiveAccount from 'hooks/useActiveAccount';
import useVisitingProfileData from 'hooks/useVisitingProfileData';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, Image, TouchableOpacity, View} from 'react-native';
import {Snackbar, useTheme} from 'react-native-paper';
import Animated, {useSharedValue} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
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
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const {t} = useTranslation('profile');
  const styles = useStyles();
  const {navigate, goBack} = useNavigation<NavProps['navigation']>();
  const {params} = useRoute<NavProps['route']>();
  const {top} = useSafeAreaInsets();

  /** Animations start
   * These hooks act as the animation driver for the ProfileHeader component
   * The actual animations are created in the component itself.
   * */
  const scrollProgress = useSharedValue(0);

  // Calculate the percentage of scroll and set it to shared value
  /*  const scrollHandler = useAnimatedScrollHandler(event => {
    const {contentOffset, contentSize, layoutMeasurement} = event;
    const denominator = contentSize.height - layoutMeasurement.height;
    const numerator = contentOffset.y;
    // clamp value between 0 and 1
    scrollProgress.value = Math.min(Math.max(numerator / denominator, 0), 1);
  }); */
  /** Animations end * */

  const {visitingProfileData, visitingProfileLoading} = useVisitingProfileData(
    params.visitingProfileAddress || '',
  );
  const {activeAddress, profileData, loading} = useActiveAccount();

  const screenMode = useMemo(() => {
    if (params.visitingProfileAddress) {
      return activeAddress !== params.visitingProfileAddress
        ? 'guestProfile'
        : 'myProfile';
    }

    return 'myProfile';
  }, [params.visitingProfileAddress, activeAddress]);

  const {
    address,
    bio,
    dtag,
    cover_pic,
    profile_pic,
    nickname,
    following,
    followage,
  } =
    screenMode === 'guestProfile'
      ? visitingProfileData
      : (profileData as ProfileData);

  const profileLoading =
    screenMode === 'myProfile' ? loading : visitingProfileLoading;

  const handlePressConnectAddress = React.useCallback(() => {
    navigate(ROUTES.MANAGE_CONNECTED_CHAINS);
  }, []);

  const handlePressSettings = React.useCallback(() => {
    navigate(ROUTES.SETTINGS);
  }, []);

  const bannerImage = React.useMemo(() => {
    return cover_pic ? {uri: cover_pic} : defaultBanner;
  }, [cover_pic]);

  const profileImage = React.useMemo(() => {
    return profile_pic ? {uri: profile_pic} : defaultProfilePic;
  }, [profile_pic]);

  // TODO WIP WIP WIP TO BE INTEGRATED WITH FOLLOW FUNCTIONALITY
  const followButton = React.useMemo(() => {
    return followOrangeFilledIcon;
  }, []);

  /* ToDo: shouldn't hardcode, this is the subspace ID for the Desmos mainnet. */
  const subspaceID = 5;

  /* A hook that returns a props object that can be used to pass to a component that will navigate to
  the following and followers screen. */
  const handleFollowingPressed = React.useCallback(
    () =>
      navigate(ROUTES.FOLLOWING_AND_FOLLOWERS, {
        initialTabRouteName: ROUTES.FOLLOWING,
        subspaceID,
        userAddress: activeAddress ?? '',
        headerTitle: nickname || `@${dtag}`,
      }),
    [subspaceID, activeAddress, nickname, dtag],
  );

  const handleFollowersPressed = React.useCallback(
    () =>
      navigate(ROUTES.FOLLOWING_AND_FOLLOWERS, {
        initialTabRouteName: ROUTES.FOLLOWERS,
        subspaceID,
        userAddress: activeAddress ?? '',
        headerTitle: nickname || `@${dtag}`,
      }),
    [subspaceID, activeAddress, nickname, dtag],
  );

  if (profileLoading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      <Image source={bannerImage} style={styles.bannerImage} />

      <Animated.ScrollView
        // onScroll={scrollHandler}
        // Hardcoded value to avoid overlapping with header
        style={{paddingTop: 100 + top}}
        contentContainerStyle={styles.contentContainerStyle}>
        <View style={styles.avatarContainer}>
          <Image style={styles.avatar} source={profileImage} />
        </View>

        <View style={styles.contentGroup}>
          <View style={{paddingHorizontal: theme.spacing.m}}>
            <ImageButton
              image={screenMode === 'myProfile' ? editButton : followButton}
              style={styles.editButton}
            />

            <Typography.H3
              style={[styles.nameText, !nickname ? {opacity: 0} : {}]}>
              {nickname}
            </Typography.H3>

            <Typography.Body7 style={styles.dTagText}>@{dtag}</Typography.Body7>

            <Spacer paddingVertical={theme.spacing.s}>
              <AddressCopy
                address={address}
                externalCallback={() => setShowSnackbar(true)}
              />
            </Spacer>

            <UserBio content={bio || ''} />

            <View style={styles.socialCounterGroup}>
              <TouchableOpacity onPress={handleFollowingPressed}>
                <SocialCounter
                  count={following?.length}
                  label={t('following')}
                />
              </TouchableOpacity>

              <View style={styles.separator} />

              <TouchableOpacity onPress={handleFollowersPressed}>
                <SocialCounter
                  count={followage?.length}
                  label={t('followers')}
                />
              </TouchableOpacity>
            </View>

            {screenMode === 'myProfile' && (
              <View style={styles.connectButtonGroup}>
                <Button
                  mode="outlined"
                  style={{
                    height: 48,
                    width: 170,
                    justifyContent: 'center',
                    borderColor: theme.colors.black,
                  }}
                  onPress={handlePressConnectAddress}>
                  <Typography.Button2>{t('connectAddress')}</Typography.Button2>
                </Button>
                <Button
                  mode="outlined"
                  style={{
                    height: 48,
                    width: 170,
                    justifyContent: 'center',
                    borderColor: theme.colors.black,
                  }}
                  onPress={() => console.log('connectTwitter')}>
                  <Typography.Button2>{t('connectTwitter')}</Typography.Button2>
                </Button>
                {/* hidden on MVP */}
                {/* <ProfileConnectButton */}
                {/*  label={t('connectApp')} */}
                {/*  handlePress={() => {}} */}
                {/* /> */}
              </View>
            )}
          </View>
        </View>
        <Spacer paddingVertical={12} />
        <View style={styles.sectionGroup}>
          <DropShadowWrapper
            customColor="rgba(133, 133, 133, 0.001)"
            customDistance={20}>
            <TouchableOpacity
              style={{
                backgroundColor: 'white',
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: theme.roundness,
                padding: theme.spacing.m,
                minHeight: 80,
              }}>
              <View style={{flexDirection: 'column'}}>
                <Typography.Subtitle2>{t('posts')}</Typography.Subtitle2>
                {screenMode === 'myProfile' && (
                  <Typography.Body6>{t('check posts')}</Typography.Body6>
                )}
              </View>
              <Icon
                name="angle-right"
                color={theme.colors.black}
                size={24}
                allowFontScaling
              />
            </TouchableOpacity>
          </DropShadowWrapper>
        </View>
        <View style={styles.sectionGroup}>
          <DropShadowWrapper
            customColor="rgba(133, 133, 133, 0.001)"
            customDistance={10}>
            <TouchableOpacity
              style={{
                backgroundColor: 'white',
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: theme.roundness,
                padding: theme.spacing.m,
                minHeight: 80,
              }}>
              <View style={{flexDirection: 'column'}}>
                <Typography.Subtitle2>{t('nft')}</Typography.Subtitle2>
                {screenMode === 'myProfile' && (
                  <Typography.Body6>{t('link nft')}</Typography.Body6>
                )}
              </View>
              <Icon
                name="angle-right"
                color={theme.colors.black}
                size={24}
                allowFontScaling
              />
            </TouchableOpacity>
          </DropShadowWrapper>
        </View>
        <View style={styles.sectionGroup}>
          <DropShadowWrapper
            customColor="rgba(133, 133, 133, 0.001)"
            customDistance={10}>
            <TouchableOpacity
              style={{
                backgroundColor: 'white',
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: theme.roundness,
                padding: theme.spacing.m,
                minHeight: 80,
              }}>
              <View style={{flexDirection: 'column'}}>
                <Typography.Subtitle2>{t('poap')}</Typography.Subtitle2>
                {screenMode === 'myProfile' && (
                  <Typography.Body6>{t('claim poap')}</Typography.Body6>
                )}
              </View>
              <Icon
                name="angle-right"
                color={theme.colors.black}
                size={24}
                allowFontScaling
              />
            </TouchableOpacity>
          </DropShadowWrapper>
        </View>
      </Animated.ScrollView>

      <ProfileHeader
        disableRightButtons={screenMode === 'guestProfile'}
        scrollProgress={scrollProgress}
        handlePressHome={goBack}
        handlePressNotification={() => {
          console.log('notifications');
        }}
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
    </View>
  );
};

export default Profile;
