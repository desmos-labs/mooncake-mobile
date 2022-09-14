import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import ImageButton from 'components/ImageButton';
import {
  profileBack,
  profileNotification,
  profileScan,
  profileSettings,
} from 'assets/images';
import PingAnimation from 'screens/Profile/components/PingAnimation';
import {useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {BlurView} from '@react-native-community/blur';
import Typography from 'components/Typography';
import useStyles from './useStyles';

type Props = {
  disableRightButtons: boolean;

  handlePressHome: () => void;

  handlePressNotification: () => void;

  handlePressSettings: () => void;

  handlePressScan: () => void;

  /**
   * Whether to show the pinging animation on the notification button.
   */
  hasNotification?: boolean;

  /**
   * The string that will fade-in on the center of the header.
   */
  username: string;

  /**
   * The user's banner image which will be used as fill-color for the blur.
   */
  bannerImage: ImageSourcePropType;

  /**
   * The animation driver. It should be a progress calculated from the y-offset
   * of a scrollview on the parent component.
   */
  scrollProgress: SharedValue<number>;
};

/**
 * The Back, scan, notification, and settings button found on the profile screen.
 */
const ProfileHeader = ({
  disableRightButtons,
  handlePressHome,
  handlePressNotification,
  hasNotification,
  handlePressScan,
  handlePressSettings,
  scrollProgress,
  bannerImage,
  username,
}: Props) => {
  const theme = useTheme();
  const styles = useStyles();

  const animatedOpacityStyle = useAnimatedStyle(() => {
    const interpolatedOpacity = interpolate(
      scrollProgress.value,
      [0, 0.4],
      [0, 1],
      {extrapolateRight: Extrapolation.CLAMP},
    );
    return {opacity: interpolatedOpacity};
  });

  // The scan button is the only button that gets covered by the blurred
  // background, so we need to switch out the z-index before the background
  // has completely faded-in
  const animatedScanButtonStyle = useAnimatedStyle(() => {
    const interpolatedOpacity = interpolate(
      scrollProgress.value,
      [0, 0.4],
      [0, 1],
      {extrapolateRight: Extrapolation.CLAMP},
    );

    if (interpolatedOpacity >= 0.3) return {zIndex: 0};

    return {zIndex: 2};
  });

  return (
    <SafeAreaView edges={['top']} style={styles.safeAreaView}>
      <View style={styles.container}>
        <View
          style={{
            zIndex: 2,
          }}>
          <ImageButton
            image={profileBack}
            style={styles.buttonStyle}
            onPress={handlePressHome}
          />
        </View>

        {/* each of the buttons are have position:'absolute' as wrapping them in */}
        {/* a horizontal flexbox would not work as only the scanButton will get */}
        {/* hidden by the blurred background (zIndex issues) */}
        {!disableRightButtons && (
          <>
            <Animated.View
              style={[
                animatedScanButtonStyle,
                styles.buttonWrapper,
                {right: (theme.spacing.m as number) * 7},
              ]}>
              <ImageButton
                image={profileScan}
                style={styles.buttonStyle}
                onPress={handlePressScan}
              />
            </Animated.View>

            <View
              style={[
                styles.buttonWrapper,
                {right: (theme.spacing.m as number) * 4},
              ]}>
              <ImageButton
                image={profileNotification}
                style={styles.buttonStyle}
                overlayComponent={
                  hasNotification ? (
                    <PingAnimation
                      size={10}
                      color={theme.colors.butterOrange01}
                    />
                  ) : undefined
                }
                overlayPosition={{
                  top: 2,
                  left: 12,
                }}
                onPress={handlePressNotification}
              />
            </View>

            <View style={[styles.buttonWrapper, {right: theme.spacing.m}]}>
              <ImageButton
                image={profileSettings}
                style={styles.buttonStyle}
                onPress={handlePressSettings}
              />
            </View>
          </>
        )}
        <Animated.View style={[styles.blurContainer, animatedOpacityStyle]}>
          <Image
            source={bannerImage}
            resizeMode="contain"
            style={[StyleSheet.absoluteFillObject, {opacity: 0.5}]}
          />
          {Platform.OS === 'ios' && (
            <BlurView
              style={StyleSheet.absoluteFillObject}
              blurType="light"
              blurAmount={8}
              blurRadius={16}
              pointerEvents="none"
              reducedTransparencyFallbackColor="white"
            />
          )}
        </Animated.View>

        <Animated.View
          style={[animatedOpacityStyle, styles.usernameContainerStyle]}>
          <Typography.Subtitle2 style={styles.usernameStyle}>
            {username}
          </Typography.Subtitle2>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileHeader;
