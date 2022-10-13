import LottieView from 'lottie-react-native';
import React, {useMemo} from 'react';
import {useTheme} from 'react-native-paper';

type Props = Omit<React.ComponentProps<typeof LottieView>, 'source'> & {
  source: LottieAnimation;
};

const ThemedLottieView: React.FC<Props> = props => {
  const {source} = props;
  const theme = useTheme();

  const themeMode = React.useMemo(() => {
    return theme.dark ? 'dark' : 'light';
  }, [theme.dark]);

  const animation = useMemo(() => {
    return source[themeMode];
  }, [theme, source]);

  return <LottieView {...props} source={animation} loop={true} />;
};

export default ThemedLottieView;
