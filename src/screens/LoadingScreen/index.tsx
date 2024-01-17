import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DView from 'components/DView';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import ThemedLottieView from 'components/ThemedLottieView';
import { dotsAnimation } from 'assets/animations';
import Typography from 'components/Typography';
import { Center } from 'native-base';
import Spacer from 'components/Spacer';
import { makeStyle } from 'config/theme';
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
      if (!__DEV__ && e.data.action.type === 'GO_BACK') {
        e.preventDefault();
      }
    });
  }, [navigation]);

  return (
    <DView disableHideKeyboardTouchable>
      <Center>
        <Spacer paddingTop={scale(127)} />
        <ThemedLottieView style={styles.loadingAnimation} source={dotsAnimation} autoPlay loop />
        <Spacer paddingTop={20} />
        <Typography.H4>{title}</Typography.H4>
        <Spacer paddingTop="s" />
        <Typography.Body6>{message}</Typography.Body6>
      </Center>
    </DView>
  );
};

const useStyles = makeStyle(() => ({
  loadingAnimation: {
    widyhe: 127,
    height: 127,
  },
}));

export default LoadingScreen;
