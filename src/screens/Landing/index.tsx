import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { appleLoginIcon, googleLoginIcon, landingBG, mooncakeWithTextLogo } from 'assets/images';
import Button from 'components/Button';
import DView from 'components/DView';
import ImageButton from 'components/ImageButton';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import { Box, Text, useTheme } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Platform, View } from 'react-native';
import {
  LoginMethod,
  LoginMethodPrivateKey,
  LoginMethodWeb3AuthApple,
  LoginMethodWeb3AuthGoogle,
} from 'types/login';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.LANDING>;

/**
 * Screen that is shown to the user when they open the application for the first time.
 * From here, they can decide to create a new account, or import an existing one.
 * @constructor
 */

const Landing = () => {
  const theme = useTheme();
  const { navigate } = useNavigation<NavProps['navigation']>();
  const { t } = useTranslation('landing');
  const styles = useStyles();

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const onSignUp = React.useCallback(
    (loginMethod: LoginMethod) => {
      // Handle the post consent behavior with a reusable callback.
      navigate(ROUTES.SERVICE_AND_POLICY, {
        loginMethod,
      });
    },
    [navigate],
  );

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <DView backgroundImage={landingBG} backgroundFillScreen style={styles.container}>
      <View style={styles.innerView}>
        <Image source={mooncakeWithTextLogo} style={styles.dummyAvatar} />
        <Text style={styles.subtitle} allowFontScaling>
          {t('butter slogan')}
        </Text>
        <Spacer paddingTop={theme.spacing.m} />
        <Box alignSelf="stretch">
          <Button
            backgroundColor="rgba(255, 255, 255, 0.7)"
            onPress={() => onSignUp(LoginMethodPrivateKey)}>
            {t('login with private key')}
          </Button>
        </Box>
        <Spacer paddingTop={theme.spacing.xl} />
        <View style={styles.loginWithContainer}>
          <View style={styles.loginDivider} />
          <Spacer paddingHorizontal={8} />
          <Typography.Body5 style={styles.loginWithLabel}>{t('or sign in with')}</Typography.Body5>
          <Spacer paddingHorizontal={8} />
          <View style={styles.loginDivider} />
        </View>
        <View style={styles.bottomIcons}>
          {Platform.OS === 'ios' && (
            <ImageButton
              image={appleLoginIcon}
              style={styles.loginLogo}
              onPress={() => onSignUp(LoginMethodWeb3AuthApple)}
            />
          )}
          <ImageButton
            image={googleLoginIcon}
            style={styles.loginLogo}
            onPress={() => onSignUp(LoginMethodWeb3AuthGoogle)}
          />
        </View>
      </View>
    </DView>
  );
};

export default Landing;
