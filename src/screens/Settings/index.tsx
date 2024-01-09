import { StackScreenProps } from '@react-navigation/stack';
import { useActiveAccount, useActiveAccountAddress, useStoredAccounts } from '@recoil/accounts';
import { useActiveProfile } from '@recoil/profiles';
import { useSetSetting, useSetting } from '@recoil/settings';
import Button from 'components/Button';
import DView from 'components/DView';
import Section from 'components/Section';
import SectionButton from 'components/SectionButton';
import SectionSwitch from 'components/SectionSwitch';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import useDisableBiometrics from 'hooks/biometrics/useDisableBiometrics';
import useEnableBiometrics from 'hooks/biometrics/useEnableBiometrics';
import useFormatDateToTZ from 'hooks/formatting/useFormatDateToTZ';
import useUnlockWallet from 'hooks/useUnlockWallet';
import { useTheme } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import { getVersion } from 'react-native-device-info';
import { PASSWORD_MANIPULATION_MODE } from 'screens/PasswordManipulation/useHooks';
import useStyles from 'screens/Settings/useStyles';
import { AccountWithWallet } from 'types/account';
import { Wallet } from 'types/wallet';
import {
  useDeleteAccountData,
  useDeleteProfile,
  useOpenNotificationsSettings,
  useSendFeedback,
  useShowAboutInfo,
  useShowPrivateKey,
  useSignOut,
} from './hooks';

declare type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SETTINGS>;

/**
 * Screen that allows the user to view their settings.
 * @constructor
 */
const Settings = (props: NavProps) => {
  const { t } = useTranslation('settings');
  const styles = useStyles();
  const { navigation } = props;
  const { navigate } = navigation;
  const theme = useTheme();
  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const activeAccount = useActiveAccount();
  const activeProfile = useActiveProfile();
  const activeAddress = useActiveAccountAddress();
  const accounts = useStoredAccounts();
  const formatDateToTZ = useFormatDateToTZ();
  const formattedAccountCreationDate = React.useMemo(() => {
    if (!activeAccount) {
      // TODO: Improve this for guests
      return 'Account not on chain';
    }
    return formatDateToTZ(activeAccount?.creationDate?.toISOString(), 'MMM dd yyyy');
  }, [activeAccount, formatDateToTZ]);

  const { canShowPrivateKey, showPrivateKey } = useShowPrivateKey();
  const postHog = usePostHog();
  const unlockWallet = useUnlockWallet();
  const openNotificationsSettings = useOpenNotificationsSettings();
  const analytics = useSetting('analytics');
  const setAnalytics = useSetSetting('analytics');
  const biometrics = useSetting('biometrics');
  const enableBiometrics = useEnableBiometrics();
  const disableBiometrics = useDisableBiometrics();
  const deleteAccountData = useDeleteAccountData();
  const deleteProfile = useDeleteProfile();

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const sendFeedback = useSendFeedback();
  const showAboutInfo = useShowAboutInfo();
  const { signOut, signOutLoading } = useSignOut();

  const openConfirmSignOutModal = useCallback(() => {
    navigate({
      name: ROUTES.CONFIRM_MODAL,
      params: {
        title: t('sign out'),
        subtitle: <Typography.Body5>{t('sign out private key warning')}</Typography.Body5>,
        primaryButtonLabel: t('sign out'),
        onPressPrimary: signOut,
        removeModalAfterButtonPress: true,
      },
    });
  }, [navigate, t, signOut]);

  const onUnlockSuccess = useCallback(
    (wallet: Wallet) => {
      const activeAcc = accounts[activeAddress!];
      const activeAccountWithWallet: AccountWithWallet = {
        account: activeAcc,
        wallet,
      };
      navigate(ROUTES.PASSWORD_MANIPULATION, {
        mode: PASSWORD_MANIPULATION_MODE.CHANGE_PASSWORD,
        account: activeAccountWithWallet,
        profile: activeProfile,
      });
    },
    [accounts, activeAddress, activeProfile, navigate],
  );

  const navigateToChangePassword = useCallback(async () => {
    await unlockWallet({
      toUnlockAddress: activeAddress,
      optionalOnSuccess: onUnlockSuccess,
      forceRequestPassword: true,
    });
  }, [activeAddress, onUnlockSuccess, unlockWallet]);

  const handlePressBlockedUsers = useCallback(() => {
    navigate(ROUTES.BLOCKED_USERS);
  }, [navigate]);

  const handleAnalyticsToggle = React.useCallback(
    (enabled: boolean) => {
      setAnalytics(() => {
        if (postHog) {
          if (enabled) {
            postHog.optIn();
          } else {
            postHog.optOut();
          }
        }
        return enabled;
      });
    },
    [postHog, setAnalytics],
  );

  const handleBiometricsToggle = React.useCallback(async () => {
    if (biometrics) {
      await disableBiometrics();
    } else {
      const result = await unlockWallet({
        forceRequestPassword: true,
      });
      if (result.isOk()) {
        await enableBiometrics(result.value.password!, true, activeAccount?.address!);
      }
    }
  }, [activeAccount?.address, biometrics, disableBiometrics, enableBiometrics, unlockWallet]);

  // -------------------------------------------------------------------------------------
  // --- View rendering
  // -------------------------------------------------------------------------------------

  return (
    <DView
      style={styles.root}
      showLoadingOverlay={signOutLoading}
      disableHideKeyboardTouchable={true}
      backgroundColor={theme.colors.backgroundGrey}>
      <Typography.H3 style={styles.title}>{t('settings')}</Typography.H3>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Security section */}
        <Section style={styles.spacer} title={t('security')}>
          <SectionSwitch
            label={t('enable analytics')}
            value={analytics}
            onValueChange={() => handleAnalyticsToggle(!analytics)}
          />
          <SectionSwitch
            label={t('enable biometrics')}
            value={biometrics}
            onValueChange={handleBiometricsToggle}
          />
          <SectionButton label={t('change password')} onPress={navigateToChangePassword} />
          <SectionButton label={t('blocked users')} onPress={handlePressBlockedUsers} />
          {canShowPrivateKey && (
            <SectionButton label={t('reveal private key')} onPress={showPrivateKey} />
          )}
        </Section>

        {/* Acccount section */}
        <Section style={styles.spacer} title={t('account')}>
          <SectionButton label={t('delete account data')} onPress={deleteAccountData} />
          <SectionButton label={t('delete profile')} onPress={deleteProfile} />
        </Section>

        {/* Other section */}
        <Section style={styles.spacer} title={t('others')}>
          <SectionButton label={t('notifications')} onPress={openNotificationsSettings} />
          <SectionButton label={t('feedbacks')} onPress={sendFeedback} />
          <SectionButton label={t('about')} onPress={showAboutInfo} />
        </Section>
        <Spacer paddingVertical={12} />
        <Button size={44} variant="outline" onPress={openConfirmSignOutModal}>
          {t('sign out')}
        </Button>
        <Typography.Body7 style={styles.bottomText}>
          <Trans
            i18nKey="joined butter"
            ns="settings"
            values={{ formattedDate: formattedAccountCreationDate }}
            components={[<Typography.Subtitle4 />]}
          />
        </Typography.Body7>
        <Typography.Body7 style={styles.bottomText}>Version {getVersion()}</Typography.Body7>
        <Spacer paddingBottom="l" />
      </ScrollView>
    </DView>
  );
};

export default Settings;
