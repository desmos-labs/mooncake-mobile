import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import profilesState from '@recoil/profiles';
import Typography from 'components/Typography';
import {saveNewAccount} from 'lib/SecureStorage';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {FC, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, useTheme} from 'react-native-paper';
import {useSetRecoilState} from 'recoil';
import {ChainAccount} from 'types/chains';
import useStyles from './useStyles';

type ButtonProps = {
  canAddProfile: boolean;
  selectedProfileMap: Map<string, ProfileData>;
  loadedProfileMap: Map<string, ProfileData>;
  accountsByPage: Array<ChainAccount[]>;
};

const Buttons: FC<ButtonProps> = ({
  canAddProfile,
  selectedProfileMap,
  loadedProfileMap,
  accountsByPage,
}) => {
  const styles = useStyles();
  const theme = useTheme();
  const navigation =
    useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const {t} = useTranslation();
  const setProfiles = useSetRecoilState(profilesState);

  /* boardcast the MsgSaveProfile after an address is selected */
  /* Navigating to the connect address general screen. */
  /* TO DO: add Ledger support */
  const handleCreateDesmosProfile = useCallback(async () => {
    navigation.navigate(ROUTES.CONNECT_ADDRESS_GENERAL, {
      nextRouteOverride: ROUTES.CREATE_DESMOS_PROFILE,
      loadedProfileMap,
      titleLabelOverride: t('addProfile:title'),
    });
  }, [navigation, loadedProfileMap]);

  /* Adding the selected profiles to the loaded profiles. */
  const handleConfirmPressed = useCallback(async () => {
    if (!selectedProfileMap.size) return;
    const tasks: Array<Promise<void>> = [];
    accountsByPage.forEach(accounts => {
      accounts.forEach(account => {
        if (selectedProfileMap.has(account.address)) {
          tasks.push(saveNewAccount(account));
        }
      });
    });
    await Promise.all(tasks);
    setProfiles(prev => {
      const prevWithoutSelected = prev.filter(
        p => !selectedProfileMap.has(p.address),
      );
      return prevWithoutSelected.concat(...selectedProfileMap.values());
    });
  }, [selectedProfileMap, accountsByPage]);

  if (canAddProfile) {
    return (
      <>
        <Button
          mode="text"
          color={theme.colors.surfaceBlack}
          style={styles.button}
          onPress={handleCreateDesmosProfile}>
          <Typography.Subtitle3 style={styles.textButton}>
            {t('addProfile:orCreateADesmosProfile')}
          </Typography.Subtitle3>
        </Button>
        <Button
          mode="contained"
          color={theme.colors.surfaceBlack}
          style={styles.button}
          disabled={selectedProfileMap.size === 0}
          onPress={handleConfirmPressed}>
          <Typography.Button2 style={styles.buttonLabel}>
            {t('common:confirm')}
          </Typography.Button2>
        </Button>
      </>
    );
  }

  return (
    <Button
      mode="contained"
      color={theme.colors.surfaceBlack}
      style={styles.button}
      onPress={handleCreateDesmosProfile}>
      <Typography.Subtitle2 style={styles.buttonLabel}>
        {t('noDtagFound:createDesmosProfile')}
      </Typography.Subtitle2>
    </Button>
  );
};

export default Buttons;
