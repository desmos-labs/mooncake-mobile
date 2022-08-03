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
import useStyles from './useStyles';

export type BroadcastTxParams = {
  /**
   * The messages to be broadcast on chain.
   */
  messages: EncodeObject[];

  // /**
  //  * The serialized version of the wallet that will sign the transaction.
  //  * This should only be passed as a navigation param (i.e do not refactor
  //  * to use a wallet from recoil) as the wallet should only be exposed after
  //  * proper user authentication.
  //  */
  // serializedWallet: string;

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
  failureAction?: () => void;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.BROADCAST_TX>;

const BroadcastTx: React.FC = () => {
  const {t} = useTranslation('accountCreation');
  const styles = useStyles();
  const {params} = useRoute<NavProps['route']>();
  // const [error, setError] = React.useState('');
  const broadcastMessages = useBroadcastMessages();

  const broadcastTx = React.useCallback(async () => {
    const {messages, granter, offlineSigner} = params;

    // const wallet = await LocalWallet.deserialize(serializedWallet);

    const gas = messagesGas(messages);
    // hardcoded denom for now
    const txFee = computeTxFees(gas, 'udaric').average;

    try {
      await broadcastMessages(offlineSigner, messages, txFee, '', granter);

      // success

      params.successAction && params.successAction();
    } catch (err: any) {
      // setError(err.message);
      console.log(err.message);

      params.failureAction && params.failureAction();
    }
  }, [params]);

  React.useEffect(() => {
    broadcastTx();
  }, []);

  return (
    <DView>
      <View style={styles.container}>
        <ThemedLottieView autoSize autoPlay loop source="broadcast-tx" />
        <Typography.H4>{t('transaction broadcasting')}</Typography.H4>
        <Typography.Body6>{t('please wait')}</Typography.Body6>
      </View>
    </DView>
  );
};

export default BroadcastTx;
