import {StackScreenProps} from '@react-navigation/stack';
import profilesState from '@recoil/profiles';
import userOptionsState from '@recoil/userOptions';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback, useMemo, useRef} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import {useRecoilState} from 'recoil';
import SettingsProfileBadgeGroup, {
  RadioValue,
} from 'screens/Profiles/components/SettingsProfileBadgeGroup';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

declare type Props = StackScreenProps<RootNavigatorParamList>;

const Profiles: React.FC<Props> = props => {
  const {navigation} = props;
  const [profiles] = useRecoilState(profilesState);
  const [userOptions, setUserOptions] = useRecoilState(userOptionsState);
  const {t} = useTranslation('settings');
  const styles = useStyles();
  const scrollRef = useRef(null);
  const theme = useTheme();

  const navigateToConfirmModal = useCallback((index: number) => {
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
        secondaryButtonLabel: t('confirmModal:remove'),
        onPressPrimary: () => console.log('primary', index),
        onPressSecondary: () => console.log('secondary', index),
      },
    });
  }, []);

  const selectProfile = (i: number) => {
    profiles.forEach((profile, index) => {
      if (index === i) {
        setUserOptions({...userOptions, selectedProfile: profile});
      }
    });
  };

  const values = useMemo(() => {
    return profiles.map(profile => {
      return {
        nickname: profile.nickname,
        dTag: profile.dtag,
        profilePicture: {uri: profile.profilePicture},
        isSelected: profile.address === userOptions.selectedProfile.address,
      } as RadioValue;
    });
  }, [profiles, userOptions.selectedProfile]);

  return (
    <DView style={styles.root} topBar={<TopBar stackProps={props} />}>
      <View style={styles.titleBar}>
        <Typography.H3 style={styles.title}>{t('profiles')}</Typography.H3>
        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => console.log('press')}>
          <LinearGradient
            colors={[
              'rgba(255, 199, 91, 1)',
              'rgba(255, 132, 79, 1)',
              'rgba(255, 132, 79, 1)',
              'rgba(255, 132, 79, 1)',
            ]}
            style={styles.plusButton}>
            <Icon
              name="plus"
              color="white"
              size={24}
              allowFontScaling
              style={styles.plusButtonIcon}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <ScrollView
        ref={scrollRef}
        style={styles.scrollViewOuter}
        contentContainerStyle={styles.scrollViewInner}>
        <SettingsProfileBadgeGroup
          simultaneousHandlers={scrollRef}
          values={values}
          onSelect={index => selectProfile(index)}
          onEditProfile={index => console.log('edit profile', index)}
          onRemoveProfile={index => navigateToConfirmModal(index)}
        />
      </ScrollView>
    </DView>
  );
};

export default Profiles;
