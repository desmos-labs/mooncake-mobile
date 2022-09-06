import {useQuery} from '@apollo/client';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {
  defaultBanner,
  defaultProfilePic,
  editButton,
  followOrangeFilledIcon,
} from 'assets/images';
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
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale} from 'react-native-size-matters';
import GetPostsForAddress from 'services/graphql/queries/GetPostsForAddress';
import AddressCopy from './components/AddressCopy';
import ContentTabs from './components/ContentTab';
import EmptyPostComponent from './components/EmptyPostComponent';
import FakeDropShadow from './components/FakeDropShadow';
import ProfileConnectButton from './components/ProfileConnectButton';
import ProfileHeader from './components/ProfileHeader';
import ProfilePostCard from './components/ProfilePostCard';
import SocialCounter from './components/SocialCounter';
import UserBio from './components/UserBio';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.USER_PROFILE>;

export interface UserProfileParams {
  visitingProfileAddress?: string;
}

const Profile = () => {
  const theme = useTheme();
  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);
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
  const scrollHandler = useAnimatedScrollHandler(event => {
    const {contentOffset, contentSize, layoutMeasurement} = event;
    const denominator = contentSize.height - layoutMeasurement.height;
    const numerator = contentOffset.y;
    // clamp value between 0 and 1
    scrollProgress.value = Math.min(Math.max(numerator / denominator, 0), 1);
  });
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

  const tabs = useMemo(
    () => [t('posts'), t('portfolio'), t('poap'), t('tippings')],
    [t],
  );

  const {data: postData, loading: postsLoading} = useQuery(GetPostsForAddress, {
    variables: {
      address:
        screenMode === 'myProfile'
          ? activeAddress
          : params.visitingProfileAddress,
    },
  });

  const posts: [] = React.useMemo(() => {
    if (!postData) return [];
    return postData.post;
  }, [postData, postsLoading]);

  const handlePostPressed = React.useCallback(
    ({
      subspaceID,
      authorAddress,
      id,
    }: {
      subspaceID: number;
      authorAddress: string;
      id: number;
    }) => {
      // Pass these variables into the PostDetails page
      console.log(subspaceID, authorAddress, id);
    },
    [],
  );

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

  const ListHeaderComponent = React.useMemo(() => {
    return (
      <>
        {/* top buttons start */}
        {/* top buttons end */}

        {/* avatar needs to be in a view for positioning and ios zIndex compat */}
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
                <ProfileConnectButton
                  label={t('connectAddress')}
                  handlePress={handlePressConnectAddress}
                />

                {/* hidden on MVP */}
                {/* <ProfileConnectButton */}
                {/*  label={t('connectApp')} */}
                {/*  handlePress={() => {}} */}
                {/* /> */}
              </View>
            )}
          </View>
        </View>

        <FakeDropShadow />
        <View style={styles.tabContainer}>
          <ContentTabs
            tabs={tabs}
            selectedIndex={selectedTabIndex}
            handleTabPressed={setSelectedTabIndex}
          />
        </View>
      </>
    );
  }, [selectedTabIndex, nickname, dtag]);

  if (profileLoading || postsLoading) {
    return <ActivityIndicator />;
  }

  const renderPosts = ({item}: any) => (
    <ProfilePostCard
      postData={item}
      onPress={() =>
        handlePostPressed({
          subspaceID: item.subspace_id,
          authorAddress: item.author_address,
          id: item.id,
        })
      }
    />
  );

  return (
    <View style={styles.container}>
      <Image source={bannerImage} style={styles.bannerImage} />

      <Animated.FlatList
        ListHeaderComponent={ListHeaderComponent}
        onScroll={scrollHandler}
        // Hardcoded value to avoid overlapping with header
        style={{paddingTop: 100 + top}}
        data={posts}
        renderItem={renderPosts}
        numColumns={3}
        columnWrapperStyle={{
          // slight adjustment so column items appear centered
          left: scale(20),
        }}
        contentContainerStyle={styles.contentContainerStyle}
        ListEmptyComponent={EmptyPostComponent}
      />

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
