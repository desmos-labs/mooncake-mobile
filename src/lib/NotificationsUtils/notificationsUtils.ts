import notifee from '@notifee/react-native';
import ToastConfig from 'config/ToastConfig';
import {encodeAndBroadcastTx} from 'services/axios/requests/CentralizedBroadcastTx';

export const createLocalNotification = async (remoteMessage: any) => {
  if (
    remoteMessage.data?.type !== 'transaction_success' ||
    remoteMessage.data?.type !== 'transaction_fail'
  ) {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      sound: 'default',
      vibration: true,
      lights: true,
    });

    await notifee.displayNotification({
      title: remoteMessage.data?.notification_title,
      body: remoteMessage.data?.notification_body,
      android: {
        channelId,
        smallIcon: 'ic_small_icon',
        color: '#FEB027',
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        interruptionLevel: 'active',
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
          banner: true,
          list: true,
        },
        sound: 'default',
      },
    });
  }
};

export const createTransactionSnackbar = async (
  remoteMessage: any,
  toast: any,
  txHash: string,
  findPendingTxByHash: (txHash: string) => PendingTx | undefined,
) => {
  if (remoteMessage.data?.type === 'transaction_success') {
    toast.show('Transaction success!', {
      type: ToastConfig.SUCCESS,
    });
  } else if (remoteMessage.data?.type === 'transaction_fail') {
    toast.show('Transaction failed!', {
      type: ToastConfig.ERROR,
      // @ts-ignore
      onPressRetry: () => {
        // find the matching txHash and rebroadcast its message
        const pendingTx = findPendingTxByHash(txHash);
        if (pendingTx) {
          const {msg} = pendingTx;
          encodeAndBroadcastTx({msgs: [msg]});
        }
      },
    });
  }
};
