import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { butterflyLandingIcon, landingBG } from 'assets/images';
import Button, {ButtonMode, ButtonSize} from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import useRequestNotificationsPermission from 'hooks/notifications/useRequestNotificationsPermission';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useAppStateValue } from '@recoil/appState';
import { usePerformImportAccount } from 'screens/Landing/hooks';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.LANDING>;

/**
 * Screen that is shown to the user when they open the application for the first time.
 * From here, they can decide to create a new account, or import an existing one.
 * @constructor
 */
const Landing = () => {
  const theme = useTheme();
  const { t } = useTranslation('landing');
  const { navigate, replace } = useNavigation<NavProps['navigation']>();
  const styles = useStyles();

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const performImportAccount = usePerformImportAccount();

  // Tells whether the user has previously given consent to the Butter ToS and Privacy policies
  const consentGiven = useAppStateValue('consentGiven');

  // Ask the user the permission to access the device notification
  useRequestNotificationsPermission();

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const onSignUp = React.useCallback(() => {
    if (!consentGiven) {
      navigate(ROUTES.CONSENT_AGREEMENT, {
        onConsentAgree: () => replace<any>(ROUTES.SIGNUP),
      });
    } else {
      navigate(ROUTES.SIGNUP);
    }
  }, [consentGiven, navigate, replace]);

  const onSignUpWithWallet = React.useCallback(() => {
    if (!consentGiven) {
      navigate(ROUTES.CONSENT_AGREEMENT, {
        onConsentAgree: performImportAccount,
      });
    } else {
      performImportAccount();
    }
  }, [consentGiven, navigate, performImportAccount]);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <DView backgroundImage={landingBG} backgroundFillScreen style={styles.container}>
      <Image source={butterflyLandingIcon} style={styles.dummyAvatar} />
      <Text style={styles.title} allowFontScaling>
        {t('butter')}
      </Text>
      <Text style={styles.subtitle} allowFontScaling>
        {t('header')}
      </Text>
      <Spacer paddingTop={theme.spacing.m} />
      <View style={{alignSelf: 'stretch'}}>
        <Button
          mode={ButtonMode.CONTAINED}
          size={ButtonSize.L}
          useSubtitle={true}
          backgroundColor="rgba(255, 255, 255, 0.7)"
          onPress={onSignUp}>
          {t('signUp')}
        </Button>

        <Spacer paddingVertical={theme.spacing.l}>
          <Button
            mode={ButtonMode.CONTAINED}
            size={ButtonSize.L}
            useSubtitle={true}
            backgroundColor="rgba(255, 255, 255, 0.7)"
            onPress={onSignUpWithWallet}>
            {t('signUp with wallet')}
          </Button>
        </Spacer>
      </View>
    </DView>
  );
};

export default Landing;
