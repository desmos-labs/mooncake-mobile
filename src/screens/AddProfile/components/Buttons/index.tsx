import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import profilesState from '@recoil/profiles';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {FC, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, useTheme} from 'react-native-paper';
import {useSetRecoilState} from 'recoil';
import useStyles from './useStyles';

type ButtonProps = {
  canAddProfile: boolean;
  selectedProfiles: ProfileData[];
  loadedProfileMap: Map<string, ProfileData>;
};

const Buttons: FC<ButtonProps> = ({
  canAddProfile,
  selectedProfiles,
  loadedProfileMap,
}) => {
  const styles = useStyles();
  const theme = useTheme();
  const {navigate} =
    useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const {t} = useTranslation();

  const setLoadedProfiles = useSetRecoilState(profilesState);

  /* boardcast the MsgSaveProfile after an address is selected */
  /* Navigating to the connect address general screen. */
  /* TO DO: add Ledger support */
  const handleCreateDesmosProfile = useCallback(async () => {
    navigate(ROUTES.CONNECT_ADDRESS_GENERAL, {
      nextRouteOverride: ROUTES.CREATE_DESMOS_PROFILE,
      loadedProfileMap,
    });
  }, [loadedProfileMap]);

  /* Adding the selected profiles to the loaded profiles. */
  const handleConfirmPressed = useCallback(async () => {
    setLoadedProfiles(prev => {
      if (!selectedProfiles.length) return prev;
      const prevAddreses = prev.reduce(
        (set, {address}) => set.add(address),
        new Set<string>(),
      );
      const newProfiles = selectedProfiles.filter(
        ({address}) => !prevAddreses.has(address),
      );
      if (!newProfiles.length) return prev;
      return prev.concat(newProfiles);
    });
  }, [selectedProfiles]);

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
          disabled={selectedProfiles.length === 0}
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
