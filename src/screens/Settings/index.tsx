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
import { useTheme } from 'native-base';
import { useActiveAccount } from '@recoil/accounts';
import { RequiredMessageTypesGrant } from 'config/AutzGrants';
import {
  useChangePassword,
  useOpenNotificationsSettings,
  useSendFeedback,
  useShowAboutInfo,
  useShowPrivateKey,
  useSignOut,
  useToggleBiometrics,
  useToggleSimplifiedTxBroadcast,
} from './hooks';

declare type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SETTINGS>;

/**
 * Screen that allows the user to view their settings.
 * @constructor
 */
const Settings = (props: NavProps) => {
  const { t } = useTranslation('settings');
  const styles = useStyles();
  const theme = useTheme();

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

  const {
    loading: loadingSimplifiedTxBroadcast,
    permissionsEnabled: simplifiedTxBroadcast,
    toggleSimplifiedTxBroadcast,
  } = useToggleSimplifiedTxBroadcast(RequiredMessageTypesGrant);

  const changePassword = useChangePassword();
  const { biometricsSupported, biometricsEnabled, toggleBiometrics } = useToggleBiometrics();

  const openNotificationsSettings = useOpenNotificationsSettings();

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const sendFeedback = useSendFeedback();
  const showAboutInfo = useShowAboutInfo();
  const signOut = useSignOut();

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

  // -------------------------------------------------------------------------------------
  // --- View rendering
  // -------------------------------------------------------------------------------------

  return (
    <DView scrollable style={styles.root} topBar={<TopBar />}>
      <Typography.H3 style={styles.title}>{t('settings')}</Typography.H3>

      {/* Security section */}
      <Section style={styles.spacer} title={t('security')}>
        <SectionSwitch
          label={t('permissions')}
          onValueChange={toggleSimplifiedTxBroadcast}
          value={simplifiedTxBroadcast}
          disabled={loadingSimplifiedTxBroadcast}
        />

        {biometricsSupported && (
          <SectionSwitch
            label={t('enable biometrics')}
            value={biometricsEnabled}
            onValueChange={toggleBiometrics}
          />
        )}
        <SectionButton label={t('change password')} onPress={changePassword} />
        {canShowPrivateKey && (
          <SectionButton label={t('show private key')} onPress={showPrivateKey} />
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
        {t('confirmModal:signout')}
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
