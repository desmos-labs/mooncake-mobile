import {StdFee} from '@cosmjs/amino';
import {EncodeObject, OfflineSigner} from '@cosmjs/proto-signing';
import {DesmosClient, OfflineSignerAdapter} from '@desmoslabs/desmjs';
import appSettingsState from '@recoil/settings';
import EnvConfig from 'config/EnvConfig';
import {useCallback} from 'react';
import {useRecoilState} from 'recoil';

/**
 * Hook that returns a promise to sign a custom (fake tx)
 */
export default function useSignCustomTx() {
  const [settings] = useRecoilState(appSettingsState);
  return useCallback(
    async (
      signer: OfflineSigner,
      messages: EncodeObject[],
      fee?: StdFee,
      memo?: string,
    ) => {
      const _signer = new OfflineSignerAdapter(signer);
      const client = await DesmosClient.connectWithSigner(
        EnvConfig.DESMOS_RPC,
        _signer,
        {
          gasPrice: settings.currentChain.gasPrice,
        },
      );

      const signerAddress = await _signer.getAccounts();

      return client.signTx(
        signerAddress[0].address,
        messages,
        fee ?? 'auto',
        memo ?? '',
        undefined,
      );
    },
    [],
  );
}
