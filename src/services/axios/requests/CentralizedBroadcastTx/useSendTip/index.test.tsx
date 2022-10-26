import React from 'react';
import appSettingsState from '@recoil/settings';
import useCheckAndUpdateGrants from 'hooks/authGrants/useCheckAndUpdateGrants';
import {act, renderHook} from '@testing-library/react-native';
import useSendTip from 'services/axios/requests/CentralizedBroadcastTx/useSendTip/index';
import {RecoilRoot} from 'recoil';
import {encodeAndBroadcastTx} from 'services/axios/requests/CentralizedBroadcastTx';

jest.mock('hooks/authGrants/useCheckAndUpdateGrants', () => jest.fn());

jest.mock('./utils', () => ({
  buildPostTipMsg: () => 'postTipMsg',
  buildUserTipMsg: () => 'userTipMsg',
  numberToPlainCoin: () => ({denom: 'denom', amount: 1}),
}));

jest.mock('services/axios/requests/CentralizedBroadcastTx');

describe('hook: useSendTip', () => {
  it('sends post tip', async () => {
    const mockCheckAndUpdateGrants = jest.fn(() => ({success: true}));
    (useCheckAndUpdateGrants as jest.Mock).mockImplementation(() => ({
      checkAndUpdateGrants: mockCheckAndUpdateGrants,
    }));

    (encodeAndBroadcastTx as jest.Mock).mockReturnValue(true);

    const initializeState = ({set}: any) => {
      set(appSettingsState, {
        currentChain: {
          stakeCurrency: {
            coinMinimalDenom: 'test',
          },
        },
        contractsConfig: [
          {
            address: 'mockAddress',
            type: 'tips',
          },
        ],
      });
    };

    const {result} = renderHook(() => useSendTip(), {
      wrapper: props => (
        <RecoilRoot initializeState={initializeState}>
          {props.children}
        </RecoilRoot>
      ),
    });

    const mockSendTipArgs = {
      amount: 1,
      sender: 'sender',
      message: 'message',
      postId: 1,
    };

    await act(async () => {
      await result.current.sendTip(mockSendTipArgs);
    });

    expect(encodeAndBroadcastTx).toHaveBeenCalledWith({
      memo: 'message',
      msgs: ['postTipMsg'],
    });
  });

  it('sends user tip', async () => {
    const mockCheckAndUpdateGrants = jest.fn(() => ({success: true}));
    (useCheckAndUpdateGrants as jest.Mock).mockImplementation(() => ({
      checkAndUpdateGrants: mockCheckAndUpdateGrants,
    }));

    (encodeAndBroadcastTx as jest.Mock).mockReturnValue(true);

    const initializeState = ({set}: any) => {
      set(appSettingsState, {
        currentChain: {
          stakeCurrency: {
            coinMinimalDenom: 'test',
          },
        },
        contractsConfig: [
          {
            address: 'mockAddress',
            type: 'tips',
          },
        ],
      });
    };

    const {result} = renderHook(() => useSendTip(), {
      wrapper: props => (
        <RecoilRoot initializeState={initializeState}>
          {props.children}
        </RecoilRoot>
      ),
    });

    const mockSendTipArgs = {
      amount: 1,
      sender: 'sender',
      receiver: 'receiver',
      message: 'message',
    };

    await act(async () => {
      await result.current.sendTip(mockSendTipArgs);
    });

    expect(encodeAndBroadcastTx).toHaveBeenCalledWith({
      memo: 'message',
      msgs: ['userTipMsg'],
    });
  });
});
