import React from 'react';
import ThemedLottieView from 'components/ThemedLottieView';
import {buildingBlockAnim} from 'assets/animations';
import {StyleSheet, View} from 'react-native';

type Props = {
  /**
   * Display the overlay.
   */
  isVisible: boolean;
};

const LoadingOverlay = ({isVisible}: Props) => {
  if (!isVisible) {
    return null;
  }
  return (
    <View style={styles.container}>
      <ThemedLottieView
        style={styles.lottieView}
        autoPlay
        source={buildingBlockAnim}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
  },
  lottieView: {
    width: '25%',
  },
});

export default LoadingOverlay;
