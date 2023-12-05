import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BackButton from 'components/BackButton';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import StyledSpinner from 'components/StyledSpinner';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { DesmosChain } from 'config/LinkableChains';
import useLoginWithWeb3Auth from 'hooks/web3Auth/useLoginWithWeb3Auth';
import { useTheme } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, TouchableOpacity, View } from 'react-native';
import LandingCheckbox from 'screens/ServiceAndPolicy/components/LandingCheckbox';
import { LoginMethod } from 'types/login';
import useStyles from './useStyles';

export interface ServiceAndPolicyParams {
  loginMethod: LoginMethod;
}

export type NavProps = NativeStackScreenProps<RootNavigatorParamList, ROUTES.SERVICE_AND_POLICY>;

/**
 * Screen that is shown to the user after they select a login method, in order
 * to accept the terms of service and privacy policy.
 * @constructor
 */
const ServiceAndPolicy = () => {
  const { t } = useTranslation('legal');
  const { params } = useRoute<NavProps['route']>();
  const { navigate } = useNavigation<NavProps['navigation']>();
  const theme = useTheme();
  const styles = useStyles();

  // -------------------------------------------------------------------------------------
  // --- State
  // -------------------------------------------------------------------------------------

  const [conditionAndPolicyAccepted, setConditionAndPolicyAccepted] = useState(false);

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const { login: loginWithWeb3Auth, loginLoading } = useLoginWithWeb3Auth(DesmosChain);

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const loginWithSelectedMethod = useCallback(async () => {
    // Login the user with the We3Auth method if they selected it.
    if (params?.loginMethod?.type === 'Web3Auth') {
      await loginWithWeb3Auth(params?.loginMethod?.provider);
      return;
    }

    // Otherwise, navigate to the screen that allows to use the private key
    navigate(ROUTES.IMPORT_ACCOUNT_PRIVATE_KEY);
  }, [loginWithWeb3Auth, navigate, params]);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <DView topBar={<TopBar />} style={styles.container} disableHideKeyboardTouchable={true}>
      <Spacer paddingBottom="m" />
      <Typography.H3>{t('legal')}</Typography.H3>
      <Spacer paddingBottom="m" />
      <Typography.Body5>{t('please review')}</Typography.Body5>
      <Spacer paddingBottom="l" />
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.border]}
          onPress={() => Linking.openURL('https://bondscape.desmos.network/terms')}>
          <Typography.Body5>{t('terms of service')}</Typography.Body5>
          <BackButton
            style={{ transform: [{ rotate: '180deg' }] }}
            iconColor={theme.colors.surfaceBlack}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openURL('https://bondscape.desmos.network/privacy')}>
          <Typography.Body5>{t('privacy policy')}</Typography.Body5>
          <BackButton
            style={{ transform: [{ rotate: '180deg' }] }}
            iconColor={theme.colors.surfaceBlack}
          />
        </TouchableOpacity>
      </View>
      {loginLoading && (
        <Spacer paddingVertical="l">
          <StyledSpinner />
        </Spacer>
      )}
      <View style={styles.bottomView}>
        <LandingCheckbox
          value={conditionAndPolicyAccepted}
          onValueChange={value => setConditionAndPolicyAccepted(value)}
        />
        <Spacer paddingBottom="xl" />
        <Button
          bgColor={theme.colors.surfaceBlack}
          textColor={theme.colors.white}
          size={44}
          disabled={!conditionAndPolicyAccepted || loginLoading}
          onPress={() => loginWithSelectedMethod()}>
          {t('accept', { ns: 'common' })}
        </Button>
        <Spacer paddingBottom="m" />
      </View>
    </DView>
  );
};

export default ServiceAndPolicy;
