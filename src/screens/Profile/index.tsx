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
import {scale} from 'react-native-size-matters';

const DUMMY_CONTENT = ` Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus orci porta, finibus lacus quis, facilisis metus. Nam aliquet rhoncus ullamcorper. Aenean sit amet auctor dolor, porttitor faucibus ex. Quisque neque lectus, auctor feugiat fringilla sit amet, lacinia ut urna. Duis iaculis ex sit amet luctus consequat. Ut blandit est in vestibulum maximus. Phasellus porttitor maximus orci, eu tincidunt sem tristique sed.

Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec id auctor quam. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras non accumsan turpis. Sed a viverra felis, eu tincidunt tellus. In lacinia orci risus, ut ultrices tortor hendrerit id. Nam scelerisque semper libero volutpat venenatis. Nullam commodo ex vitae venenatis dignissim.

Duis eget finibus mi. In imperdiet est at arcu vehicula, tempus volutpat sem congue. Praesent a egestas erat. Nulla sed convallis eros. Sed velit eros, ullamcorper egestas consequat at, consequat eget enim. Nulla ultricies ex mattis, aliquam neque id, lacinia enim. Praesent quis lobortis libero, ut blandit ligula. Nullam tristique quis purus quis gravida. Sed vel nulla rutrum diam gravida fringilla eu eu mi. Pellentesque non viverra nisi, vitae consequat mauris. Nam pellentesque feugiat lacus, non molestie nunc ornare id. Suspendisse vehicula nunc nec rutrum volutpat. Mauris fermentum velit vitae turpis venenatis, ac bibendum nisl ultrices. 
`;

const Profile = () => {
  const theme = useTheme();

  const {t} = useTranslation('profile');

  const name = 'Shrek';
  const dTag = '@swampyboi';

  const address = 'desmosa;lsdjf;lkajsdf;klajsdfkl;ajsdf;lkajsd;fklajsdf;kl';

  const following = 1000;

  const followers = 12000;

  return (
    <DView>
      <ImageBackground
        source={defaultBanner}
        style={StyleSheet.absoluteFillObject}>
        {/* top buttons */}
        <View
          style={{
            padding: theme.spacing.m,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View>
            <ImageButton image={homeButton} style={{width: 32, height: 32}} />
          </View>

          <View>
            <ImageButton
              image={notificationsButton}
              style={{width: 32, height: 32}}
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
                style={{width: 32, height: 32}}
              />
            </Spacer>
          </View>
        </View>
        {/* top buttons end */}

        <View>
          <Image
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              resizeMode: 'contain',
              position: 'absolute',
              top: -40,
              alignSelf: 'center',
              // TODO: remove
              backgroundColor: 'gray',
              zIndex: 2,
            }}
            source={{uri: 'https://i.imgur.com/aih9snA.png'}}
          />
        </View>
        {/* main panel */}
        <ScrollView
          style={{
            backgroundColor: theme.colors.background,
            borderTopRightRadius: 24,
            borderTopLeftRadius: 24,
            marginTop: theme.spacing.m,
          }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingVertical: 14,
            paddingHorizontal: theme.spacing.m,
          }}>
          <ImageButton
            image={editButton}
            style={{width: 32, height: 32, alignSelf: 'flex-end'}}
          />

          <Typography.H3
            style={{textAlign: 'center', marginTop: theme.spacing.s}}>
            {name}
          </Typography.H3>

          <Typography.Body7
            style={{
              textAlign: 'center',
            }}>
            {dTag}
          </Typography.Body7>

          <Spacer paddingVertical={theme.spacing.s}>
            <AddressCopy address={address} />
          </Spacer>

          <UserBio content={DUMMY_CONTENT} />

          {/* social counters */}
          <View
            style={{
              marginTop: theme.spacing.m,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
            <SocialCounter count={following} label={t('following')} />

            <View
              style={{
                backgroundColor: theme.colors.icon[3],
                width: StyleSheet.hairlineWidth,
                height: '90%',
              }}
            />

            <SocialCounter count={followers} label={t('followers')} />
          </View>

          <View
            style={{
              marginTop: theme.spacing.m,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
            <DButton
              mode="outlined"
              style={{width: scale(140), height: 40}}
              contentStyle={{height: '100%'}}>
              <Typography.Button2
                style={{color: theme.colors.primary, lineHeight: 22}}>
                {t('connectAddress')}
              </Typography.Button2>
            </DButton>

            <DButton
              mode="outlined"
              style={{width: scale(140), height: 40}}
              contentStyle={{height: '100%'}}>
              <Typography.Button2
                style={{color: theme.colors.primary, lineHeight: 22}}>
                {t('connectApp')}
              </Typography.Button2>
            </DButton>
          </View>
        </ScrollView>
        {/* main panel end */}
      </ImageBackground>
    </DView>
  );
};

export default Profile;
