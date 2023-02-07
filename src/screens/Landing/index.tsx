import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { butterflyLandingIcon, landingBG } from 'assets/images';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import useRequestNotificationsPermission from 'hooks/useRequestNotificationsPermission';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useAppStateValue } from '@recoil/appState';
import useImportAccount from 'hooks/useImportAccount';
import { DesmosChain } from 'config/LinkableChains';
import useSaveAccount from 'hooks/useSaveAccount';
import useEditProfile from 'hooks/useEditProfile';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.LANDING>;

const Landing = () => {
  const theme = useTheme();
  const { t } = useTranslation('landing');
  const { navigate, replace } = useNavigation<NavProps['navigation']>();
  const styles = useStyles();
  const importAccount = useImportAccount({
    chains: [DesmosChain],
    showBalances: true,
    minAccountBalance: 0.1,
  });
  const saveAccount = useSaveAccount();
  const createProfile = useEditProfile();

  // Tells whether the user has previously given consent to the Butter ToS and Privacy policies
  const consentGiven = useAppStateValue('consentGiven');

  // Ask the user the permission to access the device notification
  useRequestNotificationsPermission();

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
    const performImportAccount = () => {
      importAccount({
        onSelect: account => {
          if (account.profile === undefined) {
            createProfile({
              account: account.account.address,
              isLocalOnly: true,
              onSuccess: () => saveAccount(account),
            });
          } else {
            saveAccount(account);
          }
        },
      });
    };

    if (!consentGiven) {
      navigate(ROUTES.CONSENT_AGREEMENT, {
        onConsentAgree: performImportAccount,
      });
    } else {
      performImportAccount();
    }
  }, [consentGiven, createProfile, importAccount, navigate, saveAccount]);

  return (
    <DView backgroundImage={landingBG} backgroundFillScreen style={styles.container}>
      <Image source={butterflyLandingIcon} style={styles.dummyAvatar} />
      <Text style={styles.title} allowFontScaling>
        {t('butter')}
      </Text>
      <Text style={styles.subtitle} allowFontScaling>
        {t('header')}
      </Text>
      <View style={{ alignSelf: 'stretch' }}>
        <Button
          mode="contained"
          style={{ backgroundColor: theme.colors.white }}
          labelStyle={{ color: theme.colors.surfaceBlack }}
          onPress={onSignUp}>
          {t('signUp')}
        </Button>

        <Spacer paddingVertical={theme.spacing.l}>
          <Button
            style={{ borderColor: theme.colors.white }}
            labelStyle={{ color: theme.colors.white }}
            mode="outlined"
            onPress={onSignUpWithWallet}>
            {t('signUp with wallet')}
          </Button>
        </Spacer>
      </View>
    </DView>
  );
};

export default Landing;
