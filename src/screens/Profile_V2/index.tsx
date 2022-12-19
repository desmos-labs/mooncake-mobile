import {BlurView} from '@react-native-community/blur';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {
  connectIcon,
  profileBack,
  profileNotification,
  profileScan,
  profileSettings,
} from 'assets/images';
import ImageButton from 'components/ImageButton';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  Animated as ClassicAnimated,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Divider, useTheme} from 'react-native-paper';
import Animated, {FadeIn} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import PingAnimation from 'screens/Profile/components/PingAnimation';
import AddressCopy from 'screens/Profile_V2/components/AddressCopy';
import BadgesSection from 'screens/Profile_V2/components/BadgesSection';
import BalanceSection from 'screens/Profile_V2/components/BalanceSection';
import NftsSection from 'screens/Profile_V2/components/NftsSection';
import PostsSection from 'screens/Profile_V2/components/PostsSection';
import UserBio from 'screens/Profile_V2/components/UserBio';
import useProfileDataQueries from 'screens/Profile_V2/useProfileDataQueries';
import useStyles from './useStyles';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.USER_PROFILE_V2
>;

const HEADER_HEIGHT_COMPACT = 95;
const HEADER_HEIGHT_EXPANDED = 60;

export interface UserProfileParams_V2 {
  visitingProfileAddress?: string;
}

