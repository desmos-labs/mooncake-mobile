import messaging from '@react-native-firebase/messaging';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {signerState} from '@recoil/connectChainState';
import {useLoadProfiles} from '@recoil/profiles';
import appSettingsState from '@recoil/settings';
import {defaultProfilePic} from 'assets/images';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import useActiveAccount from 'hooks/useActiveAccount';
import useUnlockWallet from 'hooks/useUnlockWallet';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback, useMemo, useRef} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import SettingsProfileBadgeGroup from 'screens/Profiles/components/SettingsProfileBadgeGroup';
import useLogin from 'services/axios/requests/Login/useLogin';
import PostNotificationToken from 'services/axios/requests/PostNotificationToken';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.SETTINGS_PROFILES
>;

const Profiles = () => {
  const {biometrics} = useRecoilValue(appSettingsState);
  const {profiles, loadAddrsIntoState} = useLoadProfiles();
  const {activeAddress, chainAccount, setActiveAddress} = useActiveAccount();
  const {t} = useTranslation('settings');
  const styles = useStyles();
  const scrollRef = useRef(null);
  const theme = useTheme();
  const {navigate} = useNavigation<NavProps['navigation']>();
  const unlockWallet = useUnlockWallet();
  const setSigner = useSetRecoilState(signerState);
  const {login} = useLogin();

  const navigateToConfirmModal = useCallback((index: number) => {
    navigate({
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

  useFocusEffect(
    React.useCallback(() => {
      loadAddrsIntoState();
    }, []),
  );

  /*  const resetSigner = useResetRecoilState(signerState);
  const resetMnemonic = useResetRecoilState(mnemonicState); */

  const navigateToAddProfile = useCallback(async () => {
    if (!chainAccount) {
      throw new Error('No chain account');
    }

    try {
      const result = await unlockWallet({
        chainAccount,
        enterPwScreenOptions: {titleLabelOverride: t('addProfile:title')},
        skipBiometrics: true,
      });

      if (result) {
        navigate(ROUTES.ADD_PROFILE, {
          mnemonic: result.mnemonic!,
          password: result.password!,
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, [chainAccount, biometrics]);

  const navigateToSelectAddress = useCallback(async () => {
    if (!chainAccount) {
      throw new Error('No chain account');
    }

    try {
      const result = await unlockWallet({
        chainAccount,
        enterPwScreenOptions: {titleLabelOverride: t('addProfile:title')},
        skipBiometrics: true,
      });
      if (result) {
        navigate(ROUTES.ADD_PROFILE_SELECT_ADDRESS_GENERAL, {
          mnemonic: result.mnemonic!,
          password: result.password!,
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, [chainAccount]);

  const navigateToModal = useCallback(() => {
    navigate(ROUTES.ADD_PROFILE_MODAL, {
      onPressPrimary: () => navigateToAddProfile(),
      onPressSecondary: () => navigateToSelectAddress(),
    });
  }, [navigateToAddProfile]);

  const selectProfile = useCallback(
    async (i: number) => {
      await Promise.all(
        profiles.map(async (profile, index) => {
          if (index === i) {
            try {
              console.log(chainAccount);
              const unlockResult = await unlockWallet({
                chainAccount: chainAccount!,
              });
              if (
                unlockResult &&
                unlockResult.wallet &&
                unlockResult.password
              ) {
                setSigner(unlockResult.wallet);
                setActiveAddress(profile.address);
                await login({
                  activeAddress: profile.address,
                  password: unlockResult.password,
                });
                const notificationsToken = await messaging().getToken();
                await PostNotificationToken(notificationsToken.toString());
              }
            } catch (e) {
              console.error(e);
            }
          }
        }),
      );
    },
    [chainAccount, profiles],
  );

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
  }, [profiles, activeAddress]);

  return (
    <DView style={styles.root} topBar={<TopBar />}>
      <View style={styles.titleBar}>
        <Typography.H3 style={styles.title}>{t('profiles')}</Typography.H3>
        <TouchableOpacity style={styles.plusButton} onPress={navigateToModal}>
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
