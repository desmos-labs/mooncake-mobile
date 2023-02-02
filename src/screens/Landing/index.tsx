import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {butterflyLandingIcon, landingBG, ledgerLIcon} from 'assets/images';
import Button, {ButtonMode, ButtonSize} from 'components/Button';
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
import {MMKVKEYS, useMMKVStorage} from 'lib/MMKVStorage';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.LANDING>;

const Landing = () => {
  const theme = useTheme();
  const {t} = useTranslation('landing');
  const {navigate, replace} = useNavigation<NavProps['navigation']>();
  const styles = useStyles();
  const [consentGiven] = useMMKVStorage<Boolean>(MMKVKEYS.CONSENT_GIVEN);

  useRequestNotificationsPermission();

  const handlePressConnectLedger = React.useCallback(() => {
    if (!consentGiven) {
      navigate(ROUTES.CONSENT_AGREEMENT, {
        onConsentAgree: () => replace(ROUTES.LOOKING_FOR_DEVICES),
      });
    } else {
      navigate(ROUTES.LOOKING_FOR_DEVICES);
    }
  }, [consentGiven]);

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
      <Spacer paddingTop={theme.spacing.m} />
      <View style={{alignSelf: 'stretch'}}>
        <Button
          mode={ButtonMode.CONTAINED}
          size={ButtonSize.L}
          useSubtitle={true}
          backgroundColor="rgba(255, 255, 255, 0.7)"
          onPress={() => navigate(ROUTES.SIGNUP)}>
          {t('signUp')}
        </Button>

        <Spacer paddingVertical={theme.spacing.l}>
          <Button
            mode={ButtonMode.CONTAINED}
            size={ButtonSize.L}
            useSubtitle={true}
            backgroundColor="rgba(255, 255, 255, 0.7)"
            onPress={() =>
              navigate(ROUTES.MNEMONIC_INPUT, {
                mode: MNEMONIC_INPUT_MODE.IMPORT_RECOVERY_PHRASE,
              })
            }>
            {t('importMnemonic')}
          </Button>
        </Spacer>
      </View>

      <TouchableOpacity
        style={styles.connectLedgerButton}
        onPress={handlePressConnectLedger}>
        <Image source={ledgerLIcon} style={styles.connectLedgerImage} />
        <Typography.Button1 style={{color: theme.colors.white}}>
          {t('connectLedger')}
        </Typography.Button1>
      </TouchableOpacity>
    </DView>
  );
};

export default Landing;
