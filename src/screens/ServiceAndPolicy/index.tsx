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
import { makeStyle } from 'config/theme';
import useLoginWithWeb3Auth from 'hooks/web3Auth/useLoginWithWeb3Auth';
import { useTheme } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Platform, TouchableOpacity, View } from 'react-native';
import LandingCheckbox from 'screens/ServiceAndPolicy/components/LandingCheckbox';
import { Web3AuthLoginProvider } from 'types/web3auth';

export interface ServiceAndPolicyParams {
  loginProvider: 'wallet' | Web3AuthLoginProvider;
}

export type NavProps = NativeStackScreenProps<RootNavigatorParamList, ROUTES.SERVICE_AND_POLICY>;

const ServiceAndPolicy = () => {
  const { t } = useTranslation('legal');
  const { params } = useRoute<NavProps['route']>();
  const { navigate } = useNavigation<NavProps['navigation']>();
  const theme = useTheme();
  const styles = useStyles();
  const [conditionAndPolicyAccepted, setConditionAndPolicyAccepted] = useState(false);
  const { login: loginWithWeb3Auth, loginLoading } = useLoginWithWeb3Auth(DesmosChain);

  const loginWithSelectedMethod = useCallback(async () => {
    if (params?.loginProvider === 'wallet') {
      navigate(ROUTES.IMPORT_ACCOUNT_SELECT_MODE);
    } else {
      await loginWithWeb3Auth(params?.loginProvider);
    }
  }, []);

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

const useStyles = makeStyle(theme => ({
  container: {
    paddingHorizontal: 20,
    flex: 1,
  },
  buttonsContainer: {
    backgroundColor: 'white',
    shadowColor: Platform.OS === 'ios' ? 'rgba(10, 10, 10, 0.1)' : 'rgba(10, 10, 10, 0.5)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 20,
    borderRadius: 20,
    elevation: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  border: {
    borderBottomWidth: 1,
    borderColor: theme.colors.surfaceGrey,
  },
  bottomView: { flex: 1, alignSelf: 'center', justifyContent: 'flex-end' },
}));

export default ServiceAndPolicy;
