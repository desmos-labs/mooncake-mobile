import React from 'react';
import DView from 'components/DView';
import {
  View,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  defaultBanner,
  editButton,
  homeButton,
  notificationsButton,
  settingsButton,
} from 'assets/images';
import ImageButton from 'components/ImageButton';
import PingAnimation from 'screens/Profile/components/PingAnimation';
import {useTheme} from 'react-native-paper';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import {useTranslation} from 'react-i18next';
import AddressCopy from 'screens/Profile/components/AddressCopy';
import UserBio from 'screens/Profile/components/UserBio';
import SocialCounter from 'screens/Profile/components/SocialCounter';
import DButton from 'components/DButton';
import {useQuery} from '@apollo/client';
import GetPostsForAddress from 'services/graphql/queries/GetPostsForAddress';
import GetProfileForAddress from 'services/graphql/queries/GetProfileForAddress';
import _ from 'lodash';
import useStyles from './useStyles';
import ContentPanel from './components/ContentPanel';

const DUMMY_ADDRESS = 'desmos1dx6h75tkj0cuvyqf6cwn6usc9qynu39v0245m4';

const Profile = () => {
  const theme = useTheme();

  const tabs = React.useMemo(() => ['Posts', 'Portfolio'], []);

  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);

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

  const {address, bio, dtag, profile_pic, nickname} =
    userProfile as ProfileData;

  const followers = _.get(userProfile, 'followage_aggregate.aggregate.count');

  const following = _.get(userProfile, 'following_aggregate.aggregate.count');

  const {posts} = postData;

  // This implementation is temporary; the inner scrollview will likely
  // be switched for a Animated.Scrollview once this page's scroll
  // behavior is finalized
  return (
    <DView>
      <ImageBackground
        source={defaultBanner}
        style={StyleSheet.absoluteFillObject}>
        {/* a dummy white box so ios overscroll effect does not reveal the default */}
        {/* orange background underneath */}
        <View
          style={{
            backgroundColor: 'white',
            bottom: 0,
            position: 'absolute',
            width: '100%',
            height: 500,
          }}
        />
        <ScrollView>
          {/* top buttons */}
          <View style={styles.topButtonContainer}>
            <View>
              <ImageButton image={homeButton} style={styles.buttonStyle} />
            </View>

            <View>
              <ImageButton
                image={notificationsButton}
                style={styles.buttonStyle}
                overlayComponent={
                  <PingAnimation size={10} color={theme.colors.primary} />
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
            <Image style={styles.avatar} source={{uri: profile_pic}} />
          </View>

          {/* main panel */}
          <View style={styles.contentGroup}>
            <View style={{paddingHorizontal: theme.spacing.m}}>
              <ImageButton image={editButton} style={styles.editButton} />

              <Typography.H3 style={styles.nameText}>{nickname}</Typography.H3>

              <Typography.Body7 style={styles.dTagText}>
                {dtag}
              </Typography.Body7>

              <Spacer paddingVertical={theme.spacing.s}>
                <AddressCopy address={address} />
              </Spacer>

              <UserBio content={bio} />

              {/* social counters */}
              <View style={styles.socialCounterGroup}>
                <SocialCounter count={following} label={t('following')} />

                <View style={styles.separator} />

                <SocialCounter count={followers} label={t('followers')} />
              </View>

              <View style={styles.connectButtonGroup}>
                <DButton
                  mode="outlined"
                  style={styles.connectButton}
                  contentStyle={styles.connectButtonContent}>
                  <Typography.Button2 style={styles.connectButtonText}>
                    {t('connectAddress')}
                  </Typography.Button2>
                </DButton>

                <DButton
                  mode="outlined"
                  style={styles.connectButton}
                  contentStyle={styles.connectButtonContent}>
                  <Typography.Button2 style={styles.connectButtonText}>
                    {t('connectApp')}
                  </Typography.Button2>
                </DButton>
              </View>
            </View>

            <ContentPanel
              tabs={tabs}
              selectedIndex={selectedTabIndex}
              handleTabPressed={setSelectedTabIndex}
              posts={posts || []}
              handlePostPressed={handlePostPressed}
            />
          </View>
        </ScrollView>

        {/* main panel end */}
      </ImageBackground>
    </DView>
  );
};

export default Profile;
