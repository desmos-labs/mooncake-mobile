import {StackScreenProps} from '@react-navigation/stack';
import Button from 'components/Button';
import DView from 'components/DView';
import Section from 'components/Section';
import SectionButton from 'components/SectionButton';
import SectionSwitch from 'components/SectionSwitch';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback, useEffect} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {Linking} from 'react-native';
import {useRecoilState} from 'recoil';
import appSettingsState from 'recoil/settings';
import useStyles from 'screens/Settings/useStyles';
import {AppSettings} from 'types/settings';
import {useTheme} from 'react-native-paper';
import {PASSWORD_MANIPULATION_MODE} from 'screens/PasswordManipulation';

declare type Props = StackScreenProps<RootNavigatorParamList>;

const Settings: React.FC<Props> = props => {
  const {navigation} = props;
  const [settings, setSettings] = useRecoilState(appSettingsState);
  const {t} = useTranslation('settings');
  const styles = useStyles();
  const theme = useTheme();

  /*  const areBiometricsSupported = useCallback(async () => {
    console.log('checkIfBiometricsAreSupported');
  }, []); */

  const navigateToConfirmModal = useCallback(() => {
    navigation.navigate({
      name: ROUTES.CONFIRM_MODAL,
      params: {
        title: t('confirmModal:removeProfile'),
        subtitle: (
          <Trans
            i18nKey="confirmModal:backupSeedphrase"
            components={[
              <Typography.Subtitle2
                style={{color: theme.colors.desmosOrange01}}
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
    <DView
      scrollable
      style={styles.root}
      topBar={<TopBar stackProps={props} />}>
      <Typography.H3 style={styles.title}>{t('settings')}</Typography.H3>

      <Section style={styles.spacer} title={t('account')}>
        <SectionButton
          label={t('profiles')}
          onPress={() => navigation.navigate(ROUTES.SETTINGS_PROFILES)}
        />
        <SectionButton
          label={t('manage connected addresses')}
          onPress={() => console.log('manage connected addresses')}
        />
        <SectionButton
          label={t('manage connected apps')}
          onPress={() => console.log('manage connected apps')}
        />
      </Section>
      <Section style={styles.spacer} title={t('security')}>
        <SectionButton
          label={t('reveal secret phrase')}
          onPress={() =>
            navigation.navigate(ROUTES.SETTINGS_REVEAL_SECRET_PHRASE)
          }
        />
        <SectionButton
          label={t('change password')}
          onPress={() =>
            navigation.navigate(ROUTES.PASSWORD_MANIPULATION, {
              mode: PASSWORD_MANIPULATION_MODE.CHANGE_PASSWORD,
            })
          }
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
        <SectionButton label={t('faq')} onPress={() => console.log('faq')} />
        <SectionButton
          label={t('community')}
          onPress={() => navigation.navigate(ROUTES.SETTINGS_COMMUNITY)}
        />
        <SectionButton label={t('feedbacks')} onPress={sendFeedback} />
        <SectionButton
          label={t('about')}
          onPress={() => console.log('about')}
        />
      </Section>

      <Button
        mode="gradient"
        style={styles.signOutButton}
        containerStyle={styles.buttonContainer}
        onPress={navigateToConfirmModal}>
        {t('signOut')}
      </Button>

      <Typography.Body7 style={styles.bottomText}>
        {t('joined product', {
          formattedDate: '21 June 2022',
        })}
      </Typography.Body7>
    </DView>
  );
};

export default Settings;
