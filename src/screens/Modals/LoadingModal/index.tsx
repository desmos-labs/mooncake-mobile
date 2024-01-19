import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { dotsAnimation, squaresAnimation } from 'assets/animations';
import Spacer from 'components/Spacer';
import ThemedLottieView from 'components/ThemedLottieView';
import { makeStyle } from 'config/theme';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { View } from 'react-native';
import { isGoBackEvent } from 'lib/EventUtils';

export enum LoadingAnimation {
  Squares = 'squares',
  Dots = 'dots',
}

export interface LoadingModalParams {
  /**
   * Optional text that will be displayed above the message.
   */
  readonly title?: string;

  /**
   * The message to display.
   */
  readonly message: string;

  /**
   * The animation to use.
   * @default LoadingAnimation.Squares
   */
  readonly animation?: LoadingAnimation;

  /**
   * Whether the back action should be blocked.
   */
  readonly blockBackAction?: boolean;
}

type NavProps = NativeStackScreenProps<RootNavigatorParamList, ROUTES.LOADING_MODAL>;

/**
 * A simple component that shows
 * a loading modal.
 */
const LoadingModal: React.FC<NavProps> = ({
  navigation,
  route: {
    params: { title, message, blockBackAction, animation = LoadingAnimation.Squares },
  },
}) => {
  const styles = useStyles();

  const lottieAnimation = React.useMemo(() => {
    if (animation === LoadingAnimation.Squares) {
      return squaresAnimation;
    } else {
      return dotsAnimation;
    }
  }, [animation]);

  React.useEffect(() => {
    return navigation.addListener('beforeRemove', e => {
      if (blockBackAction && isGoBackEvent(e)) {
        e.preventDefault();
      }
    });
  }, [blockBackAction, navigation]);

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <ThemedLottieView
          style={styles.loadingView}
          autoPlay
          loop={true}
          source={lottieAnimation}
          resizeMode="cover"
        />
        <Spacer paddingTop="m" />
        {title && <Typography.H6 style={styles.message}>{title}</Typography.H6>}
        <Typography.Regular16 style={styles.message}>{message}</Typography.Regular16>
      </View>
    </View>
  );
};

export default LoadingModal;

const useStyles = makeStyle(theme => ({
  root: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    alignSelf: 'center',
    marginHorizontal: '10%',
    padding: theme.spacing.xl,
    borderRadius: 18,
    backgroundColor: theme.colors.white,
  },
  message: {
    textAlign: 'center',
  },
  loadingView: {
    alignSelf: 'center',
    width: '25%',
  },
}));
