import React from 'react';
import {Image, ImageSourcePropType, StyleSheet, View} from 'react-native';
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
  useAnimatedStyle,
} from 'react-native-reanimated';
import {BlurView} from '@react-native-community/blur';
import Typography from 'components/Typography';
import useStyles from './useStyles';

type Props = {
  handlePressHome: () => void;

  handlePressNotification: () => void;

  handlePressSettings: () => void;

  handlePressScan: () => void;

  hasNotification?: boolean;

  username: string;

  bannerImage: ImageSourcePropType;

  scrollProgress: any;
};

/**
 * The Back, scan, notification, and settings button found on the profile screen.
 */
const ProfileTopButtons = ({
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

        <Animated.View
          style={[
            animatedScanButtonStyle,
            styles.buttonWrapper,
            {right: 32 * 4},
          ]}>
          <ImageButton
            image={profileScan}
            style={styles.buttonStyle}
            onPress={handlePressScan}
          />
        </Animated.View>

        <View style={[styles.buttonWrapper, {right: 32 * 2 + 16}]}>
          <ImageButton
            image={profileNotification}
            style={styles.buttonStyle}
            overlayComponent={
              hasNotification ? (
                <PingAnimation size={10} color={theme.colors.desmosOrange01} />
              ) : undefined
            }
            overlayPosition={{
              top: 2,
              left: 12,
            }}
            onPress={handlePressNotification}
          />
        </View>

        <View style={[styles.buttonWrapper, {right: 32}]}>
          <ImageButton
            image={profileSettings}
            style={styles.buttonStyle}
            onPress={handlePressSettings}
          />
        </View>
        <Animated.View style={[styles.blurContainer, animatedOpacityStyle]}>
          <Image
            source={bannerImage}
            resizeMode="contain"
            style={[StyleSheet.absoluteFillObject, {opacity: 0.5}]}
          />
          <BlurView
            style={StyleSheet.absoluteFillObject}
            blurType="light"
            blurAmount={8}
            blurRadius={16}
            pointerEvents="none"
            reducedTransparencyFallbackColor="white"
          />
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

export default ProfileTopButtons;
