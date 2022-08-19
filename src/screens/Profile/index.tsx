import React from 'react';
import {ActivityIndicator, Image, LayoutChangeEvent, View} from 'react-native';
import {defaultBanner, desmosIcon, editButton} from 'assets/images';
import ImageButton from 'components/ImageButton';
import {Snackbar, useTheme} from 'react-native-paper';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import {useTranslation} from 'react-i18next';
import {useQuery} from '@apollo/client';
import GetPostsForAddress from 'services/graphql/queries/GetPostsForAddress';
import {scale} from 'react-native-size-matters';
import useActiveAccount from 'hooks/useActiveAccount';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useNavigation} from '@react-navigation/native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import ProfileTopButtons from 'screens/Profile/components/ProfileTopButtons';
import ProfileConnectButton from './components/ProfileConnectButton';
import SocialCounter from './components/SocialCounter';
import UserBio from './components/UserBio';
import AddressCopy from './components/AddressCopy';
import ProfilePostCard from './components/ProfilePostCard';
import FakeDropShadow from './components/FakeDropShadow';
import useStyles from './useStyles';
import ContentTabs from './components/ContentTab';
import EmptyPostComponent from './components/EmptyPostComponent';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.USER_PROFILE>;

const Profile = () => {
  const theme = useTheme();

  const {
    activeAddress,
    profileData,
    loading: profileLoading,
  } = useActiveAccount();

  // scroll handler start
  const scrollProgress = useSharedValue(0);

  // calculate the percentage of scroll and set it to shared value
  const scrollHandler = useAnimatedScrollHandler(event => {
    const {contentOffset, contentSize, layoutMeasurement} = event;
    const denominator = contentSize.height - layoutMeasurement.height;
    const numerator = contentOffset.y;
    scrollProgress.value = Math.min(Math.max(numerator / denominator, 0), 1);
  });

  const animatedOpacity = useAnimatedStyle(() => {
    const interpolatedOpacity = interpolate(
      scrollProgress.value,
      [0, 0.4],
      [0, 1],
      {extrapolateRight: Extrapolation.CLAMP},
    );
    return {opacity: interpolatedOpacity};
  });

  const onContentLayout = React.useCallback((event: LayoutChangeEvent) => {
    console.log(event.nativeEvent.layout);
  }, []);

  const tabs = React.useMemo(() => ['Posts', 'Portfolio'], []);

  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);

  const [showSnackbar, setShowSnackbar] = React.useState(false);

  const {t} = useTranslation('profile');

  const styles = useStyles();

  const {navigate, goBack} = useNavigation<NavProps['navigation']>();

  const {data: postData, loading: postsLoading} = useQuery(GetPostsForAddress, {
    variables: {
      address: activeAddress,
    },
  });

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

  if (profileLoading || postsLoading) {
    return <ActivityIndicator />;
  }

  const {
    address,
    bio,
    dtag,
    cover_pic,
    profile_pic,
    nickname,
    following,
    followage,
  } = profileData as ProfileData;

  const {post} = postData;

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
      <Image
        source={cover_pic ? {uri: cover_pic} : defaultBanner}
        style={styles.bannerImage}
      />
      <ProfileTopButtons
        handlePressHome={goBack}
        handlePressNotification={() => {
          console.log('notifications');
        }}
        handlePressScan={() => {
          console.log('scan');
        }}
        handlePressSettings={handlePressSettings}
        hasNotification
        animatedOpacity={animatedOpacity}
      />

      <Animated.FlatList
        onScroll={scrollHandler}
        style={{paddingTop: 64}}
        onLayout={onContentLayout}
        ListHeaderComponent={
          <>
            {/* top buttons start */}
            {/* top buttons end */}

            {/* avatar needs to be in a view for positioning and ios zIndex compat */}
            <View style={styles.avatarContainer}>
              <Image
                style={styles.avatar}
                source={profile_pic ? {uri: profile_pic} : desmosIcon}
              />
            </View>

            <View style={styles.contentGroup}>
              <View style={{paddingHorizontal: theme.spacing.m}}>
                <ImageButton image={editButton} style={styles.editButton} />

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

                <UserBio content={bio} />

                <View style={styles.socialCounterGroup}>
                  <SocialCounter
                    count={following.length}
                    label={t('following')}
                  />

                  <View style={styles.separator} />

                  <SocialCounter
                    count={followage.length}
                    label={t('followers')}
                  />
                </View>

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
        }
        data={post}
        renderItem={renderPosts}
        numColumns={3}
        columnWrapperStyle={{
          // slight adjustment so column items appear centered
          left: scale(20),
        }}
        contentContainerStyle={styles.contentContainerStyle}
        ListEmptyComponent={EmptyPostComponent}
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
