import React from 'react';
import {StyleSheet, View} from 'react-native';
import ImageButton from 'components/ImageButton';
import {
  profileBack,
  profileNotification,
  profileScan,
  profileSettings,
} from 'assets/images';
import PingAnimation from 'screens/Profile/components/PingAnimation';
import {useTheme} from 'react-native-paper';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {BlurView} from '@react-native-community/blur';
import useStyles from './useStyles';

type Props = {
  handlePressHome: () => void;

  handlePressNotification: () => void;

  handlePressSettings: () => void;

  handlePressScan: () => void;

  hasNotification?: boolean;

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
}: Props) => {
  const theme = useTheme();
  const styles = useStyles();

  const {top} = useSafeAreaInsets();

  const animatedOpacity = useAnimatedStyle(() => {
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

  const bottomLayer = React.useMemo(() => {
    return (
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
            {
              position: 'absolute',
              top: 16,
              right: 32 * 4,
              zIndex: 2,
            },
          ]}>
          <ImageButton
            image={profileScan}
            style={styles.buttonStyle}
            onPress={handlePressScan}
          />
        </Animated.View>

        <View
          style={{
            position: 'absolute',
            top: 16,
            right: 32 * 2 + 16,
            zIndex: 2,
          }}>
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

        <View
          style={{
            position: 'absolute',
            top: 16,
            right: 32,
            zIndex: 2,
          }}>
          <ImageButton
            image={profileSettings}
            style={styles.buttonStyle}
            onPress={handlePressSettings}
          />
        </View>
        <Animated.View style={[StyleSheet.absoluteFillObject, animatedOpacity]}>
          <BlurView
            style={{
              // offset the safearea top margin so the background can cover
              // the status bar
              ...StyleSheet.absoluteFillObject,
              top: -top,
            }}
            blurType="light"
            blurAmount={8}
            blurRadius={16}
            pointerEvents="none"
            reducedTransparencyFallbackColor="white"
          />
        </Animated.View>
      </View>
    );
  }, []);

  return (
    <SafeAreaView edges={['top']} style={{position: 'absolute', width: '100%'}}>
      {bottomLayer}
    </SafeAreaView>
  );
};

export default ProfileTopButtons;
