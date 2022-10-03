import {toBase64} from '@cosmjs/encoding';
import {LedgerSigner} from '@cosmjs/ledger-amino';
import {DesmosClient} from '@desmoslabs/desmjs';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import createLedgerAccountState from '@recoil/createLedgerAccountState';
import {pairDevicesAnim, unlockLedgerAnimation} from 'assets/animations';
import {iconCrossBlack, ledgerConnectionError} from 'assets/images';
import Button from 'components/Button';
import DView from 'components/DView';
import ImageButton from 'components/ImageButton';
import Spacer from 'components/Spacer';
import ThemedLottieView from 'components/ThemedLottieView';
import Typography from 'components/Typography';
import EnvConfig from 'config/EnvConfig';
import {DesmosLedgerApp} from 'config/LedgerApps';
import useConnectToLedger from 'hooks/ledger/useConnectToLedger';
import {toCosmjsHdPath} from 'lib/FormatUtils';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Image, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useSetRecoilState} from 'recoil';
import {ChainAccount, ChainAccountType} from 'types/chains';
import {HdPath} from 'types/hdpath';
import useConnectInstructions from './useConnectInstructions';
import useStyles from './useStyles';

export type ConnectToLedgerParams = {
  bleLedger: BleLedger;

  ledgerApp: LedgerApp;

  autoClose?: boolean;

  onConnectionEstablished?: (transport: BluetoothTransport) => void;

  onCancel?: () => void;
};

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.CONNECT_TO_LEDGER
>;

