import {EncodeObject, OfflineSigner} from '@cosmjs/proto-signing';
import {GasPrice, assertIsDeliverTxSuccess} from '@cosmjs/stargate';
import {DesmosClient, OfflineSignerAdapter} from '@desmoslabs/desmjs';
import appSettingsState from '@recoil/settings';
import EnvConfig from 'config/EnvConfig';
import {TxRaw} from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import {useCallback} from 'react';
import {useRecoilState} from 'recoil';

/**
 * Hook that returns a function that create a transaction with the provided
 * messages and sign that with the provided signer.
 * If the transactions fails will be raised an Error.
 */
export default function useBroadcastMessages() {
  const [settings] = useRecoilState(appSettingsState);
  return useCallback(
    async (
      signer: OfflineSigner,
      messages: EncodeObject[],
      memo?: string,
      granter?: string,
    ) => {
      const _signer = new OfflineSignerAdapter(signer);
      const client = await DesmosClient.connectWithSigner(
        EnvConfig.DESMOS_RPC,
        _signer,
        {
          gasPrice: GasPrice.fromString(
            `0.1${settings.currentChain.stakeCurrency.coinMinimalDenom}`,
          ),
        },
      );

      const signerAddress = await _signer.getAccounts();

      const signed = await client.signTx(
        signerAddress[0].address,
        messages,
        'auto',
        memo ?? '',
        undefined,
        granter,
      );

      const broadcastResult = await client.broadcastTx(
        TxRaw.encode(signed.txRaw).finish(),
      );

      assertIsDeliverTxSuccess(broadcastResult);

      return true;
    },
    [],
  );
}
