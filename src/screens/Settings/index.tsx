import {StackScreenProps} from '@react-navigation/stack';
import DView from 'components/DView';
import Section from 'components/Section';
import SectionButton from 'components/SectionButton';
import SectionSwitch from 'components/SectionSwitch';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Linking} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useRecoilState} from 'recoil';
import appSettingsState from 'recoil/settings';
import useStyles from 'screens/Settings/useStyles';
import {AppSettings} from 'types/settings';
import DButton from 'components/DButton';

declare type Props = StackScreenProps<RootNavigatorParamList>;

const Settings: React.FC<Props> = props => {
  const {navigation} = props;
  const [settings, setSettings] = useRecoilState(appSettingsState);
  const {t} = useTranslation('settings');
  const styles = useStyles();

  /*  const areBiometricsSupported = useCallback(async () => {
    console.log('checkIfBiometricsAreSupported');
  }, []); */

  const navigateToConfirmModal = useCallback(() => {
    navigation.navigate({
      name: ROUTES.CONFIRM_MODAL,
      params: {
        title: t('confirmModal:signout'),
        subtitle: t('confirmModal:backupSeedphrase'),
        primaryButtonLabel: t('confirmModal:goToBackup'),
        secondaryButtonLabel: t('confirmModal:signout'),
        onPressPrimary: () => console.log('primary'),
        onPressSecondary: () => console.log('secondary'),
      },
    });
  }, []);

  useEffect(() => {
    /**
     * We need to check if the user has a compatible device with biometrics. If not we should disable this button
     */
    // areBiometricsSupported();
  }, []);

  return (
    <DView style={styles.root} topBar={<TopBar stackProps={props} />}>
      <Typography.H3 style={styles.title}>{t('settings')}</Typography.H3>
      <ScrollView
        style={styles.scrollViewOuter}
        contentContainerStyle={styles.scrollViewInner}
        showsVerticalScrollIndicator={false}>
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
            label={t('reveal secret recovey phrase')}
            onPress={() => console.log('reveal secret recovey phrase')}
          />
          <SectionButton
            label={t('change password')}
            onPress={() => console.log('change password')}
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
          <SectionButton
            label={t('feedbacks')}
            onPress={() => console.log('feedbacks')}
          />
          <SectionButton
            label={t('about')}
            onPress={() => console.log('about')}
          />
        </Section>

        <DButton
          mode="gradient"
          style={styles.signOutButton}
          onPress={navigateToConfirmModal}>
          {t('signOut')}
        </DButton>

        <Typography.Body7 style={styles.bottomText}>
          {t('joined product', {
            formattedDate: '21 June 2022',
          })}
        </Typography.Body7>
      </ScrollView>
    </DView>
  );
};

export default Settings;
