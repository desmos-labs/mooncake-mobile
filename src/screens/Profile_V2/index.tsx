import {BlurView} from '@react-native-community/blur';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {
  connectIcon,
  defaultBanner,
  defaultProfilePic,
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
import React, {useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Animated,
  ImageBackground,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Divider, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import PingAnimation from 'screens/Profile/components/PingAnimation';
import AddressCopy from 'screens/Profile_V2/components/AddressCopy';
import BalanceSection from 'screens/Profile_V2/components/BalanceSection';
import PostsSection from 'screens/Profile_V2/components/PostsSection';
import UserBio from 'screens/Profile_V2/components/UserBio';
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

  /** Animations start */
  const AnimatedImageBackground =
    Animated.createAnimatedComponent(ImageBackground);
  const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);
  const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollOffset = useRef(
    new Animated.Value(45 + HEADER_HEIGHT_EXPANDED),
  ).current;
  const scrollProgress = useRef(new Animated.Value(0)).current;

  const scrollHandler = (event: any) => {
    const {contentOffset, contentSize, layoutMeasurement} = event.nativeEvent;
    const denominator = contentSize.height - layoutMeasurement.height;
    const numerator = contentOffset.y;

    scrollOffset.setValue(45 + HEADER_HEIGHT_EXPANDED - contentOffset.y);
    scrollY.setValue(contentOffset.y);
    scrollProgress.setValue(Math.min(Math.max(numerator / denominator, 0), 1));
  };
  /** Animations end */

  return (
    <View style={styles.container}>
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
      />
      <ImageButton
        image={profileNotification}
        buttonStyle={[styles.buttonStyleRight, {right: 60}]}
        style={styles.topBarImage}
        overlayComponent={
          <PingAnimation size={10} color={theme.colors.butterOrange01} />
        }
        overlayPosition={{
          top: 2,
          left: 12,
        }}
      />
      <ImageButton
        image={profileScan}
        buttonStyle={[styles.buttonStyleRight, {right: 100}]}
        style={styles.topBarImage}
      />

      {/* Refresh arrow */}
      <Animated.View
        style={{
          zIndex: 2,
          position: 'absolute',
          top: insets.top + 13,
          left: 0,
          right: 0,
          alignItems: 'center',
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
        }}>
        <Icon name="arrow-down" color="white" size={25} />
      </Animated.View>

      {/* Name + tweets count */}
      <Animated.View
        style={{
          zIndex: 2,
          position: 'absolute',
          top: insets.top + 7,
          left: 0,
          right: 0,
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
        }}>
        <View
          style={{
            paddingTop: theme.spacing.s,
          }}>
          <Typography.Subtitle3
            numberOfLines={1}
            style={{
              color: theme.colors.white,
              alignSelf: 'center',
              maxWidth: '25%',
            }}>
            @alemazzzzzzzz
          </Typography.Subtitle3>
        </View>
      </Animated.View>

      {/* Banner */}
      <AnimatedImageBackground
        source={defaultBanner}
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
        source={defaultProfilePic}
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
      <Animated.ScrollView
        overScrollMode="never"
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
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: theme.spacing.m,
                }}>
                <Typography.Subtitle3>12</Typography.Subtitle3>
                <Typography.Caption1>Following</Typography.Caption1>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: theme.spacing.m,
                }}>
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
            Alessandro Mazzon
          </Typography.H5>

          <Typography.Body7
            style={{
              marginVertical: 4,
              color: theme.colors.darkGrey,
            }}
            numberOfLines={1}>
            @alemaz
          </Typography.Body7>

          <AddressCopy address="desmos12312321312312" />

          <Spacer paddingVertical={theme.spacing.m}>
            <UserBio content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sit amet purus sit amet dolor mollis suscipit. Nunc vitae elit sapien. Curabitur eu suscipit elit. Praesent at interdum ligula, ac semper dui. Nam eget tortor vitae nunc aliquam lacinia. Sed sollicitudin, magna pharetra porttitor ullamcorper, elit lacus convallis elit, vel tincidunt diam felis sed libero. Duis tempus ornare nisi, sed suscipit purus semper nec. Sed turpis dolor, feugiat eu massa sed, fringilla tristique dui. Aliquam euismod purus a molestie vestibulum. Suspendisse potenti." />
          </Spacer>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
              style={{
                backgroundColor: theme.colors.surfaceGrey,
                height: 35,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
                flex: 0.95,
              }}>
              <Typography.Subtitle4>{t('edit profile')}</Typography.Subtitle4>
            </TouchableOpacity>
            <TouchableOpacity
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
            <PostsSection posts={[]} />
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default Profile_V2;
