import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import Button from 'components/Button';
import DView from 'components/DView';
import Typography from 'components/Typography';
import useConnectToLedger from 'hooks/ledger/useConnectToLedger';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Image, View} from 'react-native';
import {ledgerConnectionError, ledgerDevice} from 'assets/images';
import Spacer from 'components/Spacer';
import {useTheme} from 'react-native-paper';
import ThemedLottieView from 'components/ThemedLottieView';
import useConnectInstructions from './useConnectInstructions';
import useStyles from './useStyles';

export type ConnectToLedgerParams = {
  bleLedger: BleLedger;

  ledgerApp: LedgerApp;
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

  const {navigate} = useNavigation<NavProps['navigation']>();

  const styles = useStyles();
  const {connecting, connected, connectionError, transport, retry, paired} =
    useConnectToLedger(bleLedger, ledgerApp);

  const isFocused = useIsFocused();

  const statusButton = connected ? t('next') : t('retry');

  const {instruction, instructionsIndex} = useConnectInstructions(
    paired && !connected && isFocused,
  );

  React.useEffect(() => {
    if (paired && connected) {
      // check for desmos profiles and then proceed
    }
  }, [paired, connected, transport]);

  const handlePressHowToDL = React.useCallback(() => {
    navigate(ROUTES.BOTTOM_MODAL, {
      title: t('modalTitle'),
      body: t('modalDescription'),
      primaryButtonLabel: t('modalButton'),
    });
  }, []);

  const content = React.useMemo(() => {
    if (!paired) {
      return (
        <>
          <Spacer paddingBottom={theme.spacing.l}>
            <ThemedLottieView
              source="connect-to-ledger"
              style={styles.lottieAnimation}
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

    if (connectionError) {
      return (
        <>
          <Image source={ledgerConnectionError} style={styles.errorImage} />

          <View
            style={[styles.centeredGroup, {marginBottom: theme.spacing.xl}]}>
            <Typography.H4 style={styles.headerText}>
              {t('sorryConnectionFailed')}
            </Typography.H4>
            <Typography.Body6>{connectionError}</Typography.Body6>
          </View>

          <Button
            mode="gradientFilled"
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
        <View style={styles.centeredGroup}>
          <Spacer paddingBottom={54}>
            <Image source={ledgerDevice} style={styles.ledgerImage} />
          </Spacer>
          <Typography.H4 style={{textAlign: 'center'}}>
            {instruction}
          </Typography.H4>

          {instructionsIndex % 2 !== 0 && (
            <Typography.H4
              onPress={handlePressHowToDL}
              style={[styles.howToDLText, {textAlign: 'center'}]}>
              {t('howToDL')}
            </Typography.H4>
          )}
        </View>
      );
    }
  }, [connected, paired, connectionError, transport, instructionsIndex]);

  return <DView style={styles.container}>{content}</DView>;
};

export default ConnectToLedger;
