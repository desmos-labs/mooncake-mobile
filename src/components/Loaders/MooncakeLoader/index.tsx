import { landingPageAnimation } from 'assets/animations';
import ThemedLottieView from 'components/ThemedLottieView';
import { makeStyle } from 'config/theme';
import React from 'react';

interface Props {
  speed?: number;
}

const MooncakeLoader = ({ speed }: Props) => {
  const styles = useStyles();
  return (
    <ThemedLottieView
      style={styles.animation}
      source={landingPageAnimation}
      autoPlay
      loop
      speed={speed}
    />
  );
};

const useStyles = makeStyle(() => ({
  animation: {
    width: 88,
    height: 88,
  },
}));

export default MooncakeLoader;
