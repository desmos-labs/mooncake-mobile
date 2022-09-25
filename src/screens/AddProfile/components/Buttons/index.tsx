import {toBase64} from '@cosmjs/encoding';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  mnemonicState,
  selectedChainState,
  signerState,
} from '@recoil/connectChainState';
import createLedgerAccountState from '@recoil/createLedgerAccountState';
import createLocalWalletState from '@recoil/createLocalWalletState';
import profilesState from '@recoil/profiles';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {FC, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, useTheme} from 'react-native-paper';
import {useSetRecoilState} from 'recoil';
import desmosChain from 'screens/AddProfile/desmosChain';
import {ChainAccountType} from 'types/chains';
import useStyles from './useStyles';

type ButtonProps = {
  canAddProfile: boolean;
  signer: OfflineSigner;
  mnemonic: string | undefined;
  selectedProfiles: ProfileData[];
  loadedProfileAddresses: Set<string>;
};

const Buttons: FC<ButtonProps> = ({
  canAddProfile,
  signer,
  mnemonic,
  selectedProfiles,
  loadedProfileAddresses,
}) => {
  const styles = useStyles();
  const theme = useTheme();
  const {navigate} =
    useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const {t} = useTranslation();

  const setMnemonic = useSetRecoilState(mnemonicState);
  const setSigner = useSetRecoilState(signerState);
  const setSelectedChain = useSetRecoilState(selectedChainState);
  const setLoadedProfiles = useSetRecoilState(profilesState);

  const setCreateLocalWallet = useSetRecoilState(createLocalWalletState);
  const setCreateLedgerAccount = useSetRecoilState(createLedgerAccountState);

  /* boardcast the MsgSaveProfile after an address is selected */
  /* Setting the signer and mnemonic and then navigating to the connect address general screen. */
  const handleCreateDesmosProfile = useCallback(async () => {
    setSigner(signer);

    if (mnemonic) {
      setMnemonic(mnemonic);
      setCreateLocalWallet(prev => ({...prev, mnemonic}));
    } else {
      const accounts = await signer.getAccounts();
      if (!accounts.length) return;
      setCreateLedgerAccount(prev => ({
        ...prev,
        account: {
          type: ChainAccountType.Ledger,
          address: accounts[0].address,
          hdPath: desmosChain().hdPath, // TO DO: add ledger support
          pubKey: toBase64(accounts[0].pubkey),
          signAlgorithm: accounts[0].algo,
        },
      }));
    }

    setSelectedChain(desmosChain());
    navigate(ROUTES.CONNECT_ADDRESS_GENERAL, {
      nextRouteOverride: ROUTES.CREATE_DESMOS_PROFILE,
      loadedProfileAddresses,
    });
  }, [signer, mnemonic, loadedProfileAddresses]);

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
