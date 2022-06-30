import DButton from 'components/DButton';
import DView from 'components/DView';
import Section from 'components/Section';
import SectionButton from 'components/SectionButton';
import SectionSwitch from 'components/SectionSwitch';
import React, {useCallback, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
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
    <DView style={styles.root} scrollable>
      <Section title={t('settings')}>
        <SectionButton
          label={t('dTags')}
          onPress={() => console.log('dTags')}
        />
        <SectionButton
          label={t('manage connected addresses')}
          onPress={() => console.log('manage connected addresses')}
        />
        <SectionButton
          label={t('manage connected apps')}
          onPress={() => console.log('manage connected apps')}
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
        <SectionSwitch
          label={t('enable notifications')}
          value={settings.notifications}
          onValueChange={() =>
            setSettings((oldState: AppSettings) => {
              return {
                ...oldState,
                notifications: !settings.notifications,
              };
            })
          }
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
      <DButton
        style={styles.signOutButton}
        mode="outlined"
        onPress={() => console.log('onPress')}>
        {t('signOut')}
      </DButton>
    </DView>
  );
};

export default Settings;
