import { StdFee } from '@cosmjs/amino';
import { EncodeObject, OfflineSigner } from '@cosmjs/proto-signing';
import { GasPrice } from '@cosmjs/stargate';
import { DesmosClient, OfflineSignerAdapter } from '@desmoslabs/desmjs';
import EnvConfig from 'config/EnvConfig';
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';

/**
 * Hook that returns a promise to sign a custom (fake tx)
 */
export default function useSignCustomTx() {
  const [settings] = useRecoilState(appSettingsState);
  return useCallback(
    async (signer: OfflineSigner, messages: EncodeObject[], fee?: StdFee, memo?: string) => {
      const _signer = new OfflineSignerAdapter(signer);
      const client = await DesmosClient.connectWithSigner(EnvConfig.DESMOS_RPC, _signer, {
        gasPrice: GasPrice.fromString(`0.1${settings.currentChain.stakeCurrency.coinMinimalDenom}`),
      });

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
