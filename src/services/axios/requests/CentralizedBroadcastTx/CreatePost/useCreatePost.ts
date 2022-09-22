import React from 'react';
import {MsgCreatePost} from '@desmoslabs/desmjs-types/desmos/posts/v2/msgs';
import Long from 'long';
import EnvConfig from 'config/EnvConfig';
import useActiveAccount from 'hooks/useActiveAccount';
import {
  Media,
  PostReference,
  PostReferenceType,
  ReplySetting,
} from '@desmoslabs/desmjs-types/desmos/posts/v2/models';
import {DesmosClient, MsgCreatePostEncodeObject} from '@desmoslabs/desmjs';
import CentralizedBroadcastTx from 'services/axios/requests/CentralizedBroadcastTx';
import {mediaToAny} from '@desmoslabs/desmjs/build/aminomessages/posts';
import UploadMedia, {
  Params,
  UploadEvent,
} from 'services/axios/requests/UploadMedia';
import ToastConfig from 'config/ToastConfig';
import {useToast} from 'react-native-toast-notifications';
import {useRecoilCallback, useResetRecoilState} from 'recoil';
import sharedPostState from '@recoil/sharedPostState';

/**
 * Hook that creates a new post
 */
const useCreatePost = () => {
  const {activeAddress} = useActiveAccount();

  const toast = useToast();

  const resetSharedPostState = useResetRecoilState(sharedPostState);
  const [loading, setLoading] = React.useState(false);

  const uploadImageForPost = React.useCallback(
    async ({
      mediaFile,
      onUploadProgress,
    }: Params): Promise<{uri: string; mimeType: string} | undefined> => {
      try {
        const uploadResponse = await UploadMedia({
          mediaFile,
          onUploadProgress,
        });

        const {url} = uploadResponse!;

        const {type} = mediaFile;

        return {uri: url, mimeType: type || ''};
      } catch (err: any) {
        if (err.toString().includes('413')) {
          throw new Error('Image too large');
          // toast.show(t('error:imageTooLarge'), {
          //   type: ToastConfig.ERROR_NO_RETRY,
          // });
        }
        throw new Error(err.toString());
      }
    },
    [],
  );

  const sendPost = React.useCallback(
    async ({
      text,
      conversationId,
      referencedPosts,
      attachments,
    }: Partial<MsgCreatePost>) => {
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
            text,
            referencedPosts,
            conversationId,
            author: activeAddress,
            attachments,
            replySettings: ReplySetting.REPLY_SETTING_EVERYONE,
          }),
        };

        const aminoEncodedMsg = client.encodeToAmino([msg]);

        const msgResponse = await CentralizedBroadcastTx({
          messages: aminoEncodedMsg,
        });

        return msgResponse;
      } catch (err: any) {
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [activeAddress],
  );

  const createPost = useRecoilCallback(
    ({snapshot}) =>
      async ({
        conversationId,
        referencedPostId,
        onUploadProgress,
      }: {
        conversationId?: number;
        referencedPostId?: number;
        onUploadProgress?: (event: UploadEvent) => void;
      }) => {
        setLoading(true);
        try {
          const _sharedPostState = await snapshot.getPromise(sharedPostState);

          const {postAttachments, postText} = _sharedPostState;

          console.log('shared state', _sharedPostState);

          // note: only Media attachments
          // only support 1 image attachment for now
          const attachmentUploadResult = postAttachments
            ? await uploadImageForPost({
                mediaFile: postAttachments,
                onUploadProgress,
              })
            : undefined;

          const _attachments = attachmentUploadResult
            ? [attachmentUploadResult].map(x =>
                mediaToAny(Media.fromPartial(x)),
              )
            : [];

          const _conversationId = Long.fromNumber(conversationId || 0);

          const _referencedPosts = referencedPostId
            ? [
                PostReference.fromPartial({
                  type: PostReferenceType.POST_REFERENCE_TYPE_REPLY,
                  postId: Long.fromNumber(referencedPostId),
                }),
              ]
            : [];

          const sendPostResponse = await sendPost({
            text: postText,
            conversationId: _conversationId,
            referencedPosts: _referencedPosts,
            attachments: _attachments,
          });

          if (sendPostResponse) {
            resetSharedPostState();
            return sendPostResponse;
          }
          throw new Error('Error creating post: no response from server');
        } catch (err: any) {
          toast.show(`Error creating post: ${err.toString()}`, {
            type: ToastConfig.ERROR_NO_RETRY,
          });

          return undefined;
        } finally {
          setLoading(false);
        }
      },
    [sendPost],
  );

  return {createPost, loading};
};

export default useCreatePost;
