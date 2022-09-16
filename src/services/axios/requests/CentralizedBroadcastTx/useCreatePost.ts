import React from 'react';
import {MsgCreatePost} from '@desmoslabs/desmjs-types/desmos/posts/v2/msgs';
import Long from 'long';
import EnvConfig from 'config/EnvConfig';
import useActiveAccount from 'hooks/useActiveAccount';
import {ReplySetting} from '@desmoslabs/desmjs-types/desmos/posts/v2/models';
import {DesmosClient, MsgCreatePostEncodeObject} from '@desmoslabs/desmjs';
import CentralizedBroadcastTx from 'services/axios/requests/CentralizedBroadcastTx/index';

/**
 * Hook that creates a new post
 */
const useCreatePost = () => {
  const {activeAddress} = useActiveAccount();

  const [loading, setLoading] = React.useState(false);

  const createPost = React.useCallback(
    async ({postText}: {postText: string}) => {
      if (!activeAddress) return;

      try {
        setLoading(true);

        const client = await DesmosClient.connect(EnvConfig.DESMOS_RPC);

        const msg: MsgCreatePostEncodeObject = {
          typeUrl: '/desmos.posts.v2.MsgCreatePost',
          value: MsgCreatePost.fromPartial({
            subspaceId: Long.fromNumber(EnvConfig.APP_SUBSPACE_ID),
            sectionId: 0,
            externalId: '',
            text: postText,
            author: activeAddress,
            replySettings: ReplySetting.REPLY_SETTING_EVERYONE,
          }),
        };

        const aminoEncodedMsg = client.encodeToAmino([msg]);

        const msgResponse = await CentralizedBroadcastTx({
          messages: aminoEncodedMsg,
        });

        return msgResponse;
      } catch (err: any) {
        console.log('error', err?.response.data);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [activeAddress, CentralizedBroadcastTx],
  );

  return {createPost, loading};
};

export default useCreatePost;
