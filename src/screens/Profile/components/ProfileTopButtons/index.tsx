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
import Spacer from 'components/Spacer';
import {useTheme} from 'react-native-paper';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import useStyles from './useStyles';

type Props = {
  handlePressHome: () => void;

  handlePressNotification: () => void;

  handlePressSettings: () => void;

  handlePressScan: () => void;

  hasNotification?: boolean;

  animatedOpacity: any;
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
  animatedOpacity,
}: Props) => {
  const theme = useTheme();
  const styles = useStyles();

  const {top} = useSafeAreaInsets();

  const bottomLayer = React.useMemo(() => {
    return (
      <View style={styles.container}>
        <ImageButton
          image={profileBack}
          style={styles.buttonStyle}
          onPress={handlePressHome}
        />

        <View style={styles.buttonRow}>
          <ImageButton
            image={profileScan}
            style={styles.buttonStyle}
            onPress={handlePressScan}
          />

          <Spacer paddingHorizontal={theme.spacing.m}>
            <ImageButton
              image={profileNotification}
              style={styles.buttonStyle}
              overlayComponent={
                hasNotification ? (
                  <PingAnimation
                    size={10}
                    color={theme.colors.desmosOrange01}
                  />
                ) : undefined
              }
              overlayPosition={{
                top: 2,
                left: 12,
              }}
              onPress={handlePressNotification}
            />
          </Spacer>

          <ImageButton
            image={profileSettings}
            style={styles.buttonStyle}
            onPress={handlePressSettings}
          />
        </View>
      </View>
    );
  }, []);

  const topLayer = React.useMemo(() => {
    return (
      <Animated.View
        style={[
          {marginTop: top},
          styles.container,
          styles.topLayer,
          animatedOpacity,
        ]}>
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'red',
            top: -top,
          }}
        />
        <ImageButton
          image={profileBack}
          style={styles.buttonStyle}
          onPress={handlePressHome}
        />

        <View style={styles.buttonRow}>
          <ImageButton
            image={profileScan}
            style={styles.buttonStyle}
            onPress={handlePressScan}
          />

          <Spacer paddingHorizontal={theme.spacing.m}>
            <ImageButton
              image={profileNotification}
              style={styles.buttonStyle}
              overlayComponent={
                hasNotification ? (
                  <PingAnimation
                    size={10}
                    color={theme.colors.desmosOrange01}
                  />
                ) : undefined
              }
              overlayPosition={{
                top: 2,
                left: 12,
              }}
              onPress={handlePressNotification}
            />
          </Spacer>

          <ImageButton
            image={profileSettings}
            style={styles.buttonStyle}
            onPress={handlePressSettings}
          />
        </View>
      </Animated.View>
    );
  }, []);

  return (
    <SafeAreaView edges={['top']}>
      {bottomLayer}
      {topLayer}
    </SafeAreaView>
  );
};

export default ProfileTopButtons;
