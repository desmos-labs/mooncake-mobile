import React from 'react';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { useTranslation } from 'react-i18next';
import ConnectChainMethodButton from 'screens/ConnectChainMethod/components/ConnectChainMethodButton';
import Spacer from 'components/Spacer';
import { useTheme } from 'react-native-paper';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  connectMethodState,
  mnemonicState,
  selectedChainState,
  signerState,
} from '@recoil/connectChainState';
import useUnlockWallet from 'hooks/useUnlockWallet';
import useActiveAccount from 'hooks/useActiveAccount';
import { ActivityIndicator } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useNavigation } from '@react-navigation/native';
import isLedgerSigner from 'screens/AddProfile/isLedgerSigner';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.CONNECT_CHAIN_METHOD>;

const ConnectChainMethod = () => {
  const { t } = useTranslation('connectChain');
  const { replace, navigate } = useNavigation<NavProps['navigation']>();
  const styles = useStyles();
  const theme = useTheme();

  const { chainAccount } = useActiveAccount();
  const unlockWallet = useUnlockWallet();

  const setConnectChainMethod = useSetRecoilState(connectMethodState);
  const selectedChain = useRecoilValue(selectedChainState);

  const setMnemonic = useSetRecoilState(mnemonicState);
  const setSigner = useSetRecoilState(signerState);

  const handlePressLedger = React.useCallback(() => {
    setConnectChainMethod('LEDGER');

    if (selectedChain.ledgerApps.length > 1) {
      navigate(ROUTES.SELECT_LEDGER_APP);
    } else {
      navigate(ROUTES.AUTHORIZE_WALLET, {
        screen: ROUTES.AUTH_LOOKING_FOR_DEVICES,
        params: {
          ledgerApp: selectedChain.ledgerApps[0],
          autoClose: true,
          onConnectionEstablished: (transport: BluetoothTransport) => {
            replace(ROUTES.CONNECT_ADDRESS_GENERAL, {
              ledgerApp: selectedChain.ledgerApps[0],
              ledgerTransport: transport,
            });
          },
        },
      });
    }
  }, []);

  const handlePressPassword = React.useCallback(async () => {
    if (chainAccount) {
      setConnectChainMethod('PASSWORD');

      const unlockResult = await unlockWallet({
        chainAccount,
        shouldReplaceRoute: false,
        enterPwScreenOptions: {
          titleLabelOverride: t('connectChain:connectChain'),
          inputLabelOverride: t('login:enterPassword'),
        },
      });

      if (unlockResult) {
        const { mnemonic, wallet } = unlockResult;

        if (mnemonic) {
          setMnemonic(mnemonic!);
          navigate(ROUTES.CONNECT_ADDRESS_GENERAL);
          // need to refactor ledger wallet flow once importing accounts via ledger is fixed
        } else if (isLedgerSigner(wallet)) {
          setSigner(wallet);
          navigate(ROUTES.CONNECT_ADDRESS_GENERAL);
        }
      }
    }
  }, [chainAccount]);

  // Placeholder
  if (!chainAccount) {
    return (
      <DView style={styles.container} topBar={<TopBar />}>
        <ActivityIndicator color={theme.colors.surfaceBlack} />
      </DView>
    );
  }

  return (
    <DView style={styles.container} topBar={<TopBar />} backgroundColor={theme.colors.white}>
      <Typography.H3 style={styles.textStyle}>{t('connectAddress')}</Typography.H3>
      <Spacer paddingBottom={theme.spacing.s} />
      <Typography.Body6 style={[styles.textStyle, styles.descriptionText]}>
        {t('selectMethodToConnect')}
      </Typography.Body6>
      <Spacer paddingBottom={theme.spacing.m} />
      {selectedChain.ledgerApps.length > 0 && (
        <ConnectChainMethodButton method="ledger" handlePress={handlePressLedger} />
      )}

      <Spacer paddingTop={theme.spacing.xl}>
        <ConnectChainMethodButton method="password" handlePress={handlePressPassword} />
      </Spacer>
    </DView>
  );
};

export default ConnectChainMethod;
