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
import { Linking } from 'react-native';
import { PASSWORD_MANIPULATION_MODE } from 'screens/PasswordManipulation';
import VersionString from 'screens/Settings/components/VersionString';
import useStyles from 'screens/Settings/useStyles';
import useFormatDateToTZ from 'hooks/formatting/useFormatDateToTZ';
import { useDeleteAuthToken } from 'services/axios';
import { useNavigation } from '@react-navigation/native';
import { useSetSettings, useSettings } from '@recoil/settings';
import { useToggleBiometrics, useToggleSimplifiedTxBroadcast } from 'screens/Settings/hooks';
import { useTheme } from 'react-native-paper';
import { useActiveAccount } from '@recoil/accounts';
import { RequiredMessageTypesGrant } from 'config/AutzGrants';

declare type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SETTINGS>;

const Settings: React.FC<NavProps> = props => {
  const {
    navigation: { navigate },
  } = props;
  const activeAccount = useActiveAccount()!;
  const theme = useTheme();
  const settings = useSettings();
  const setSettings = useSetSettings();
  const { t } = useTranslation('settings');
  const styles = useStyles();
  const { reset } = useNavigation<NavProps['navigation']>();
  const {
    loading: loadingSimplifiedTxBroadcast,
    state: simplifiedTxBroadcast,
    toggleSimplifiedTxBroadcast,
  } = useToggleSimplifiedTxBroadcast(RequiredMessageTypesGrant);
  const { biometricsSupported, biometricsEnabled, toggleBiometrics } = useToggleBiometrics();
  const deleteAuthToken = useDeleteAuthToken();

  const formattedAccountCreationDate = useFormatDateToTZ(
    activeAccount.creationDate.toISOString(),
    'MMM dd yyyy',
  );

  const manageNewPostNotif = useCallback(
    (type: 'discover' | 'following') => () => {
      if (type === 'discover') {
        setSettings(oldSettings => ({
          ...oldSettings,
          newDiscPostNotification: !oldSettings.newDiscPostNotification,
        }));
      } else if (type === 'following') {
        setSettings(oldSettings => ({
          ...oldSettings,
          newFollowPostNotification: !oldSettings.newFollowPostNotification,
        }));
      }
    },
    [setSettings],
  );

  const handleChangePassword = useCallback(async () => {
    navigate(ROUTES.PASSWORD_MANIPULATION, {
      mode: PASSWORD_MANIPULATION_MODE.CHANGE_PASSWORD,
    });
  }, [navigate]);

  const handlePressSignOut = useCallback(() => {
    deleteAuthToken();
    // Home screen will request user to login if no bearer token is detected
    reset({
      index: 0,
      routes: [
        {
          name: ROUTES.HOME_TABS,
        },
      ],
    });
  }, [reset, deleteAuthToken]);

  const confirmSignOut = useCallback(() => {
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
        onPressSecondary: handlePressSignOut,
      },
    });
  }, [handlePressSignOut, navigate, t, theme.colors.butterOrange01]);

  const sendFeedback = useCallback(async () => {
    Linking.openURL('mailto:dev@forbole.com').catch(err =>
      console.error("Couldn't open email application", err),
    );
  }, []);

  return (
    <DView scrollable style={styles.root} topBar={<TopBar />}>
      <Typography.H3 style={styles.title}>{t('settings')}</Typography.H3>

      {/* Account section */}
      <Section style={styles.spacer} title={t('account')}>
        <SectionButton
          label={t('manage connected addresses')}
          onPress={() => {
            navigate(ROUTES.MANAGE_CONNECTED_CHAINS);
          }}
        />
        <SectionButton
          label={t('manage connected apps')}
          onPress={() => navigate(ROUTES.MANAGE_CONNECTED_APPS)}
        />
      </Section>

      {/* Security section */}
      <Section style={styles.spacer} title={t('security')}>
        <SectionSwitch
          label={t('permissions')}
          onValueChange={toggleSimplifiedTxBroadcast}
          value={simplifiedTxBroadcast}
          disabled={loadingSimplifiedTxBroadcast}
        />
        <SectionButton label={t('change password')} onPress={handleChangePassword} />
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
        <SectionButton label={t('notifications')} onPress={() => Linking.openSettings()} />
        <SectionSwitch
          label={t('notifyOnNewDiscPosts')}
          value={settings.newDiscPostNotification}
          onValueChange={manageNewPostNotif('discover')}
        />
        <SectionSwitch
          label={t('notifyOnNewFollowPosts')}
          value={settings.newFollowPostNotification}
          onValueChange={manageNewPostNotif('following')}
        />
        <SectionButton
          label={t('invites:invites')}
          onPress={() => navigate(ROUTES.SETTINGS_INVITES)}
        />
        <SectionButton label={t('community')} onPress={() => navigate(ROUTES.SETTINGS_COMMUNITY)} />
        <SectionButton label={t('feedbacks')} onPress={sendFeedback} />
        <SectionButton label={t('about')} onPress={() => console.log('about')} />
      </Section>
      <Spacer paddingVertical={12} />
      <Button mode="outlined" style={styles.signOutButton} onPress={confirmSignOut}>
        <Typography.Button1 onPress={handlePressSignOut}>
          {t('confirmModal:signout')}
        </Typography.Button1>
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
