import profilesState from '@recoil/profiles';
import DView from 'components/DView';
import Typography from 'components/Typography';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useRecoilState} from 'recoil';
import SettingsProfileBadgeGroup, {
  RadioValue,
} from 'screens/Settings/components';
import useStyles from './useStyles';

const Profiles = () => {
  const [profiles] = useRecoilState(profilesState);
  const {t} = useTranslation('settings');
  const styles = useStyles();

  const values = useMemo(() => {
    return profiles.map(profile => {
      return {
        nickname: profile.nickname,
        dTag: profile.dtag,
        profilePicture: {uri: profile.profilePicture},
        status: 1,
      } as RadioValue;
    });
  }, []);

  return (
    <DView style={styles.root}>
      <View>
        <Typography.H3>{t('profiles')}</Typography.H3>
      </View>
      <ScrollView
        style={styles.scrollViewOuter}
        contentContainerStyle={styles.scrollViewInner}>
        <SettingsProfileBadgeGroup
          values={values}
          onSelect={() => console.log('ciao')}
        />
      </ScrollView>
    </DView>
  );
};

export default Profiles;
