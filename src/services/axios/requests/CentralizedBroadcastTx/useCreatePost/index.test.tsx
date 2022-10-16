import {act, renderHook} from '@testing-library/react-native';
import useCreatePost from 'services/axios/requests/CentralizedBroadcastTx/useCreatePost/index';
import {RecoilRoot} from 'recoil';
import {postAttachmentsState, postTextState} from '@recoil/sharedPostState';
import React from 'react';
import {GrantEnums} from 'lib/desmos/msgtypes';
import {MsgCreatePost} from '@desmoslabs/desmjs-types/desmos/posts/v2/msgs';
import Long from 'long';
import EnvConfig from 'config/EnvConfig';
import {
  Media,
  PostReference,
  PostReferenceType,
  ReplySetting,
} from '@desmoslabs/desmjs-types/desmos/posts/v2/models';
import UploadMedia from 'services/axios/requests/UploadMedia';
import {mediaToAny} from '@desmoslabs/desmjs/build/aminomessages/posts';

const mockActiveAddress = '123';
const mockPostText = 'some text';
const mockPostAttachment = {
  uri: 'mockUri',
  type: 'mockType',
  fileName: 'mockFileName',
};
const mockUrl = 'mockUrl';

const mockCheckAndUpdateGrants = {success: true};
const mockEncodeAndBroadcastTx = jest.fn(() => true);

const mockConversationId = 1;
const mockReferencedPostId = 1;

jest.mock('services/axios/requests/CentralizedBroadcastTx', () => ({
  useCentralizedBroadcastTx: () => ({
    encodeAndBroadcastTx: mockEncodeAndBroadcastTx,
  }),
}));

jest.mock('hooks/authGrants/useCheckAndUpdateGrants', () =>
  jest.fn(() => ({
    checkAndUpdateGrants: () => mockCheckAndUpdateGrants,
  })),
);

jest.mock('hooks/useActiveAccount', () =>
  jest.fn(() => ({activeAddress: mockActiveAddress})),
);

jest.mock('react-native-toast-notifications');

jest.mock('services/axios/requests/UploadMedia');

describe('hooks: useCreatePost', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('creates a text post', async () => {
    const initializeState = ({set}: any) => {
      set(postTextState, mockPostText);
    };

    const {result} = renderHook(() => useCreatePost(), {
      wrapper: props => (
        <RecoilRoot initializeState={initializeState}>
          {props.children}
        </RecoilRoot>
      ),
    });

    await act(async () => {
      await result.current.createPost({
        conversationId: mockConversationId,
        referencedPostId: mockReferencedPostId,
      });
    });

    const mockExpectedMsg = {
      typeUrl: GrantEnums.MsgCreatePost,
      value: MsgCreatePost.fromPartial({
        subspaceId: Long.fromNumber(EnvConfig.APP_SUBSPACE_ID),
        sectionId: 0,
        externalId: '',
        text: mockPostText,
        referencedPosts: [
          PostReference.fromPartial({
            type: PostReferenceType.POST_REFERENCE_TYPE_REPLY,
            postId: Long.fromNumber(mockReferencedPostId),
          }),
        ],
        conversationId: Long.fromNumber(mockConversationId),
        author: mockActiveAddress,
        attachments: undefined,
        replySettings: ReplySetting.REPLY_SETTING_EVERYONE,
      }),
    };

    expect(mockEncodeAndBroadcastTx).toHaveBeenCalledWith({
      msgs: [mockExpectedMsg],
    });
  });

  it('creates an image post', async () => {
    const initializeState = ({set}: any) => {
      set(postTextState, mockPostText);

      set(postAttachmentsState, mockPostAttachment);
    };

    (UploadMedia as jest.Mock).mockResolvedValueOnce({url: mockUrl});

    const {result} = renderHook(() => useCreatePost(), {
      wrapper: props => (
        <RecoilRoot initializeState={initializeState}>
          {props.children}
        </RecoilRoot>
      ),
    });

    await act(async () => {
      await result.current.createPost({
        conversationId: mockConversationId,
        referencedPostId: mockReferencedPostId,
      });
    });

    const mockExpectedMsg = {
      typeUrl: GrantEnums.MsgCreatePost,
      value: MsgCreatePost.fromPartial({
        subspaceId: Long.fromNumber(EnvConfig.APP_SUBSPACE_ID),
        sectionId: 0,
        externalId: '',
        text: mockPostText,
        referencedPosts: [
          PostReference.fromPartial({
            type: PostReferenceType.POST_REFERENCE_TYPE_REPLY,
            postId: Long.fromNumber(mockReferencedPostId),
          }),
        ],
        conversationId: Long.fromNumber(mockConversationId),
        author: mockActiveAddress,
        attachments: [
          mediaToAny(
            Media.fromPartial({
              uri: mockUrl,
              mimeType: mockPostAttachment.type,
            }),
          ),
        ],
        replySettings: ReplySetting.REPLY_SETTING_EVERYONE,
      }),
    };

    expect(mockEncodeAndBroadcastTx).toHaveBeenCalledWith({
      msgs: [mockExpectedMsg],
    });
  });
});
