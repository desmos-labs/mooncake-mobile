import {DesmosClient, MsgAddReactionEncodeObject} from '@desmoslabs/desmjs';
import {RegisteredReactionValue} from '@desmoslabs/desmjs-types/desmos/reactions/v1/models';
import {MsgAddReaction} from '@desmoslabs/desmjs-types/desmos/reactions/v1/msgs';
import {convertRegisteredReactionValueToAny} from '@desmoslabs/desmjs/build/aminomessages/reactions';
import EnvConfig from 'config/EnvConfig';
import useActiveAccount from 'hooks/useActiveAccount';
import React from 'react';
import CentralizedBroadcastTx from 'services/axios/requests/CentralizedBroadcastTx';

/**
 * Hook that creates a new post
 */
const useAddReaction = () => {
  const {activeAddress} = useActiveAccount();
  const [loadingReaction, setLoadingReaction] = React.useState(false);

  const addReaction = React.useCallback(
    async ({postId, user}: Partial<MsgAddReaction>) => {
      if (!activeAddress) return;

      const reaction = convertRegisteredReactionValueToAny(
        RegisteredReactionValue.fromPartial({
          registeredReactionId: 9, // TODO use registered reactions
        }),
      );

      try {
        setLoadingReaction(true);
        const client = await DesmosClient.connect(EnvConfig.DESMOS_RPC);

        const msg: MsgAddReactionEncodeObject = {
          typeUrl: '/desmos.reactions.v1.MsgAddReaction',
          value: MsgAddReaction.fromPartial({
            subspaceId: EnvConfig.APP_SUBSPACE_ID,
            postId,
            value: reaction,
            user,
          }),
        };

        const aminoEncodedMsg = client.encodeToAmino([msg]);

        return await CentralizedBroadcastTx({
          messages: aminoEncodedMsg,
        });
      } catch (err: any) {
        throw new Error(err.toString());
      } finally {
        setLoadingReaction(false);
      }
    },
    [activeAddress],
  );

  return {addReaction, loadingReaction};
};

export default useAddReaction;
