import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { butterflyLandingIcon, landingBG } from 'assets/images';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image } from 'react-native';
import { Box, Text, useTheme } from 'native-base';
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
  const { navigate } = useNavigation<NavProps['navigation']>();
  const styles = useStyles();

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const performImportAccount = usePerformImportAccount();
  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const onSignUp = React.useCallback(() => {
    navigate(ROUTES.SIGNUP);
  }, [navigate]);

  const onSignUpWithWallet = React.useCallback(() => {
    performImportAccount();
  }, [performImportAccount]);

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
      <Box alignSelf="stretch">
        <Button backgroundColor="rgba(255, 255, 255, 0.7)" onPress={onSignUp}>
          {t('signUp')}
        </Button>

        <Spacer paddingVertical={theme.spacing.l}>
          <Button backgroundColor="rgba(255, 255, 255, 0.7)" onPress={onSignUpWithWallet}>
            {t('signUp with wallet')}
          </Button>
        </Spacer>
      </Box>
    </DView>
  );
};

export default Landing;
