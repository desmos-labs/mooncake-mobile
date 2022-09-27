import {StackScreenProps} from '@react-navigation/stack';
import {mnemonicState, signerState} from '@recoil/connectChainState';
import {useLoadProfiles} from '@recoil/profiles';
import {defaultProfilePic} from 'assets/images';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {MMKVKEYS, useMMKVStorage} from 'lib/MMKVStorage';
import {getAccounts} from 'lib/SecureStorage';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback, useMemo, useRef} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import {useResetRecoilState} from 'recoil';
import SettingsProfileBadgeGroup from 'screens/Profiles/components/SettingsProfileBadgeGroup';
import useStyles from './useStyles';

declare type Props = StackScreenProps<RootNavigatorParamList>;

const Profiles: React.FC<Props> = props => {
  const {navigation} = props;
  const {profiles} = useLoadProfiles();
  const [activeAddress] = useMMKVStorage<string | undefined>(
    MMKVKEYS.ACTIVE_ACCOUNT_ADDR,
  );

  const {t} = useTranslation('settings');
  const styles = useStyles();
  const scrollRef = useRef(null);
  const theme = useTheme();

  React.useEffect(() => {
    const loadProfiles = async () => {
      const _profiles = await getAccounts();
      if (_profiles) {
        const addresses = _profiles.map(x => x.address);

        console.log(addresses);
      }
    };

    loadProfiles();
  }, []);

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
                style={{color: theme.colors.butterOrange01}}
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

  const resetSigner = useResetRecoilState(signerState);
  const resetMnemonic = useResetRecoilState(mnemonicState);
  const navigateToAddProfile = useCallback(() => {
    resetSigner();
    resetMnemonic();
    navigation.navigate(ROUTES.ADD_PROFILE);
  }, [activeAddress]);

  const selectProfile = (i: number) => {
    profiles.forEach((profile, index) => {
      if (index === i) {
        // setUserOptions({selectedProfile: profile});
      }
    });
  };

  const values = useMemo(() => {
    if (profiles.length === 0) return [];
    return profiles.map(profile => {
      return {
        nickname: profile.nickname,
        dTag: profile.dtag,
        profilePicture: profile.profile_pic
          ? {uri: profile.profile_pic}
          : defaultProfilePic,
        isSelected: activeAddress === profile.address,
      };
    });
  }, [profiles]);

  return (
    <DView style={styles.root} topBar={<TopBar />}>
      <View style={styles.titleBar}>
        <Typography.H3 style={styles.title}>{t('profiles')}</Typography.H3>
        <TouchableOpacity
          style={styles.plusButton}
          onPress={navigateToAddProfile}>
          <View style={styles.plusButton}>
            <Icon
              name="plus"
              color="white"
              size={24}
              allowFontScaling
              style={styles.plusButtonIcon}
            />
          </View>
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
