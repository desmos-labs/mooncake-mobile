import {StackScreenProps} from '@react-navigation/stack';
import DView from 'components/DView';
import ThemedLottieView from 'components/ThemedLottieView';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {EncodeObject} from '@cosmjs/proto-signing';
import ROUTES from 'navigation/routes';
import useBroadcastMessages from 'hooks/useBroadcastMessages';
import {useNavigation, useRoute} from '@react-navigation/native';
import {computeTxFees, messagesGas} from 'lib/desmos/fees';
import LocalWallet from 'lib/LocalWallet';
import useStyles from './useStyles';

export type BroadcastTxParams = {
  messages: EncodeObject[];

  serializedWallet: string;

  granter?: string;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.BROADCAST_TX>;

const BroadcastTx: React.FC = () => {
  const {t} = useTranslation('accountCreation');
  const styles = useStyles();
  const {push} = useNavigation<NavProps['navigation']>();
  const {params} = useRoute<NavProps['route']>();
  const [error, setError] = React.useState('');
  const broadcastMessages = useBroadcastMessages();

  const broadcastTx = React.useCallback(async () => {
    const {messages, granter, serializedWallet} = params;

    const wallet = await LocalWallet.deserialize(serializedWallet);

    const gas = messagesGas(messages);
    // hardcoded denom for now
    const txFee = computeTxFees(gas, 'udaric').average;

    try {
      await broadcastMessages(wallet, messages, txFee, '', granter);

      // success

      push(ROUTES.RESULT_MODAL, {
        title: t('resultModal:congrats'),
        subtitle: t('resultModal:profileCreated'),
        primaryButtonLabel: t('resultModal:enterApp'),
        onPressPrimary: () => {},
      });
    } catch (err: any) {
      setError(err.message);
      console.log(error);
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
