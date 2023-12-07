import { StackScreenProps } from '@react-navigation/stack';
import Button from 'components/Button';
import DView from 'components/DView';
import Section from 'components/Section';
import SectionButton from 'components/SectionButton';
import SectionSwitch from 'components/SectionSwitch';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import VersionString from 'screens/Settings/components/VersionString';
import useStyles from 'screens/Settings/useStyles';
import useFormatDateToTZ from 'hooks/formatting/useFormatDateToTZ';
import { useActiveAccount } from '@recoil/accounts';
import useUnlockWallet from 'hooks/useUnlockWallet';
import {
  useChangePassword,
  useOpenNotificationsSettings,
  useSendFeedback,
  useShowAboutInfo,
  useShowPrivateKey,
  useSignOut,
  useToggleBiometrics,
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
  const formatDateToTZ = useFormatDateToTZ();
  const formattedAccountCreationDate = React.useMemo(() => {
    if (!activeAccount) {
      // TODO: Improve this for guests
      return 'Account not on chain';
    }
    return formatDateToTZ(activeAccount?.creationDate?.toISOString(), 'MMM dd yyyy');
  }, [activeAccount, formatDateToTZ]);

  const { canShowPrivateKey, showPrivateKey } = useShowPrivateKey();

  const changePassword = useChangePassword();
  const unlockWallet = useUnlockWallet();

  const { biometricsSupported, biometricsEnabled, toggleBiometrics } = useToggleBiometrics();

  const openNotificationsSettings = useOpenNotificationsSettings();
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

  const handlePressChangePassword = useCallback(async () => {
    const walletUnlockResult = await unlockWallet();

    if (walletUnlockResult.isOk()) {
      changePassword();
    }
  }, [changePassword, t, unlockWallet]);

  const handlePressBlockedUsers = useCallback(() => {
    navigate(ROUTES.BLOCKED_USERS);
  }, [navigate]);

  // -------------------------------------------------------------------------------------
  // --- View rendering
  // -------------------------------------------------------------------------------------

  return (
    <DView scrollable style={styles.root} topBar={<TopBar />} showLoadingOverlay={signOutLoading}>
      <Typography.H3 style={styles.title}>{t('settings')}</Typography.H3>

      {/* Security section */}
      <Section style={styles.spacer} title={t('security')}>
        {biometricsSupported && (
          <SectionSwitch
            label={t('enable biometrics')}
            value={biometricsEnabled}
            onValueChange={toggleBiometrics}
          />
        )}
        <SectionButton label={t('change password')} onPress={handlePressChangePassword} />
        <SectionButton label={t('blockedUsers')} onPress={handlePressBlockedUsers} />
        {canShowPrivateKey && (
          <SectionButton label={t('reveal private key')} onPress={showPrivateKey} />
        )}
      </Section>

      {/* Other section */}
      <Section style={styles.spacer} title={t('others')}>
        <SectionButton label={t('notifications')} onPress={openNotificationsSettings} />
        <SectionButton label={t('feedbacks')} onPress={sendFeedback} />
        <SectionButton label={t('about')} onPress={showAboutInfo} />
      </Section>
      <Spacer paddingVertical={12} />
      <Button size={44} variant="outlined" onPress={openConfirmSignOutModal}>
        {t('sign out')}
      </Button>
      <Typography.Body7 style={styles.bottomText}>
        <Trans
          i18nKey="settings:joined product"
          components={[<Typography.Subtitle4 />]}
          values={{
            formattedDate: formattedAccountCreationDate,
          }}
        />
      </Typography.Body7>
      <Spacer paddingVertical={12} />
      <VersionString />
    </DView>
  );
};

export default Settings;
