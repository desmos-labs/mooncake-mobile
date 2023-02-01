import {ParamListBase, useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {butterflyLandingIcon, landingBG, ledgerLIcon} from 'assets/images';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import useRequestNotificationsPermission from 'hooks/useRequestNotificationsPermission';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Image, TouchableOpacity, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {MNEMONIC_INPUT_MODE} from 'screens/MnemonicInput';
import {useAppStateValue} from '@recoil/appState';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.LANDING>;

const Landing = () => {
  const theme = useTheme();
  const {t} = useTranslation('landing');
  const {navigate, replace} = useNavigation<NavProps['navigation']>();
  const styles = useStyles();

  // Tells whether the user has previously given consent to the Butter ToS and Privacy policies
  const consentGiven = useAppStateValue('consentGiven');

  // Ask the user the permission to access the device notification
  useRequestNotificationsPermission();

  /**
   * Hook that returns a function that, given a route (and its parameters):
   * 1. Checks if the consent to the ToS and Privacy is given
   * 2. Performs the following action
   *    a. if the consent, navigates to that route
   *    b. if the consent is not given, sends the user to the page to accept the consent.
   *       Once it is given, navigates to the provided page.
   */
  const useHandlePressImportType = <
    RouteName extends keyof RootNavigatorParamList,
  >(
    route: RouteName,
    params?: ParamListBase[RouteName],
  ) => {
    return React.useCallback(() => {
      const goToPage = () => navigate<any>(route, params);
      if (!consentGiven) {
        navigate(ROUTES.CONSENT_AGREEMENT, {
          onConsentAgree: () => replace<any>(route, params),
        });
      } else {
        goToPage();
      }
    }, [consentGiven, navigate]);
  };

  return (
    <DView
      backgroundImage={landingBG}
      backgroundFillScreen
      style={styles.container}>
      <Image source={butterflyLandingIcon} style={styles.dummyAvatar} />
      <Text style={styles.title} allowFontScaling>
        {t('butter')}
      </Text>
      <Text style={styles.subtitle} allowFontScaling>
        {t('header')}
      </Text>
      <View style={{alignSelf: 'stretch'}}>
        <Button
          mode="contained"
          style={{backgroundColor: theme.colors.white}}
          labelStyle={{color: theme.colors.surfaceBlack}}
          onPress={useHandlePressImportType(ROUTES.SIGNUP)}>
          {t('signUp')}
        </Button>

        <Spacer paddingVertical={theme.spacing.l}>
          <Button
            style={{borderColor: theme.colors.white}}
            labelStyle={{color: theme.colors.white}}
            mode="outlined"
            onPress={useHandlePressImportType(ROUTES.MNEMONIC_INPUT, {
              mode: MNEMONIC_INPUT_MODE.IMPORT_RECOVERY_PHRASE,
            })}>
            {t('importMnemonic')}
          </Button>
        </Spacer>
      </View>

      <TouchableOpacity
        style={styles.connectLedgerButton}
        onPress={useHandlePressImportType(ROUTES.LOOKING_FOR_DEVICES)}>
        <Image source={ledgerLIcon} style={styles.connectLedgerImage} />

        <Typography.Button1 style={{color: theme.colors.white}}>
          {t('connectLedger')}
        </Typography.Button1>
      </TouchableOpacity>
    </DView>
  );
};

export default Landing;
