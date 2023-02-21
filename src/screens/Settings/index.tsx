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
import { useTheme } from 'react-native-paper';
import { useActiveAccount } from '@recoil/accounts';
import { RequiredMessageTypesGrant } from 'config/AutzGrants';
import {
  useChangePassword,
  useManageAppLinks,
  useManageChainLinks,
  useManageInvites,
  useOpenNotificationsSettings,
  useSendFeedback,
  useShowAboutInfo,
  useShowCommunities,
  useShowPrivateKey,
  useSignOut,
  useToggleBiometrics,
  useToggleNotifications,
  useToggleSimplifiedTxBroadcast,
} from './hooks';

declare type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SETTINGS>;

const Settings: React.FC<NavProps> = props => {
  const {
    navigation: { navigate },
  } = props;
  const activeAccount = useActiveAccount()!;
  const theme = useTheme();
  const { t } = useTranslation('settings');
  const styles = useStyles();

  // Account section hooks
  const { canShowPrivateKey, showPrivateKey } = useShowPrivateKey();
  const manageChainLinks = useManageChainLinks();
  const manageAppLinks = useManageAppLinks();

  // Security sections hooks.
  const {
    loading: loadingSimplifiedTxBroadcast,
    state: simplifiedTxBroadcast,
    toggleSimplifiedTxBroadcast,
  } = useToggleSimplifiedTxBroadcast(RequiredMessageTypesGrant);
  const changePassword = useChangePassword();
  const { biometricsSupported, biometricsEnabled, toggleBiometrics } = useToggleBiometrics();

  // Other section hooks.
  const openNotificationsSettings = useOpenNotificationsSettings();
  const { value: notifyOnNewDiscoverPost, toggle: toggleNotifyOnNewDiscoverPost } =
    useToggleNotifications('newDiscPostNotification');
  const { value: notifyOnNewFollowerPost, toggle: toggleNotifyOnNewFollowerPost } =
    useToggleNotifications('newFollowPostNotification');
  const manageInvites = useManageInvites();
  const showCommunities = useShowCommunities();
  const sendFeedback = useSendFeedback();
  const showAboutInfo = useShowAboutInfo();
  const signOut = useSignOut();
  const formatDateToTZ = useFormatDateToTZ();

  const formattedAccountCreationDate = React.useMemo(() => {
    return formatDateToTZ(activeAccount.creationDate.toISOString(), 'MMM dd yyyy');
  }, [formatDateToTZ]);

  const openConfirmSignOutModal = useCallback(() => {
    navigate({
      name: ROUTES.CONFIRM_MODAL,
      params: {
        title: t('confirmModal:signout'),
        subtitle: (
          <Trans
            i18nKey="confirmModal:backupSeedphrase"
            components={[<Typography.Subtitle2 style={{ color: theme.colors.butterOrange01 }} />]}
          />
        ),
        primaryButtonLabel: t('confirmModal:goToBackup'),
        secondaryButtonLabel: t('confirmModal:signout'),
        onPressPrimary: () => console.log('primary'),
        onPressSecondary: signOut,
      },
    });
  }, [signOut, navigate, t, theme.colors.butterOrange01]);

  return (
    <DView scrollable style={styles.root} topBar={<TopBar />}>
      <Typography.H3 style={styles.title}>{t('settings')}</Typography.H3>

      {/* Account section */}
      <Section style={styles.spacer} title={t('account')}>
        {canShowPrivateKey && (
          <SectionButton label={t('show private key')} onPress={showPrivateKey} />
        )}
        <SectionButton label={t('manage connected addresses')} onPress={manageChainLinks} />
        <SectionButton label={t('manage connected apps')} onPress={manageAppLinks} />
      </Section>

      {/* Security section */}
      <Section style={styles.spacer} title={t('security')}>
        <SectionSwitch
          label={t('permissions')}
          onValueChange={toggleSimplifiedTxBroadcast}
          value={simplifiedTxBroadcast}
          disabled={loadingSimplifiedTxBroadcast}
        />
        <SectionButton label={t('change password')} onPress={changePassword} />
        {biometricsSupported && (
          <SectionSwitch
            label={t('enable biometrics')}
            value={biometricsEnabled}
            onValueChange={toggleBiometrics}
          />
        )}
      </Section>

      {/* Other section */}
      <Section style={styles.spacer} title={t('others')}>
        <SectionButton label={t('notifications')} onPress={openNotificationsSettings} />
        <SectionSwitch
          label={t('notifyOnNewDiscPosts')}
          value={notifyOnNewDiscoverPost}
          onValueChange={toggleNotifyOnNewDiscoverPost}
        />
        <SectionSwitch
          label={t('notifyOnNewFollowPosts')}
          value={notifyOnNewFollowerPost}
          onValueChange={toggleNotifyOnNewFollowerPost}
        />
        <SectionButton label={t('invites:invites')} onPress={manageInvites} />
        <SectionButton label={t('community')} onPress={showCommunities} />
        <SectionButton label={t('feedbacks')} onPress={sendFeedback} />
        <SectionButton label={t('about')} onPress={showAboutInfo} />
      </Section>
      <Spacer paddingVertical={12} />
      <Button mode="outlined" style={styles.signOutButton} onPress={openConfirmSignOutModal}>
        <Typography.Button1>{t('confirmModal:signout')}</Typography.Button1>
      </Button>

      <Typography.Body7 style={styles.bottomText}>
        <Trans
          i18nKey="settings:joined product"
          components={[<Typography.Button2 />]}
          values={{
            formattedDate: formattedAccountCreationDate,
          }}
        />
      </Typography.Body7>

      <VersionString />
    </DView>
  );
};

export default Settings;