const Profile_V2 = () => {
  const theme = useTheme();
  const {t} = useTranslation('profile');
  const insets = useSafeAreaInsets();
  const {navigate, goBack} = useNavigation<NavProps['navigation']>();
  const {params} = useRoute<NavProps['route']>();
  const styles = useStyles({
    insets,
  });
  const [globalLoading, setGlobalLoading] = useState(true);

  const {profileLoading, nickname, dtag, bio, address, profile_pic, cover_pic} =
    useProfileDataQueries(params?.visitingProfileAddress);

  /** Animations start */
  const AnimatedImageBackground =
    ClassicAnimated.createAnimatedComponent(ImageBackground);
  const AnimatedFastImage = ClassicAnimated.createAnimatedComponent(FastImage);
  const AnimatedBlurView = ClassicAnimated.createAnimatedComponent(BlurView);

  const scrollY = useRef(new ClassicAnimated.Value(0)).current;
  const scrollOffset = useRef(
    new ClassicAnimated.Value(45 + HEADER_HEIGHT_EXPANDED),
  ).current;

  const scrollHandler = (event: any) => {
    const {contentOffset} = event.nativeEvent;
    scrollOffset.setValue(45 + HEADER_HEIGHT_EXPANDED - contentOffset.y);
    scrollY.setValue(contentOffset.y);
  };
  /** Animations end */

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!profileLoading) {
      timeout = setTimeout(() => setGlobalLoading(false), 500);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [profileLoading]);

  const handlePostsSectionPressed = useCallback(() => {
    navigate(ROUTES.PROFILE_POSTS, {
      userAddress: address,
      initialTabsRouteName: ROUTES.PROFILE_POSTS_POSTS,
    });
  }, []);

  const handleConnectionButtonPressed = useCallback(() => {
    navigate(ROUTES.MANAGE_CONNECTIONS_MODAL, {
      appsConnected: true,
      chainsConnected: true,
    });
  }, []);

  if (globalLoading) {
    return (
      <SafeAreaView style={styles.flexCenter}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(300)}>
      <StatusBar barStyle="light-content" />
      <ImageButton
        image={profileBack}
        buttonStyle={styles.buttonStyleLeft}
        style={styles.topBarImage}
        onPress={goBack}
      />
      <ImageButton
        image={profileSettings}
        buttonStyle={[styles.buttonStyleRight, {right: 20}]}
        style={styles.topBarImage}
        onPress={() => navigate(ROUTES.SETTINGS)}
      />
      <ImageButton
        image={profileNotification}
        buttonStyle={[styles.buttonStyleRight, {right: 60}]}
        style={styles.topBarImage}
        overlayComponent={
          <PingAnimation size={10} color={theme.colors.red01} />
        }
        overlayPosition={{
          top: 2,
          left: 12,
        }}
        onPress={() => navigate(ROUTES.ACTIVITIES)}
      />
      <ImageButton
        image={profileScan}
        buttonStyle={[styles.buttonStyleRight, {right: 100}]}
        style={styles.topBarImage}
      />

      {/* Refresh arrow iOS */}
      <ClassicAnimated.View
        style={[
          styles.arrowView,
          {
            opacity: scrollY.interpolate({
              inputRange: [-40, 0],
              outputRange: [1, 0],
            }),
            transform: [
              {
                rotate: scrollY.interpolate({
                  inputRange: [-75, -15],
                  outputRange: ['180deg', '0deg'],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}>
        <Icon name="arrow-down" color="white" size={25} />
      </ClassicAnimated.View>

      {/* Dtag */}
      <ClassicAnimated.View
        style={[
          styles.animatedDtag,
          {
            opacity: scrollY.interpolate({
              inputRange: [160, 200],
              outputRange: [0, 1],
            }),
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [140, 200],
                  outputRange: [30, 0],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}>
        <View
          style={{
            paddingTop: theme.spacing.s,
          }}>
          <Typography.Subtitle3 numberOfLines={1} style={styles.dtag}>
            @{dtag}
          </Typography.Subtitle3>
        </View>
      </ClassicAnimated.View>

      {/* Banner */}
      <AnimatedImageBackground
        resizeMode="cover"
        source={{uri: cover_pic}}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          zIndex: 0,
          height: HEADER_HEIGHT_EXPANDED + HEADER_HEIGHT_COMPACT,
          transform: [
            {
              scale: scrollY.interpolate({
                inputRange: [-200, 0],
                outputRange: [5, 1],
                extrapolateLeft: 'extend',
                extrapolateRight: 'clamp',
              }),
            },
          ],
        }}>
        <AnimatedBlurView
          blurType="dark"
          blurAmount={96}
          style={{
            ...StyleSheet.absoluteFillObject,
            zIndex: 2,
            opacity: scrollY.interpolate({
              inputRange: [-50, 0, 50, 100],
              outputRange: [1, 0, 0, 1],
            }),
          }}
        />
      </AnimatedImageBackground>
      {/* Tweets/profile */}
      <AnimatedFastImage
        source={{uri: profile_pic}}
        style={{
          opacity: scrollY.interpolate({
            inputRange: [0, HEADER_HEIGHT_EXPANDED],
            outputRange: [1, 0],
            extrapolate: 'clamp',
          }),
          zIndex: 2,
          position: 'absolute',
          width: 100,
          height: 100,
          borderRadius: 50,
          borderWidth: 3,
          top: scrollOffset,
          left: theme.spacing.m,
          borderColor: theme.colors.white,
          transform: [
            {
              scale: scrollY.interpolate({
                inputRange: [0, HEADER_HEIGHT_EXPANDED],
                outputRange: [1, 0.5],
                extrapolate: 'clamp',
              }),
            },
            {
              translateY: scrollY.interpolate({
                inputRange: [0, HEADER_HEIGHT_EXPANDED],
                outputRange: [0, 67],
                extrapolate: 'clamp',
              }),
            },
          ],
        }}
      />
      <ClassicAnimated.ScrollView
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        style={{
          marginTop: HEADER_HEIGHT_COMPACT,
          paddingTop: HEADER_HEIGHT_EXPANDED,
        }}>
        <View style={styles.contentContainer}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'row', right: 0, marginLeft: 'auto'}}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Typography.Subtitle3>12</Typography.Subtitle3>
                <Typography.Caption1>Posts</Typography.Caption1>
              </View>
              <View style={styles.centerLeftSpacingM}>
                <Typography.Subtitle3>12</Typography.Subtitle3>
                <Typography.Caption1>Following</Typography.Caption1>
              </View>
              <View style={styles.centerLeftSpacingM}>
                <Typography.Subtitle3>12</Typography.Subtitle3>
                <Typography.Caption1>Followers</Typography.Caption1>
              </View>
            </View>
          </View>

          <Typography.H5
            style={{
              marginTop: 10,
            }}
            numberOfLines={1}>
            {nickname}
          </Typography.H5>

          <Typography.Body7
            style={{
              marginVertical: 4,
              color: theme.colors.darkGrey,
            }}
            numberOfLines={1}>
            @{dtag}
          </Typography.Body7>

          <AddressCopy address={address} />

          <Spacer paddingVertical={theme.spacing.m}>
            <UserBio content={bio} />
          </Spacer>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity style={styles.editButton}>
              <Typography.Subtitle4>{t('edit profile')}</Typography.Subtitle4>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConnectionButtonPressed}
              style={{
                backgroundColor: theme.colors.surfaceGrey,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
                height: 35,
                width: 40,
              }}>
              <FastImage
                source={connectIcon}
                style={{height: 22, width: 22}}
                tintColor={theme.colors.surfaceBlack}
              />
            </TouchableOpacity>
          </View>
          <Spacer paddingVertical={theme.spacing.s} />
          <Divider style={styles.divider} />
          <View style={styles.container}>
            <BalanceSection />
            <Divider style={styles.divider} />
            <PostsSection onPress={handlePostsSectionPressed} />
            <Divider style={styles.divider} />
            <NftsSection />
            <Divider style={styles.divider} />
            <BadgesSection />
          </View>
        </View>
      </ClassicAnimated.ScrollView>
    </Animated.View>
  );
};

export default Profile_V2;
