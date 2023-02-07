import { EncodeObject } from '@desmoslabs/desmjs';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import React from 'react';

export interface BroadcastTxCallbacks {
  onSuccess?: () => void;
  onCancel?: () => void;
  onError?: () => void;
}

export interface BroadcastTxOptions extends BroadcastTxCallbacks {
  memo?: string;
}

/**
 * Hook that provides a function used to sign and broadcast a transaction
 * on chain.
 */
const useBroadcastTxOnChain = () => {
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  return React.useCallback((msgs: EncodeObject[], options?: BroadcastTxOptions) => {
    // TODO: Implement navigation to BROADCAST_TX screen.
  }, []);
};

export default useBroadcastTxOnChain;
