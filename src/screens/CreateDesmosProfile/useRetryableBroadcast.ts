import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {modalFail} from 'assets/images';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useCallback, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import useResetAfterRoute from './useResetAfterRoute';

function useRetryableBroadcast() {
  type navigateType = typeof navigation.push | typeof navigation.replace;
  const navigation =
    useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const broadcastActionRef = useRef<(pushOrReplace: navigateType) => void>();
  const {t} = useTranslation();
  const resetAfterRoute = useResetAfterRoute();
  const failureAction = useCallback(
    (errorMessage?: string) => {
      resetAfterRoute(ROUTES.ADD_PROFILE, {
        name: ROUTES.FULLSCREEN_STATUS_SCREEN,
        params: {
          title: t('resultModal:failed'),
          subtitle: errorMessage
            ? t('createProfile:yourDesmosProfileIsNotCreated', {
                error: errorMessage.replace(/[.,]\s*$/, ''),
              })
            : t('common:oopsSomethingWentWrongPleaseTryAgainLater'),
          buttonLabel: t('common:retry'),
          handleButtonPress() {
            if (broadcastActionRef.current) {
              broadcastActionRef.current(navigation.replace);
            } else {
              // ADD_PROFILE > CONNECT_ADDRESS_GENERAL > CREATE_DESMOS_PROFILE
              navigation.goBack();
            }
          },
          secondaryButtonLabel: t('common:goToProfile'),
          image: modalFail,
          handleSecondaryButtonPress() {
            // User taps on the Go to Profile to get redirected to their profile page
            navigation.navigate(ROUTES.ADD_PROFILE);
          },
          handleBackgroundPress() {
            // User taps on the background to get redirected to the Add profile page
            navigation.navigate(ROUTES.ADD_PROFILE);
          },
        },
      });
    },
    [navigation],
  );
  return {broadcastActionRef, failureAction};
}

export default useRetryableBroadcast;
