import React from 'react';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {useTranslation} from 'react-i18next';
import ConnectChainMethodButton from 'screens/ConnectChainMethod/components/ConnectChainMethodButton';
import Spacer from 'components/Spacer';
import {useTheme} from 'react-native-paper';
import {useSetRecoilState} from 'recoil';
import {
  connectMethodState,
  mnemonicState,
  signerState,
} from '@recoil/connectChainState';
import useUnlockWallet from 'hooks/useUnlockWallet';
import useActiveAccount from 'hooks/useActiveAccount';
import {ActivityIndicator} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useNavigation} from '@react-navigation/native';
import isLedgerSigner from 'screens/AddProfile/isLedgerSigner';
import useStyles from './useStyles';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.CONNECT_CHAIN_METHOD
>;

const ConnectChainMethod = () => {
  const {t} = useTranslation('connectChain');
  const {navigate} = useNavigation<NavProps['navigation']>();
  const styles = useStyles();
  const theme = useTheme();

  const {chainAccount} = useActiveAccount();
  const unlockWallet = useUnlockWallet();

  const setConnectChainMethod = useSetRecoilState(connectMethodState);

  const setMnemonic = useSetRecoilState(mnemonicState);
  const setSigner = useSetRecoilState(signerState);

  const handlePressLedger = React.useCallback(() => {
    setConnectChainMethod('LEDGER');
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
        const {mnemonic, wallet} = unlockResult;

        if (mnemonic) {
          setMnemonic(mnemonic!);
          navigate(ROUTES.CONNECT_ADDRESS_GENERAL);
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
        <ActivityIndicator />
      </DView>
    );
  }

  return (
    <DView style={styles.container} topBar={<TopBar />}>
      <Typography.H5 style={styles.textStyle}>
        {t('connectAddress')}
      </Typography.H5>
      <Typography.Body6 style={[styles.textStyle, styles.descriptionText]}>
        {t('selectMethodToConnect')}
      </Typography.Body6>

      <ConnectChainMethodButton
        method="ledger"
        handlePress={handlePressLedger}
      />
      <Spacer paddingTop={theme.spacing.xl}>
        <ConnectChainMethodButton
          method="password"
          handlePress={handlePressPassword}
        />
      </Spacer>
    </DView>
  );
};

export default ConnectChainMethod;
