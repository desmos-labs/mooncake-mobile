import React from 'react';
import {useTheme} from 'react-native-paper';
import {pairDevicesDark, pairDevicesLight} from 'assets/animations';
import Lottie from 'lottie-react-native';
import {verticalScale} from 'react-native-size-matters';

const ConnectingAnimation = () => {
  const theme = useTheme();

  const animation = React.useMemo(() => {
    if (theme.dark) {
      return pairDevicesDark;
    }
    return pairDevicesLight;
  }, [theme.dark]);

  return (
    <Lottie
      style={{
        width: '100%',
        height: verticalScale(150),
        alignSelf: 'center',
      }}
      source={animation}
      autoPlay
      loop
    />
  );
};

export default ConnectingAnimation;
