import React from 'react';
import DView from 'components/DView';
import {View, Image, ActivityIndicator, FlatList} from 'react-native';
import {
  defaultBanner,
  desmosIcon,
  editButton,
  homeButton,
  notificationsButton,
  settingsButton,
} from 'assets/images';
import ImageButton from 'components/ImageButton';
import PingAnimation from 'screens/Profile/components/PingAnimation';
import {Snackbar, useTheme} from 'react-native-paper';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import {useTranslation} from 'react-i18next';
import {useQuery} from '@apollo/client';
import GetPostsForAddress from 'services/graphql/queries/GetPostsForAddress';
import GetProfileForAddress from 'services/graphql/queries/GetProfileForAddress';
import {scale} from 'react-native-size-matters';
import ProfileConnectButton from './components/ProfileConnectButton';
import SocialCounter from './components/SocialCounter';
import UserBio from './components/UserBio';
import AddressCopy from './components/AddressCopy';
import ProfilePostCard from './components/ProfilePostCard';
import FakeDropShadow from './components/FakeDropShadow';
import useStyles from './useStyles';
import ContentTabs from './components/ContentTab';
import EmptyPostComponent from './components/EmptyPostComponent';

// Replace this with an address from recoil
const DUMMY_ADDRESS = 'desmos16c60y8t8vra27zjg2arlcd58dck9cwn7p6fwtd';

const Profile = () => {
  const theme = useTheme();

  const tabs = React.useMemo(() => ['Posts', 'Portfolio'], []);

  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);

  const [showSnackbar, setShowSnackbar] = React.useState(false);

  const {t} = useTranslation('profile');

  const styles = useStyles();

  const {data: profileData, loading: profileLoading} = useQuery(
    GetProfileForAddress,
    {
      variables: {
        address: DUMMY_ADDRESS,
      },
    },
  );

  const {data: postData, loading: postsLoading} = useQuery(GetPostsForAddress, {
    variables: {
      address: DUMMY_ADDRESS,
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

  if (profileLoading || postsLoading) {
    return <ActivityIndicator />;
  }

  const [userProfile] = profileData.profile as any;

  const {
    address,
    bio,
    dtag,
    cover_pic,
    profile_pic,
    nickname,
    following,
    followage,
  } = userProfile as ProfileData;

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
    <DView>
      <FlatList
        ListHeaderComponent={
          <>
            <Image
              source={cover_pic ? {uri: cover_pic} : defaultBanner}
              style={styles.bannerImage}
            />
            {/* top buttons start */}
            <View style={styles.topButtonContainer}>
              <View>
                <ImageButton image={homeButton} style={styles.buttonStyle} />
              </View>

              <View>
                <ImageButton
                  image={notificationsButton}
                  style={styles.buttonStyle}
                  overlayComponent={
                    <PingAnimation
                      size={10}
                      color={theme.colors.desmosOrange01}
                    />
                  }
                  overlayPosition={{
                    top: 2,
                    left: 12,
                  }}
                />

                <Spacer paddingTop={theme.spacing.m}>
                  <ImageButton
                    image={settingsButton}
                    style={styles.buttonStyle}
                  />
                </Spacer>
              </View>
            </View>
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

                <Typography.H3 style={styles.nameText}>
                  {nickname || dtag}
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
                    handlePress={() => {}}
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
    </DView>
  );
};

export default Profile;