const ConnectToLedger = () => {
  const {
    params: {bleLedger, ledgerApp},
  } = useRoute<NavProps['route']>();
  const {t} = useTranslation('connectToLedger');
  const theme = useTheme();

  const {navigate, goBack, addListener} =
    useNavigation<NavProps['navigation']>();
  const {
    params: {autoClose, onCancel, onConnectionEstablished},
  } = useRoute<NavProps['route']>();

  const setCreateLedgerAccount = useSetRecoilState(createLedgerAccountState);

  const styles = useStyles();
  const {connecting, connected, connectionError, transport, retry, paired} =
    useConnectToLedger(bleLedger, ledgerApp);

  const isFocused = useIsFocused();

  const statusButton = connected ? t('next') : t('retry');

  const {instruction, instructionsIndex} = useConnectInstructions(
    paired && !connected && isFocused,
  );

  React.useEffect(() => {
    if (autoClose && transport) {
      onConnectionEstablished!(transport);
      goBack();
    }
  }, [transport, autoClose]);

  React.useEffect(() => {
    if (autoClose) {
      addListener('beforeRemove', e => {
        if (
          e.data.action.type === 'GO_BACK' &&
          !connected &&
          onCancel !== undefined
        ) {
          onCancel();
        }
      });
    }
  }, [autoClose]);

  React.useEffect(() => {
    const generateAccounts = async () => {
      // originally planned to iterate over address index to generate some accounts, hence the Array.map
      const hdPaths: HdPath[] = new Array(1).fill(0).map((_hdpath, idx) => ({
        coinType: 852,
        account: 0,
        change: 0,
        addressIndex: idx,
      }));

      const ledgerSigner = new LedgerSigner(transport!, {
        minLedgerAppVersion: DesmosLedgerApp.minVersion,
        ledgerAppName: DesmosLedgerApp.name,
        prefix: 'desmos',
        hdPaths: hdPaths.map(toCosmjsHdPath),
      });

      const accounts = await ledgerSigner.getAccounts();

      const client = await DesmosClient.connect(EnvConfig.DESMOS_RPC);

      const chainAccounts: ChainAccount[] = accounts.map((acc, idx) => ({
        address: acc.address,
        signAlgorithm: acc.algo,
        hdPath: hdPaths[idx],
        type: ChainAccountType.Ledger,
        pubKey: toBase64(acc.pubkey),
      }));

      const accountsToSearch = accounts.map(async (acc, idx) => {
        return {
          desmosProfile: await client.getAccount(acc.address),
          chainAccount: chainAccounts[idx],
        };
      });

      const results = await Promise.allSettled(accountsToSearch);

      const accountsWithWalletData = results
        .filter(x => x.status === 'fulfilled')
        .map((y: any) => ({
          wallet: y.value.wallet,
          chainAccount: y.value.chainAccount,
        }));

      if (accountsWithWalletData.length === 0) {
        // Register the first account retrieved from ledger
        setCreateLedgerAccount({account: chainAccounts[0]});
        console.log(chainAccounts[0]);
        navigate(ROUTES.NO_DTAG_FOUND);
      } else {
        navigate(ROUTES.SELECT_DTAG, {
          accountsWithWalletData,
        });
      }
    };

    // do not run generate account logic if transport object does not exist
    // or the autoClose override is passed as param.
    if (!transport || autoClose) return;
    generateAccounts();
  }, [transport]);

  React.useEffect(() => {
    if (paired && connected) {
      // check for desmos profiles and then proceed
    }
  }, [paired, connected, transport]);

  const handlePressHowToDL = React.useCallback(() => {
    navigate(ROUTES.BOTTOM_MODAL, {
      title: t('modalTitle'),
      body: t('modalDescription'),
      primaryButtonLabel: t('modalButton')!,
    });
  }, []);

  const content = React.useMemo(() => {
    if (!paired) {
      return (
        <>
          <ImageButton
            onPress={goBack}
            image={iconCrossBlack}
            style={{height: 24, width: 24, right: 0, marginLeft: 'auto'}}
          />
          <Spacer paddingBottom={theme.spacing.l} paddingTop={60}>
            <ThemedLottieView
              source={pairDevicesAnim}
              style={styles.lottieAnimation}
              autoSize
              autoPlay
              loop
            />
          </Spacer>

          <View style={styles.centeredGroup}>
            <Typography.H4 style={styles.headerText}>
              {t('pairYourDevices')}
            </Typography.H4>
            <Typography.Body6>
              {t('followInstructionOnLedger')}
            </Typography.Body6>
          </View>
        </>
      );
    }

    if (connectionError && !connectionError.includes('Please close BOLOS')) {
      return (
        <>
          <Image source={ledgerConnectionError} style={styles.errorImage} />
          <Spacer paddingBottom={theme.spacing.l} paddingTop={100} />
          <View
            style={[styles.centeredGroup, {marginBottom: theme.spacing.xl}]}>
            <Typography.H4 style={styles.headerText}>
              {t('sorryConnectionFailed')}
            </Typography.H4>
            <Typography.Body6>{connectionError}</Typography.Body6>
          </View>

          <Button
            color={theme.colors.surfaceBlack}
            mode="contained"
            onPress={retry}
            disabled={connecting}
            loading={connecting}>
            {connecting ? t('connecting') : statusButton}
          </Button>
        </>
      );
    }
    if (paired && !connected) {
      return (
        <>
          <ImageButton
            onPress={goBack}
            image={iconCrossBlack}
            style={{height: 24, width: 24, right: 0, marginLeft: 'auto'}}
          />
          <Spacer paddingBottom={theme.spacing.l} paddingTop={100} />
          <View style={styles.centeredGroup}>
            <Spacer paddingBottom={54}>
              <ThemedLottieView
                source={unlockLedgerAnimation}
                style={styles.lottieAnimation}
                autoSize
                autoPlay
                loop
              />
            </Spacer>
            <Typography.H4 style={{textAlign: 'center'}}>
              {instruction}
            </Typography.H4>

            {instructionsIndex % 2 !== 0 && (
              <Button
                mode="text"
                style={styles.howToDLText}
                onPress={handlePressHowToDL}>
                <Typography.Button1
                  style={{
                    textAlign: 'center',
                    color: theme.colors.butterOrange01,
                  }}>
                  {t('howToDL')}
                </Typography.Button1>
              </Button>
            )}
          </View>
        </>
      );
    }

    return (
      <View style={styles.centeredGroup}>
        <Spacer paddingBottom={theme.spacing.l}>
          <ThemedLottieView
            source={pairDevicesAnim}
            style={styles.lottieAnimation}
            autoPlay
            loop
          />
        </Spacer>
      </View>
    );
  }, [connected, paired, connectionError, transport, instructionsIndex]);

  return <DView style={styles.container}>{content}</DView>;
};

export default ConnectToLedger;
