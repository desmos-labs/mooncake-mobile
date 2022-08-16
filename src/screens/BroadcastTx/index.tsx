import {StackScreenProps} from '@react-navigation/stack';
import DView from 'components/DView';
import ThemedLottieView from 'components/ThemedLottieView';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {EncodeObject, OfflineSigner} from '@cosmjs/proto-signing';
import ROUTES from 'navigation/routes';
import useBroadcastMessages from 'hooks/broadcastTx/useBroadcastMessages';
import {useRoute} from '@react-navigation/native';
import {computeTxFees, messagesGas} from 'lib/desmos/fees';
import EnvConfig from 'config/EnvConfig';
import {broadcastAnim} from 'assets/animations';
import useStyles from './useStyles';

export type BroadcastTxParams = {
  /**
   * The messages to be broadcast on chain.
   */
  messages: EncodeObject[];

  /**
   * Signer used to sign the transaction
   */
  offlineSigner: OfflineSigner;

  /**
   * Optional fee granter for the transaction.
   */
  granter?: string;

  /**
   * Optional function to run if the transaction is successful
   */
  successAction?: () => void;

  /**
   * Optional function to run if the transaction has failed
   */
  failureAction?: (errorMessage?: string) => void;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.BROADCAST_TX>;

const BroadcastTx: React.FC = () => {
  const {t} = useTranslation('accountCreation');
  const styles = useStyles();
  const {params} = useRoute<NavProps['route']>();
  const broadcastMessages = useBroadcastMessages();

  const broadcastTx = React.useCallback(async () => {
    const {messages, granter, offlineSigner} = params;

    const gas = messagesGas(messages);
    // hardcoded denom for now
    const txFee = computeTxFees(gas, EnvConfig.BASE_DENOM).average;

    try {
      await broadcastMessages(offlineSigner, messages, txFee, '', granter);

      params.successAction && params.successAction();
    } catch (err: any) {
      console.log(err.message);

      params.failureAction && params.failureAction(err.message);
    }
  }, [params]);

  React.useEffect(() => {
    broadcastTx();
  }, []);

  return (
    <DView>
      <View style={styles.container}>
        <ThemedLottieView autoSize autoPlay loop source={broadcastAnim} />
        <Typography.H4>{t('transaction broadcasting')}</Typography.H4>
        <Typography.Body6>{t('please wait')}</Typography.Body6>
      </View>
    </DView>
  );
};

export default BroadcastTx;
