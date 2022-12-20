import {BlurView} from '@react-native-community/blur';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
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
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  ImageBackground,
  InteractionManager,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Divider, useTheme} from 'react-native-paper';
import Animated, {
  Extrapolation,
  FadeIn,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PingAnimation from 'screens/Profile/components/PingAnimation';
import {
  mapConnectedAppImages,
  mapConnectedChainImages,
} from 'screens/Profile/utils';
import AddressCopy from 'screens/Profile_V2/components/AddressCopy';
import BadgesSection from 'screens/Profile_V2/components/BadgesSection';
import BalanceSection from 'screens/Profile_V2/components/BalanceSection';
import ImpactPointsSection from 'screens/Profile_V2/components/ImpactPointsSection';
import NftsSection from 'screens/Profile_V2/components/NftsSection';
import PostsSection from 'screens/Profile_V2/components/PostsSection';
import SocialAndWalletsCountersBar from 'screens/Profile_V2/components/SocialAndWalletsCountersBar';
import UserBio from 'screens/Profile_V2/components/UserBio';
import useProfileDataQueries from 'screens/Profile_V2/useProfileDataQueries';
import useQueries from 'screens/Profile_V2/useQueries';
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
  const [initialLoading, setInitialLoading] = useState(true);

  const {
    profileLoading,
    nickname,
    dtag,
    bio,
    address,
    profile_pic,
    cover_pic,
    screenMode,
    refetchProfileData,
    refetchVisitingProfileData,
    numRelationships,
    refreshNumRelationships,
  } = useProfileDataQueries(params?.visitingProfileAddress);

  const {
    appLinks,
    appLinksLoading,
    refetchAppLinks,
    chainLinksLoading,
    chainLinks,
    refetchChainLinks,
    refetchBalance,
    refetchPosts,
    refetchImpactPoints,
  } = useQueries();

  /** Animations start */
  const AnimatedImageBackground =
    Animated.createAnimatedComponent(ImageBackground);
  // @ts-ignore
  const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);
  const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
  const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

  const scrollY = useSharedValue(0);
  const scrollOffset = useSharedValue(45 + HEADER_HEIGHT_EXPANDED);

  const animatedDtagStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [160, 200], [0, 1]);

    const translateY = interpolate(scrollY.value, [140, 200], [30, 0], {
      extrapolateRight: Extrapolation.CLAMP,
      extrapolateLeft: Extrapolation.CLAMP,
    });

    return {
      opacity,
      transform: [{translateY}],
    };
  });

  const animatedImageBGStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [-200, 0], [5, 1], {
      extrapolateRight: Extrapolation.CLAMP,
      extrapolateLeft: Extrapolation.EXTEND,
    });

    return {
      transform: [{scale}],
    };
  });

  const animatedBlurStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [-50, 0, 50, 100], [1, 0, 0, 1]);

    return {
      opacity,
    };
  });

  const animatedProfilePicStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT_EXPANDED],
      [1, 0.5],
      {
        extrapolateRight: Extrapolation.CLAMP,
        extrapolateLeft: Extrapolation.CLAMP,
      },
    );

    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT_EXPANDED],
      [0, 46],
      {
        extrapolateRight: Extrapolation.CLAMP,
        extrapolateLeft: Extrapolation.CLAMP,
      },
    );

    const top = scrollOffset.value;
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT_EXPANDED],
      [1, 0],
      {
        extrapolateRight: Extrapolation.CLAMP,
        extrapolateLeft: Extrapolation.CLAMP,
      },
    );

    return {
      opacity,
      top,
      transform: [{translateY}, {scale}],
    };
  });

  /** Animations end */

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!profileLoading && !appLinksLoading && !chainLinksLoading) {
      timeout = setTimeout(() => setInitialLoading(false), 500);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [profileLoading, appLinksLoading, chainLinksLoading]);

  const handlePostsSectionPressed = () => {
    navigate(ROUTES.PROFILE_POSTS, {
      userAddress: address,
      initialTabsRouteName: ROUTES.PROFILE_POSTS_POSTS,
    });
  };

  const handleConnectionButtonPressed = useCallback(() => {
    navigate(ROUTES.MANAGE_CONNECTIONS_MODAL, {
      appsConnected: true,
      chainsConnected: true,
    });
  }, []);

  const refetchUserData = React.useCallback(() => {
    console.log(
      '[Profile_v2/index.tsx]: refetching user profile data, posts data and connected apps & chains',
    );
    if (screenMode === 'myProfile') {
      Promise.all([
        refetchProfileData(),
        refetchPosts(),
        refetchBalance(),
        refetchImpactPoints(),
        refetchChainLinks(),
        refetchAppLinks(),
      ]);
    } else {
      refetchVisitingProfileData();
    }
    refreshNumRelationships();
  }, [
    refetchProfileData,
    refetchPosts,
    refetchBalance,
    refetchChainLinks,
    refetchAppLinks,
  ]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      const {contentOffset} = event;
      scrollOffset.value = 45 + HEADER_HEIGHT_EXPANDED - contentOffset.y;
      scrollY.value = contentOffset.y;
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        refetchUserData();
      });

      return () => task.cancel();
    }, [refetchUserData]),
  );

  const ConnectedChains = React.useMemo(() => {
    const images = [
      ...mapConnectedChainImages(chainLinks),
      ...mapConnectedAppImages(appLinks),
    ];

    if (images.length > 3) images.length = 3;
    if (chainLinks.length !== 0 || appLinks.length !== 0) {
      return (
        <View>
          <SocialAndWalletsCountersBar
            loading={appLinksLoading && chainLinksLoading}
            connectedChainsCounter={chainLinks.length}
            twitterUsername={appLinks[0]?.username}
            connectedChainsImages={images}
            handlePressCounters={() => navigate(ROUTES.SETTINGS)}
          />
        </View>
      );
    }
    return undefined;
  }, [chainLinks, appLinks, appLinksLoading && chainLinksLoading]);

  if (initialLoading) {
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
      {/*      <ClassicAnimated.View
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
      </ClassicAnimated.View> */}

      {/* Dtag */}
      <Animated.View style={[styles.animatedDtag, animatedDtagStyle]}>
        <View
          style={{
            paddingTop: theme.spacing.s,
          }}>
          <Typography.Subtitle3 numberOfLines={1} style={styles.dtag}>
            @{dtag}
          </Typography.Subtitle3>
        </View>
      </Animated.View>

      {/* Banner */}
      <AnimatedImageBackground
        resizeMode="cover"
        source={{uri: cover_pic}}
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            zIndex: 0,
            height: HEADER_HEIGHT_EXPANDED + HEADER_HEIGHT_COMPACT,
          },
          animatedImageBGStyle,
        ]}>
        <AnimatedBlurView
          blurType="dark"
          blurAmount={96}
          style={[
            {
              ...StyleSheet.absoluteFillObject,
              zIndex: 2,
            },
            animatedBlurStyle,
          ]}
        />
      </AnimatedImageBackground>
      {/* Profile image */}
      <AnimatedFastImage
        source={{uri: profile_pic}}
        style={[
          {
            zIndex: 2,
            position: 'absolute',
            width: 100,
            height: 100,
            borderRadius: 50,
            borderWidth: 3,
            left: theme.spacing.m,
            borderColor: theme.colors.white,
          },
          animatedProfilePicStyle,
        ]}
      />
      <AnimatedScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={10}
        style={{
          marginTop: HEADER_HEIGHT_COMPACT,
          paddingTop: HEADER_HEIGHT_EXPANDED,
        }}>
        <View style={styles.contentContainer}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'row', right: 0, marginLeft: 'auto'}}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Typography.Subtitle3>0</Typography.Subtitle3>
                <Typography.Caption1>{t('posts')}</Typography.Caption1>
              </View>
              <View style={styles.centerLeftSpacingM}>
                <Typography.Subtitle3>
                  {numRelationships?.numFollowing || 0}
                </Typography.Subtitle3>
                <Typography.Caption1>{t('following')}</Typography.Caption1>
              </View>
              <View style={styles.centerLeftSpacingM}>
                <Typography.Subtitle3>
                  {numRelationships?.numFollowers || 0}
                </Typography.Subtitle3>
                <Typography.Caption1>{t('followers')}</Typography.Caption1>
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
            {ConnectedChains}
          </Spacer>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigate(ROUTES.EDIT_PROFILE)}>
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
            <ImpactPointsSection />
            <Divider style={styles.divider} />
            <BalanceSection />
            <Divider style={styles.divider} />
            <PostsSection onPress={handlePostsSectionPressed} />
            <Divider style={styles.divider} />
            <NftsSection />
            <Divider style={styles.divider} />
            <BadgesSection />
          </View>
        </View>
      </AnimatedScrollView>
    </Animated.View>
  );
};

export default Profile_V2;
