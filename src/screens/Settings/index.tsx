import { StackScreenProps } from '@react-navigation/stack';
import Button from 'components/Button';
import DView from 'components/DView';
import Section from 'components/Section';
import SectionButton from 'components/SectionButton';
import SectionSwitch from 'components/SectionSwitch';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import useActiveAccount from 'hooks/useActiveAccount';
import useUnlockWallet from 'hooks/useUnlockWallet';
import { deleteBiometricData } from 'lib/SecureStorage';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { InteractionManager, Linking } from 'react-native';
import { getSupportedBiometryType } from 'react-native-keychain';
import { useTheme } from 'react-native-paper';
import { useRecoilState } from 'recoil';
import appSettingsState from 'recoil/settings';
import { PASSWORD_MANIPULATION_MODE } from 'screens/PasswordManipulation';
import VersionString from 'screens/Settings/components/VersionString';
import useStyles from 'screens/Settings/useStyles';
import useFormatDateToTZ from 'hooks/formatting/useFormatDateToTZ';
import { deleteAuthToken } from 'services/axios';
import { useNavigation } from '@react-navigation/native';
import { AppSettings } from 'types/settings';

declare type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SETTINGS>;

const Settings: React.FC<NavProps> = props => {
  const {
    navigation: { navigate },
  } = props;
  const [settings, setSettings] = useRecoilState(appSettingsState);
  const [biometricsSupported, setBiometricsSupported] = useState<boolean>();
  const { chainAccount, profileData, activeAddress } = useActiveAccount();
  const { t } = useTranslation('settings');
  const styles = useStyles();
  const theme = useTheme();
  const unlockWallet = useUnlockWallet();
  const { reset } = useNavigation<NavProps['navigation']>();

  const formattedAccountCreationDate = useFormatDateToTZ(
    profileData?.creation_time || '',
    'MMM dd yyyy',
  );

  const areBiometricsSupported = useCallback(async () => {
    try {
      const supported = await getSupportedBiometryType();
      if (supported) {
        setBiometricsSupported(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const manageBiometrics = useCallback(async () => {
    if (settings.biometrics) {
      const result = await deleteBiometricData();
      if (result) {
        setSettings((oldState: AppSettings) => {
          return {
            ...oldState,
            biometrics: !settings.biometrics,
          };
        });
      }
    } else {
      navigate(ROUTES.MANAGE_BIOMETRICS);
    }
  }, [activeAddress, navigate, setSettings, settings.biometrics]);

  const manageNewPostNotif = useCallback(
    (type: 'discover' | 'following') => () => {
      if (type === 'discover') {
        setSettings(prev => ({
          ...prev,
          newDiscPostNotification: !settings.newDiscPostNotification,
        }));
      } else if (type === 'following') {
        setSettings(prev => ({
          ...prev,
          newFollowPostNotification: !settings.newFollowPostNotification,
        }));
      }
    },
    [settings.newDiscPostNotification, settings.newFollowPostNotification],
  );

  useEffect(() => {
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      areBiometricsSupported();
    });
    return () => interactionPromise.cancel();
  }, []);

  const handlePressSignOut = () => {
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
  };

  const handleChangePassword = useCallback(async () => {
    if (chainAccount) {
      const unlockResult = await unlockWallet({
        chainAccount,
        skipBiometrics: true,
        enterPwScreenOptions: {
          titleLabelOverride: t('passwordManipulation:changePw'),
        },
      });
      if (unlockResult) {
        navigate(ROUTES.PASSWORD_MANIPULATION, {
          mode: PASSWORD_MANIPULATION_MODE.CHANGE_PASSWORD,
          oldPassword: unlockResult.password,
        });
      }
    }
  }, [chainAccount, navigate, unlockWallet]);

  const navigateToConfirmModal = useCallback(() => {
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
  }, [handlePressSignOut]);

  const sendFeedback = useCallback(async () => {
    Linking.openURL('mailto:dev@forbole.com').catch(err =>
      console.error("Couldn't open email application", err),
    );
  }, []);

  return (
    <DView scrollable style={styles.root} topBar={<TopBar />}>
      <Typography.H3 style={styles.title}>{t('settings')}</Typography.H3>

      <Section style={styles.spacer} title={t('account')}>
        {/*        <SectionButton
          label={t('profiles')}
          onPress={() => navigate(ROUTES.SETTINGS_PROFILES)}
        /> */}
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
      <Section style={styles.spacer} title={t('security')}>
        <SectionButton label={t('permissions')} onPress={() => navigate(ROUTES.GRANTS)} />
        <SectionButton
          label={t('reveal secret phrase')}
          onPress={() => navigate(ROUTES.SETTINGS_REVEAL_SECRET_PHRASE)}
        />
        <SectionButton label={t('change password')} onPress={handleChangePassword} />
        {biometricsSupported && (
          <SectionSwitch
            label={t('enable biometrics')}
            value={settings.biometrics}
            onValueChange={manageBiometrics}
          />
        )}
      </Section>
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
        {/* removed as of Sept 23, DFP-497 */}
        {/* <SectionButton label={t('faq')} onPress={() => console.log('faq')} /> */}
        <SectionButton label={t('invites:invites')} onPress={() => navigate(ROUTES.INVITES)} />
        <SectionButton label={t('community')} onPress={() => navigate(ROUTES.SETTINGS_COMMUNITY)} />
        <SectionButton label={t('feedbacks')} onPress={sendFeedback} />
        <SectionButton label={t('about')} onPress={() => console.log('about')} />
      </Section>
      <Spacer paddingVertical={12} />
      <Button mode="outlined" style={styles.signOutButton} onPress={navigateToConfirmModal}>
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
