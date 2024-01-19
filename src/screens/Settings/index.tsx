import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
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
import TopBar from 'components/TopBar';
import useDisableBiometrics from 'hooks/biometrics/useDisableBiometrics';
import useEnableBiometrics from 'hooks/biometrics/useEnableBiometrics';
import useFormatDateToTZ from 'hooks/formatting/useFormatDateToTZ';
import useUnlockWallet from 'hooks/useUnlockWallet';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Linking, ScrollView } from 'react-native';
import { getVersion } from 'react-native-device-info';
import { PASSWORD_MANIPULATION_MODE } from 'screens/PasswordManipulation/useHooks';
import useStyles from 'screens/Settings/useStyles';
import { AccountWithWallet } from 'types/account';
import { Wallet } from 'types/wallet';
import {
  settingsAnalyticsIcon,
  settingsDataIcon,
  settingsFaceIdIcon,
  settingsLockIcon,
  settingsMailIcon,
  settingsMooncakeIcon,
  settingsNotificationsIcon,
  settingsPrivacyPolicyIcon,
  settingsPrivateKeyIcon,
  settingsProfileIcon,
  settingsToSIcon,
  settingsUserIcon,
} from 'assets/images';
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
        subtitle: <Typography.Regular16>{t('sign out private key warning')}</Typography.Regular16>,
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
      topBar={<TopBar />}
      showLoadingOverlay={signOutLoading}
      disableHideKeyboardTouchable={true}>
      <Typography.Semibold24 style={styles.title}>{t('settings')}</Typography.Semibold24>
      <ScrollView
        style={styles.scrollview}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}>
        {/* Security section */}
        <Section style={[styles.section]} title={t('security')}>
          <SectionSwitch
            label={t('enable biometrics')}
            leftIcon={settingsFaceIdIcon}
            value={biometrics}
            onValueChange={handleBiometricsToggle}
          />
          <SectionButton
            label={t('change password')}
            leftIcon={settingsLockIcon}
            onPress={navigateToChangePassword}
          />
          {canShowPrivateKey && (
            <SectionButton
              label={t('reveal private key')}
              leftIcon={settingsPrivateKeyIcon}
              onPress={showPrivateKey}
            />
          )}
          <SectionButton
            label={t('blocked users')}
            leftIcon={settingsUserIcon}
            onPress={handlePressBlockedUsers}
          />
        </Section>

        {/* Preferences section */}
        <Section style={styles.section} title={t('preferences')}>
          <SectionButton
            label={t('notifications')}
            leftIcon={settingsNotificationsIcon}
            onPress={openNotificationsSettings}
          />
          <SectionSwitch
            label={t('enable analytics')}
            leftIcon={settingsAnalyticsIcon}
            value={analytics}
            onValueChange={() => handleAnalyticsToggle(!analytics)}
          />
        </Section>

        {/* Other section */}
        <Section style={styles.section} title={t('others')}>
          <SectionButton
            label={t('feedbacks')}
            leftIcon={settingsMailIcon}
            onPress={sendFeedback}
          />
          <SectionButton
            label={t('about')}
            leftIcon={settingsMooncakeIcon}
            onPress={showAboutInfo}
          />
          <SectionButton
            label={t('terms of service', { ns: 'legal' })}
            leftIcon={settingsToSIcon}
            onPress={() => Linking.openURL('https://butter.social/privacy-policy')}
          />
          <SectionButton
            label={t('privacy policy', { ns: 'legal' })}
            leftIcon={settingsPrivacyPolicyIcon}
            onPress={() => Linking.openURL('https://butter.social/terms-and-conditions')}
          />
        </Section>

        {/* Account management section */}
        <Section style={styles.section} title={t('account management')}>
          <SectionButton
            label={t('delete account data')}
            leftIcon={settingsDataIcon}
            onPress={deleteAccountData}
          />
          <SectionButton
            label={t('delete profile')}
            leftIcon={settingsProfileIcon}
            onPress={deleteProfile}
          />
        </Section>

        <Spacer paddingVertical={12} />
        <Button height={44} type="outline" onPress={openConfirmSignOutModal}>
          {t('sign out')}
        </Button>
        <Typography.Regular12 style={styles.bottomText}>
          <Trans
            i18nKey="joined butter"
            ns="settings"
            values={{ formattedDate: formattedAccountCreationDate }}
            components={[<Typography.Semibold12 />]}
          />
        </Typography.Regular12>
        <Typography.Regular12 style={styles.bottomText}>
          Version {getVersion()}
        </Typography.Regular12>
        <Spacer paddingBottom="xl" />
      </ScrollView>
      <Spacer paddingBottom="xl" />
    </DView>
  );
};

export default Settings;
