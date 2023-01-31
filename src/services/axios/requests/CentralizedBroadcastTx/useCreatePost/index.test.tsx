import {act, renderHook} from '@testing-library/react-native';
import useCreatePost from 'services/axios/requests/CentralizedBroadcastTx/useCreatePost/index';
import {RecoilRoot} from 'recoil';
import {
  postAttachmentsState,
  postTextState,
} from '@recoil/screens/createPostState';
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
import axiosInstance from 'services/axios';
import {encodeAndBroadcastTx} from 'services/axios/requests/CentralizedBroadcastTx';

const mockActiveAddress = '123';
const mockPostText = 'some text';
const mockPostAttachment = {
  uri: 'mockUri',
  type: 'mockType',
  fileName: 'mockFileName',
};
const mockUrl = 'mockUrl';

const mockCheckAndUpdateGrants = {success: true};

const mockConversationId = 1;
const mockReferencedPostId = 1;

const mockEncodeToAmino = jest.fn(() => 'mockAminoEncodedMessage');

jest.mock('@desmoslabs/desmjs', () => ({
  DesmosClient: {
    connect: () => ({
      encodeToAmino: mockEncodeToAmino,
      disconnect: () => jest.fn(),
    }),
  },
}));

jest.mock('hooks/authGrants/useCheckAndUpdateGrants', () =>
  jest.fn(() => ({
    checkAndUpdateGrants: () => mockCheckAndUpdateGrants,
  })),
);

jest.mock('hooks/useActiveAccount', () =>
  jest.fn(() => ({activeAddress: mockActiveAddress})),
);

jest.mock('services/axios');

jest.mock('services/axios/requests/UploadMedia');

jest.mock('@desmoslabs/desmjs', () => ({
  DesmosClient: {
    connect: () => ({
      encodeToAmino: jest.fn(),
      disconnect: () => jest.fn(),
    }),
  },
}));

jest.mock('services/axios/requests/CentralizedBroadcastTx');

describe('hooks: useCreatePost', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('creates a text post', async () => {
    const mockTxHash = 'mockTxHash';
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      data: {tx_hash: mockTxHash},
    });

    (encodeAndBroadcastTx as jest.Mock).mockReturnValue(true);

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
        externalId: expect.anything(),
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

    expect(encodeAndBroadcastTx).toHaveBeenCalledWith({
      msgs: [mockExpectedMsg],
    });
  });

  it('creates an image post', async () => {
    const mockTxHash = 'mockTxHash';
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      data: {tx_hash: mockTxHash},
    });

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
        externalId: expect.anything(),
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

    expect(encodeAndBroadcastTx).toHaveBeenCalledWith({
      msgs: [mockExpectedMsg],
    });
  });
});
