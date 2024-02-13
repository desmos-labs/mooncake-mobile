import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { dotsAnimation } from 'assets/animations';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import ThemedLottieView from 'components/ThemedLottieView';
import { makeStyle } from 'config/theme';
import { isGoBackEvent } from 'lib/EventUtils';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { View } from 'react-native';
import { scale } from 'react-native-size-matters';

export interface LoadingScreenParams {
  /**
   * The title that will be displayed in bold above the message.
   */
  readonly title: string;
  /**
   *  The message that will be displayed to the user.
   */
  readonly message: string;
}

type NavProps = NativeStackScreenProps<RootNavigatorParamList, ROUTES.LOADING_SCREEN>;

/**
 * Screen that displays a loading animation with a title an a message.
 * NOTE: This screen can only be removed using the pop method.
 */
const LoadingScreen: React.FC<NavProps> = ({
  navigation,
  route: {
    params: { title, message },
  },
}) => {
  const styles = useStyles();

  // Prevent going back.
  React.useEffect(() => {
    return navigation.addListener('beforeRemove', e => {
      if (!__DEV__ && isGoBackEvent(e)) {
        e.preventDefault();
      }
    });
  }, [navigation]);

  return (
    <DView disableHideKeyboardTouchable>
      <View style={{ alignItems: 'center' }}>
        <Spacer paddingTop={scale(127)} />
        <ThemedLottieView style={styles.loadingAnimation} source={dotsAnimation} autoPlay loop />
        <Spacer paddingTop={20} />
        <Typography.H4>{title}</Typography.H4>
        <Spacer paddingTop="s" />
        <Typography.Regular16>{message}</Typography.Regular16>
      </View>
    </DView>
  );
};

const useStyles = makeStyle(() => ({
  loadingAnimation: {
    width: 127,
    height: 127,
  },
}));

export default LoadingScreen;
