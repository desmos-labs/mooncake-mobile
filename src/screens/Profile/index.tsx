import React from 'react';
import DView from 'components/DView';
import {
  View,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Image,
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
import ContentPanel from './components/ContentPanel';
import useStyles from './useStyles';

const DUMMY_CONTENT = ` Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus orci porta, finibus lacus quis, facilisis metus. Nam aliquet rhoncus ullamcorper. Aenean sit amet auctor dolor, porttitor faucibus ex. Quisque neque lectus, auctor feugiat fringilla sit amet, lacinia ut urna. Duis iaculis ex sit amet luctus consequat. Ut blandit est in vestibulum maximus. Phasellus porttitor maximus orci, eu tincidunt sem tristique sed.

Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec id auctor quam. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras non accumsan turpis. Sed a viverra felis, eu tincidunt tellus. In lacinia orci risus, ut ultrices tortor hendrerit id. Nam scelerisque semper libero volutpat venenatis. Nullam commodo ex vitae venenatis dignissim.

Duis eget finibus mi. In imperdiet est at arcu vehicula, tempus volutpat sem congue. Praesent a egestas erat. Nulla sed convallis eros. Sed velit eros, ullamcorper egestas consequat at, consequat eget enim. Nulla ultricies ex mattis, aliquam neque id, lacinia enim. Praesent quis lobortis libero, ut blandit ligula. Nullam tristique quis purus quis gravida. Sed vel nulla rutrum diam gravida fringilla eu eu mi. Pellentesque non viverra nisi, vitae consequat mauris. Nam pellentesque feugiat lacus, non molestie nunc ornare id. Suspendisse vehicula nunc nec rutrum volutpat. Mauris fermentum velit vitae turpis venenatis, ac bibendum nisl ultrices. 
`;

const DUMMY_POSTS = [
  {
    id: 1,
    creation_date: '2022-06-30T17:04:54.57816',
    author_address: 'desmos1dx6h75tkj0cuvyqf6cwn6usc9qynu39v0245m4',
    attachments: [
      {
        id: 1,
        content: {
          uri: 'https://images.app.goo.gl/g7VHpLGJYjndRfWL6',
          '@type': '/desmos.posts.v1.Media',
          mime_type: 'image/png',
        },
      },
    ],
    author: {
      address: 'desmos1dx6h75tkj0cuvyqf6cwn6usc9qynu39v0245m4',
      bio: '',
      dtag: 'Raffaello',
      profile_pic: '',
      nickname: '',
    },
    subspace_id: 5,
    reactions: [
      {
        id: 1,
        value: {
          text: '🚀',
          '@type': '/desmos.reactions.v1.FreeTextValue',
        },
      },
      {
        id: 2,
        value: {
          text: '😂',
          '@type': '/desmos.reactions.v1.FreeTextValue',
        },
      },
    ],
    text: 'This is a test post',
    conversation: null,
  },
  {
    id: 2,
    creation_date: '2022-06-30T17:04:54.57816',
    author_address: 'desmos1dx6h75tkj0cuvyqf6cwn6usc9qynu39v0245m4',
    attachments: [
      {
        id: 1,
        content: {
          uri: 'https://images.app.goo.gl/g7VHpLGJYjndRfWL6',
          '@type': '/desmos.posts.v1.Media',
          mime_type: 'image/png',
        },
      },
    ],
    author: {
      address: 'desmos1dx6h75tkj0cuvyqf6cwn6usc9qynu39v0245m4',
      bio: '',
      dtag: 'Raffaello',
      profile_pic: '',
      nickname: '',
    },
    subspace_id: 5,
    reactions: [
      {
        id: 1,
        value: {
          text: '🚀',
          '@type': '/desmos.reactions.v1.FreeTextValue',
        },
      },
      {
        id: 2,
        value: {
          text: '😂',
          '@type': '/desmos.reactions.v1.FreeTextValue',
        },
      },
    ],
    text: 'This is a test post',
    conversation: null,
  },
  {
    id: 3,
    creation_date: '2022-06-30T17:04:54.57816',
    author_address: 'desmos1dx6h75tkj0cuvyqf6cwn6usc9qynu39v0245m4',
    attachments: [
      {
        id: 1,
        content: {
          uri: 'https://images.app.goo.gl/g7VHpLGJYjndRfWL6',
          '@type': '/desmos.posts.v1.Media',
          mime_type: 'image/png',
        },
      },
    ],
    author: {
      address: 'desmos1dx6h75tkj0cuvyqf6cwn6usc9qynu39v0245m4',
      bio: '',
      dtag: 'Raffaello',
      profile_pic: '',
      nickname: '',
    },
    subspace_id: 5,
    reactions: [
      {
        id: 1,
        value: {
          text: '🚀',
          '@type': '/desmos.reactions.v1.FreeTextValue',
        },
      },
      {
        id: 2,
        value: {
          text: '😂',
          '@type': '/desmos.reactions.v1.FreeTextValue',
        },
      },
    ],
    text: 'This is a test post',
    conversation: null,
  },
  {
    id: 4,
    creation_date: '2022-06-30T17:04:54.57816',
    author_address: 'desmos1dx6h75tkj0cuvyqf6cwn6usc9qynu39v0245m4',
    attachments: [
      {
        id: 1,
        content: {
          uri: 'https://images.app.goo.gl/g7VHpLGJYjndRfWL6',
          '@type': '/desmos.posts.v1.Media',
          mime_type: 'image/png',
        },
      },
    ],
    author: {
      address: 'desmos1dx6h75tkj0cuvyqf6cwn6usc9qynu39v0245m4',
      bio: '',
      dtag: 'Raffaello',
      profile_pic: '',
      nickname: '',
    },
    subspace_id: 5,
    reactions: [
      {
        id: 1,
        value: {
          text: '🚀',
          '@type': '/desmos.reactions.v1.FreeTextValue',
        },
      },
      {
        id: 2,
        value: {
          text: '😂',
          '@type': '/desmos.reactions.v1.FreeTextValue',
        },
      },
    ],
    text: 'This is a test post',
    conversation: null,
  },
  {
    id: 6,
    creation_date: '2022-06-30T17:04:54.57816',
    author_address: 'desmos1dx6h75tkj0cuvyqf6cwn6usc9qynu39v0245m4',
    attachments: [
      {
        id: 1,
        content: {
          uri: 'https://i.imgur.com/aih9snA.png',
          '@type': '/desmos.posts.v1.Media',
          mime_type: 'image/png',
        },
      },
    ],
    author: {
      address: 'desmos1dx6h75tkj0cuvyqf6cwn6usc9qynu39v0245m4',
      bio: '',
      dtag: 'Raffaello',
      profile_pic: '',
      nickname: '',
    },
  },
];

const Profile = () => {
  const theme = useTheme();

  const tabs = React.useMemo(() => ['Posts', 'Portfolio'], []);

  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);

  const {t} = useTranslation('profile');

  const styles = useStyles();

  const name = 'Shrek';
  const dTag = '@swampyboi';

  const address = 'desmosalsdjflkajsdfklajsdfklajsdflkajsdfklajsdfkl';

  const following = 1000;

  const followers = 12000;

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
            <Image
              style={styles.avatar}
              source={{uri: 'https://i.imgur.com/aih9snA.png'}}
            />
          </View>

          {/* main panel */}
          <View style={styles.contentGroup}>
            <View style={{paddingHorizontal: theme.spacing.m}}>
              <ImageButton image={editButton} style={styles.editButton} />

              <Typography.H3 style={styles.nameText}>{name}</Typography.H3>

              <Typography.Body7 style={styles.dTagText}>
                {dTag}
              </Typography.Body7>

              <Spacer paddingVertical={theme.spacing.s}>
                <AddressCopy address={address} />
              </Spacer>

              <UserBio content={DUMMY_CONTENT} />

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
              posts={DUMMY_POSTS as PostItem[]}
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
