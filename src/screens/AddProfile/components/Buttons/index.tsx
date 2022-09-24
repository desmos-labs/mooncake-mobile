import {StackActions, useNavigation} from '@react-navigation/native';
import {mnemonicState, selectedChainState} from '@recoil/connectChainState';
import Typography from 'components/Typography';
import LinkableChains from 'config/LinkableChains';
import ROUTES from 'navigation/routes';
import React, {FC, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, useTheme} from 'react-native-paper';
import {useSetRecoilState} from 'recoil';
import profilesState from '@recoil/profiles';
import {OfflineSigner} from '@cosmjs/proto-signing';
import useStyles from './useStyles';

type ButtonProps = {
  canAddProfile: boolean;
  mnemonic: string | undefined;
  selectedProfiles: ProfileData[];
  loadedProfileAddresses: Set<string>;
};

const Buttons: FC<ButtonProps> = ({
  canAddProfile,
  mnemonic,
  selectedProfiles,
  loadedProfileAddresses,
}) => {
  const styles = useStyles();
  const theme = useTheme();
  const {dispatch} = useNavigation();
  const {t} = useTranslation();

  const setMnemonic = useSetRecoilState(mnemonicState);
  const setSelectedChain = useSetRecoilState(selectedChainState);
  const setLoadedProfiles = useSetRecoilState(profilesState);
  const onPressOverride = useCallback(
    async (signer: OfflineSigner) => {
      const accounts = await signer.getAccounts();
      if (!accounts.length) throw new Error('No accounts found');
      const accountOverride = accounts[0];
      if (loadedProfileAddresses.has(accountOverride.address)) {
        dispatch(
          StackActions.push(ROUTES.USER_PROFILE, {
            visitingProfileAddress: accountOverride.address,
          }),
        );
      } else {
        dispatch(
          StackActions.push(ROUTES.CREATE_DESMOS_PROFILE, {accountOverride}),
        );
      }
    },
    [loadedProfileAddresses],
  );
  const handleCreateDesmosProfile = useCallback(() => {
    if (mnemonic) {
      setMnemonic(mnemonic);
    }
    setSelectedChain(LinkableChains.find(c => /^Desmos$/i.test(c.name))!);
    dispatch(
      StackActions.push(ROUTES.CONNECT_ADDRESS_GENERAL, {
        onPressOverride,
      }),
    );
  }, [mnemonic]);

  const handleConfirmPressed = useCallback(async () => {
    setLoadedProfiles(prev => {
      if (!selectedProfiles.length) {
        return prev;
      }
      const newProfiles = prev.slice();
      selectedProfiles.forEach(profile => {
        if (prev.some(p => p.address === profile.address)) {
          return;
        }
        newProfiles.push(profile);
      });
      return newProfiles;
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
