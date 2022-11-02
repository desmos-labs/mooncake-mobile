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
import {MsgCreatePostEncodeObject} from '@desmoslabs/desmjs';
import {mediaToAny} from '@desmoslabs/desmjs/build/aminomessages/posts';
import {UploadEvent} from 'services/axios/requests/UploadMedia';
import ToastConfig from 'config/ToastConfig';
import {useToast} from 'react-native-toast-notifications';
import {useRecoilCallback, useResetRecoilState} from 'recoil';
import sharedPostState from '@recoil/sharedPostState';
import useCheckAndUpdateGrants from 'hooks/authGrants/useCheckAndUpdateGrants';
import {GrantEnums} from 'lib/desmos/msgtypes';
import {uploadImageForPost} from 'services/axios/requests/CentralizedBroadcastTx/useCreatePost/utils';
import {encodeAndBroadcastTx} from 'services/axios/requests/CentralizedBroadcastTx';
import usePendingPosts from '@recoil/pendingTx/pendingPosts';

/**
 *
 * @typedef {CreatePostArgs} - Arguments for the createPost callback.
 * @property {number} conversationId - The conversationId of the post. For comments.
 * @property {number} referencedPostId - Other posts that this post will be a reference to.
 * @property {(event: UploadEvent) => void} onUploadProgress - An optional callback to handle image upload updates.
 */
interface CreatePostArgs {
  conversationId?: number;
  referencedPostId?: number;
  onUploadProgress?: (event: UploadEvent) => void;
}

/**
 * A Hook that exposes a callback that requests necessary grants and creates a post.
 */
const useCreatePost = () => {
  const {activeAddress} = useActiveAccount();

  const toast = useToast();

  const resetSharedPostState = useResetRecoilState(sharedPostState);
  const [loading, setLoading] = React.useState(false);

  const {checkAndUpdateGrants} = useCheckAndUpdateGrants();

  const {addNewPendingPost} = usePendingPosts();

  /**
   * Helper function that serves as a centralized point to create posts across the app.
   * Under this context, comments are considered posts as well.
   */
  const createPost = useRecoilCallback(
    ({snapshot}) =>
      async ({
        conversationId,
        referencedPostId,
        onUploadProgress,
      }: CreatePostArgs) => {
        if (!activeAddress) return;

        const {success} = await checkAndUpdateGrants({
          grantsToRequest: [GrantEnums.MsgCreatePost],
        });

        if (!success) {
          throw new Error('User did not grant MsgCreatePost Authorization');
        }

        setLoading(true);
        try {
          // get the postText and any attachments from recoil state
          const _sharedPostState = await snapshot.getPromise(sharedPostState);

          const {postAttachments, postText} = _sharedPostState;

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

          const msg: MsgCreatePostEncodeObject = {
            typeUrl: GrantEnums.MsgCreatePost,
            value: MsgCreatePost.fromPartial({
              subspaceId: Long.fromNumber(EnvConfig.APP_SUBSPACE_ID),
              sectionId: 0,
              externalId: '',
              text: postText,
              referencedPosts: _referencedPosts,
              conversationId: _conversationId,
              author: activeAddress,
              attachments: _attachments,
              replySettings: ReplySetting.REPLY_SETTING_EVERYONE,
            }),
          };

          const sendPostResponse = await encodeAndBroadcastTx({msgs: [msg]});
          if (sendPostResponse) {
            // only reset state when we're sure the post has been successfully broadcasted
            resetSharedPostState();
            // don't add comments to pending for now
            if (_referencedPosts.length === 0) {
              const _pendingPost: PendingPost = {
                postData: {
                  // id can be any number, since it is assigned by the server
                  id: Date.now(),
                  subspace_id: EnvConfig.APP_SUBSPACE_ID,
                  isPending: true,

                  text: postText,

                  attachments: attachmentUploadResult
                    ? [
                        {
                          id: 0,
                          content: {
                            ...attachmentUploadResult,
                          },
                        },
                      ]
                    : [],

                  author_address: activeAddress,
                },
                txHash: sendPostResponse.tx_hash,
                timestamp: Date.now(),
                msgType: GrantEnums.MsgCreatePost,

                msg,
              };
              addNewPendingPost(_pendingPost);
            }

            return sendPostResponse;
          }
        } catch (err: any) {
          toast.show(`Error creating post: ${err.toString()}`, {
            type: ToastConfig.ERROR_NO_RETRY,
          });

          return undefined;
        } finally {
          setLoading(false);
        }
      },
    [activeAddress],
  );

  return {createPost, loading};
};

export default useCreatePost;
