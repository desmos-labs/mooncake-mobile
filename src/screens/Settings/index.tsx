import {StackScreenProps} from '@react-navigation/stack';
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
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback, useEffect} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {Linking} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useRecoilState} from 'recoil';
import appSettingsState from 'recoil/settings';
import {PASSWORD_MANIPULATION_MODE} from 'screens/PasswordManipulation';
import VersionString from 'screens/Settings/components/VersionString';
import useStyles from 'screens/Settings/useStyles';
import {AppSettings} from 'types/settings';
import useFormatDateToTZ from 'hooks/formatting/useFormatDateToTZ';

declare type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.SETTINGS
>;

const Settings: React.FC<NavProps> = props => {
  const {
    navigation: {navigate},
  } = props;
  const [settings, setSettings] = useRecoilState(appSettingsState);
  const {chainAccount, profileData} = useActiveAccount();
  const {t} = useTranslation('settings');
  const styles = useStyles();
  const theme = useTheme();
  const unlockWallet = useUnlockWallet();

  const formattedAccountCreationDate = useFormatDateToTZ(
    profileData?.creation_time || '',
    'MMM dd yyyy',
  );

  /*  const areBiometricsSupported = useCallback(async () => {
    console.log('checkIfBiometricsAreSupported');
  }, []); */

  const handleChangePassword = useCallback(async () => {
    if (chainAccount) {
      const unlockResult = await unlockWallet(chainAccount);
      if (unlockResult) {
        navigate(ROUTES.PASSWORD_MANIPULATION, {
          mode: PASSWORD_MANIPULATION_MODE.CHANGE_PASSWORD,
        });
      }
    }
  }, [chainAccount, unlockWallet]);

  const navigateToConfirmModal = useCallback(() => {
    navigate({
      name: ROUTES.CONFIRM_MODAL,
      params: {
        title: t('confirmModal:signout'),
        subtitle: (
          <Trans
            i18nKey="confirmModal:backupSeedphrase"
            components={[
              <Typography.Subtitle2
                style={{color: theme.colors.butterOrange01}}
              />,
            ]}
          />
        ),
        primaryButtonLabel: t('confirmModal:goToBackup'),
        secondaryButtonLabel: t('confirmModal:signout'),
        onPressPrimary: () => console.log('primary'),
        onPressSecondary: () => console.log('secondary'),
      },
    });
  }, []);

  const sendFeedback = useCallback(async () => {
    Linking.openURL('mailto:dev@forbole.com').catch(err =>
      console.error("Couldn't open email application", err),
    );
  }, []);

  useEffect(() => {
    /**
     * We need to check if the user has a compatible device with biometrics. If not we should disable this button
     */
    // areBiometricsSupported();
  }, []);

  return (
    <DView scrollable style={styles.root} topBar={<TopBar />}>
      <Typography.H3 style={styles.title}>{t('settings')}</Typography.H3>

      <Section style={styles.spacer} title={t('account')}>
        <SectionButton
          label={t('profiles')}
          onPress={() => navigate(ROUTES.SETTINGS_PROFILES)}
        />
        <SectionButton
          label={t('manage connected addresses')}
          onPress={() => {
            navigate(ROUTES.MANAGE_CONNECTED_CHAINS);
          }}
        />
        <SectionButton
          label={t('manage connected apps')}
          onPress={() => console.log('manage connected apps')}
        />
      </Section>
      <Section style={styles.spacer} title={t('security')}>
        <SectionButton
          label={t('reveal secret phrase')}
          onPress={() => navigate(ROUTES.SETTINGS_REVEAL_SECRET_PHRASE)}
        />
        <SectionButton
          label={t('change password')}
          onPress={handleChangePassword}
        />
        <SectionSwitch
          label={t('enable biometrics')}
          value={settings.biometrics}
          onValueChange={() =>
            setSettings((oldState: AppSettings) => {
              return {
                ...oldState,
                biometrics: !settings.biometrics,
              };
            })
          }
        />
      </Section>
      <Section style={styles.spacer} title={t('others')}>
        <SectionButton
          label={t('notifications')}
          onPress={() => Linking.openSettings()}
        />
        {/* removed as of Sept 23, DFP-497 */}
        {/* <SectionButton label={t('faq')} onPress={() => console.log('faq')} /> */}
        <SectionButton
          label={t('community')}
          onPress={() => navigate(ROUTES.SETTINGS_COMMUNITY)}
        />
        <SectionButton label={t('feedbacks')} onPress={sendFeedback} />
        <SectionButton
          label={t('about')}
          onPress={() => console.log('about')}
        />
      </Section>
      <Spacer paddingVertical={12} />
      <Button
        mode="outlined"
        style={styles.signOutButton}
        onPress={navigateToConfirmModal}>
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
