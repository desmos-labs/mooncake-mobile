import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {modalFail} from 'assets/images';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useCallback, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import useResetAfterRoute from './NavigationRoute';

function useRetryableBoardcast() {
  type navigateType = typeof navigation.push | typeof navigation.replace;
  const navigation =
    useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const resetAfterRoute = useResetAfterRoute();
  const boardcastAction = useRef<(pushOrReplace: navigateType) => void>();
  const {t} = useTranslation();
  const failureAction = useCallback(
    (errorMessage?: string) => {
      resetAfterRoute(ROUTES.SETTINGS_PROFILES, {
        name: ROUTES.FULLSCREEN_STATUS_SCREEN,
        params: {
          title: t('resultModal:failed'),
          subtitle: errorMessage
            ? t('yourDesmosProfileIsNotCreated', {
                error: errorMessage.replace(/[.,]\s*$/, ''),
              })
            : t('common:oopsSomethingWentWrongPleaseTryAgainLater'),
          buttonLabel: t('common:retry'),
          handleButtonPress() {
            if (boardcastAction.current) {
              boardcastAction.current(navigation.replace);
            } else {
              navigation.goBack();
            }
          },
          secondaryButtonLabel: t('common:goToProfile'),
          image: modalFail,
          handleSecondaryButtonPress() {
            navigation.navigate(ROUTES.SETTINGS_PROFILES);
          },
          handleBackgroundPress() {
            navigation.navigate(ROUTES.SETTINGS_PROFILES);
          },
        },
      });
    },
    [navigation],
  );
  return {boardcastAction, failureAction};
}

export default useRetryableBoardcast;
