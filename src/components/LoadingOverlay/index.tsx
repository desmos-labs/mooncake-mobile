import React from 'react';
import ThemedLottieView from 'components/ThemedLottieView';
import { loadingOrange } from 'assets/animations';
import { StyleSheet, View } from 'react-native';

type Props = {
  /**
   * Display the overlay.
   */
  isVisible: boolean;

  /**
   * For pages with components that have a higher zIndex.
   */
  zIndexOverride?: number;
};

const LoadingOverlay = ({ isVisible, zIndexOverride = 2 }: Props) => {
  if (!isVisible) {
    return null;
  }
  return (
    <View
      style={[
        styles.container,
        {
          zIndex: zIndexOverride,
        },
      ]}>
      <ThemedLottieView
        style={styles.lottieView}
        autoPlay
        loop={true}
        source={loadingOrange}
        resizeMode="cover"
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
