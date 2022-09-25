import {useNavigation} from '@react-navigation/native';
import {mnemonicState, selectedChainState} from '@recoil/connectChainState';
import Typography from 'components/Typography';
import LinkableChains from 'config/LinkableChains';
import ROUTES from 'navigation/routes';
import React, {FC, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, useTheme} from 'react-native-paper';
import {useSetRecoilState} from 'recoil';
import profilesState from '@recoil/profiles';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import LocalWallet from 'lib/LocalWallet';
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
  const {replace} =
    useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const {t} = useTranslation();

  const setMnemonic = useSetRecoilState(mnemonicState);
  const setSelectedChain = useSetRecoilState(selectedChainState);
  const setLoadedProfiles = useSetRecoilState(profilesState);

  // const setCreateLedgerAccount = useSetRecoilState(createLedgerAccountState);
  // const setCreateLocalWallet = useSetRecoilState(createLocalWalletState);

  const onPressOverride = useCallback(
    async (wallet: LocalWallet) => {
      // to do - add ledger support
      if (loadedProfileAddresses.has(wallet.bech32Address)) {
        return replace(ROUTES.USER_PROFILE, {
          visitingProfileAddress: wallet.bech32Address,
        });
      }

      // const chainAccounts: ChainAccount[] = accounts.map((acc, idx) => ({
      //   address: acc.address,
      //   signAlgorithm: acc.algo,
      //   hdPath: hdPaths[idx],
      //   type: ChainAccountType.Ledger,
      //   pubKey: toBase64(acc.pubkey),
      // }));
      // setCreateLocalWallet({
      //   chain: selectedChain,
      // });
      // replace(ROUTES.CREATE_DESMOS_PROFILE, {accountOverride: wallet});
    },
    [loadedProfileAddresses],
  );
  const handleCreateDesmosProfile = useCallback(() => {
    // to do - add ledger support
    if (mnemonic) setMnemonic(mnemonic);
    setSelectedChain(LinkableChains.find(c => /^Desmos$/i.test(c.name))!);
    replace(ROUTES.CONNECT_ADDRESS_GENERAL, {onPressOverride});
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
