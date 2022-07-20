import {broadcastingAnimation} from 'assets/animations/animations';
import LottieView from 'lottie-react-native';
import React, {useMemo} from 'react';
import {useTheme} from 'react-native-paper';

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
  const animation = useMemo(() => {
    switch (source) {
      case 'broadcast-tx':
        return broadcastingAnimation;
      default:
        throw new Error(`Unknown animation ${source}`);
    }
  }, [theme, source]);

  return <LottieView {...props} source={animation} />;
};

export default ThemedLottieView;
