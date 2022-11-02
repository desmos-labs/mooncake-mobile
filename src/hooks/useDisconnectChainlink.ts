import {OfflineSigner} from '@cosmjs/proto-signing';
import {useCallback} from 'react';
import {ChainLink} from 'types/link';
import {MsgUnlinkChainAccount} from '@desmoslabs/desmjs-types/desmos/profiles/v3/msgs_chain_links';
import useBroadcastMessages from './broadcastTx/useBroadcastMessages';

export default function useDisconnectChainLink() {
  const broadcastMessages = useBroadcastMessages();

  return useCallback(
    async (wallet: OfflineSigner, chainLink: ChainLink) => {
      const accounts = await wallet.getAccounts();
      const msgs = [
        {
          typeUrl: '/desmos.profiles.v3.MsgUnlinkChainAccount',
          value: MsgUnlinkChainAccount.fromPartial({
            chainName: chainLink.chainName,
            owner: accounts[0].address,
            target: chainLink.externalAddress,
          }),
        },
      ];

      await broadcastMessages(wallet, msgs);
    },
    [broadcastMessages],
  );
}
