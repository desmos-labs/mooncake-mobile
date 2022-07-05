import DButton from 'components/DButton';
import DView from 'components/DView';
import Section from 'components/Section';
import SectionButton from 'components/SectionButton';
import SectionSwitch from 'components/SectionSwitch';
import Typography from 'components/Typography';
import React, {useCallback, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {useRecoilState} from 'recoil';
import appSettingsState from 'recoil/settings';
import useStyles from 'screens/Settings/useStyles';
import {AppSettings} from 'types/settings';

const Settings = () => {
  const [settings, setSettings] = useRecoilState(appSettingsState);
  const {t} = useTranslation();
  const styles = useStyles();

  const areBiometricsSupported = useCallback(async () => {
    console.log('checkIfBiometricsAreSupported');
  }, []);

  useEffect(() => {
    /**
     * We need to check if the user has a compatible device with biometrics. If not we should disable this button
     */
    areBiometricsSupported();
  }, []);

  return (
    <DView style={styles.root}>
      <Typography.H3 style={styles.title}>{t('settings')}</Typography.H3>
      <ScrollView
        style={styles.scrollViewOuter}
        contentContainerStyle={styles.scrollViewInner}
        showsVerticalScrollIndicator={false}>
        <Section style={styles.spacer} title={t('account')}>
          <SectionButton
            label={t('profiles')}
            onPress={() => console.log('profiles')}
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
            onPress={() => console.log('notifications')}
          />
          <SectionButton label={t('faq')} onPress={() => console.log('faq')} />
          <SectionButton
            label={t('community')}
            onPress={() => console.log('community')}
          />
          <SectionButton
            label={t('feedback')}
            onPress={() => console.log('feedback')}
          />
          <SectionButton
            label={t('about')}
            onPress={() => console.log('about')}
          />
        </Section>
        <LinearGradient
          style={styles.signOutButton}
          colors={[
            'rgba(255, 199, 91, 1)',
            'rgba(255, 132, 79, 1)',
            'rgba(255, 132, 79, 1)',
            'rgba(255, 132, 79, 1)',
          ]}>
          <DButton
            style={styles.innerButton}
            mode="outlined"
            onPress={() => console.log('onPress')}>
            {t('signOut')}
          </DButton>
        </LinearGradient>
        <Typography.Body7 style={styles.bottomText}>
          {t('joined flagship since 21 june 2022')}
        </Typography.Body7>
      </ScrollView>
    </DView>
  );
};

export default Settings;
