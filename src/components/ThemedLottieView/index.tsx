import LottieView from 'lottie-react-native';
import React, {useMemo} from 'react';
import {useTheme} from 'react-native-paper';
import {broadcastAnim, pairDevicesAnim} from 'assets/animations';

export type DesmosAnimations =
  | 'broadcast-tx'
  | 'looking-for-devices'
  | 'connect-to-ledger'
  | 'loading';

type Props = Omit<React.ComponentProps<typeof LottieView>, 'source'> & {
  source: DesmosAnimations;
};

// TODO with multiple themes this is ready to support different animations
const ThemedLottieView: React.FC<Props> = props => {
  const {source} = props;
  const theme = useTheme();

  const themeMode = React.useMemo(() => {
    return theme.dark ? 'dark' : 'light';
  }, [theme.dark]);

  const animation = useMemo(() => {
    switch (source) {
      case 'broadcast-tx':
        return broadcastAnim[themeMode];
      case 'connect-to-ledger':
        return pairDevicesAnim[themeMode];
      default:
        throw new Error(`Unknown animation ${source}`);
    }
  }, [theme, source]);

  return <LottieView {...props} source={animation} />;
};

export default ThemedLottieView;
