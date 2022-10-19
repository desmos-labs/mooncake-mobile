import {OfflineSigner} from '@cosmjs/proto-signing';
import {useCallback} from 'react';
import {MsgUnlinkChainAccountEncodeObject} from '@desmoslabs/desmjs';
import {ChainLink} from 'types/link';
import useBroadcastMessages from './broadcastTx/useBroadcastMessages';

export default function useDisconnectChainLink() {
  const broadcastMessages = useBroadcastMessages();

  return useCallback(
    async (wallet: OfflineSigner, chainLink: ChainLink) => {
      const accounts = await wallet.getAccounts();
      const msgs = [
        {
          typeUrl: '/desmos.profiles.v3.MsgUnlinkChainAccount',
          value: {
            chainName: chainLink.chainName,
            owner: accounts[0].address,
            target: chainLink.externalAddress,
          },
        } as MsgUnlinkChainAccountEncodeObject,
      ];

      await broadcastMessages(wallet, msgs);
    },
    [broadcastMessages],
  );
}
