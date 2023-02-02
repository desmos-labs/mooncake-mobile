import { act, renderHook } from '@testing-library/react-native';
import useReportPost from 'services/axios/requests/CentralizedBroadcastTx/useReportPost/index';
import useCheckAndUpdateGrants from 'hooks/authGrants/useCheckAndUpdateGrants';
import { encodeAndBroadcastTx } from 'services/axios/requests/CentralizedBroadcastTx';
import { GrantEnums } from 'lib/desmos/msgtypes';
import { MsgCreateReport } from '@desmoslabs/desmjs-types/desmos/reports/v1/msgs';
import EnvConfig from 'config/EnvConfig';
import { convertPostTargetToAny } from '@desmoslabs/desmjs/build/aminomessages/reports';
import { PostTarget } from '@desmoslabs/desmjs-types/desmos/reports/v1/models';
import Long from 'long';

const mockActiveAddress = 'i-am-an-address';

jest.mock('hooks/useActiveAccount', () => jest.fn(() => ({ activeAddress: mockActiveAddress })));
jest.mock('hooks/authGrants/useCheckAndUpdateGrants', () => jest.fn());

jest.mock('services/axios/requests/CentralizedBroadcastTx');

describe('hook: useReportPost', () => {
  it('reports a post', async () => {
    const mockCheckAndUpdateGrants = jest.fn(() => ({ success: true }));
    (useCheckAndUpdateGrants as jest.Mock).mockImplementation(() => ({
      checkAndUpdateGrants: mockCheckAndUpdateGrants,
    }));

    (encodeAndBroadcastTx as jest.Mock).mockReturnValue(true);

    const { result } = renderHook(() => useReportPost());

    const mockReportArgs = {
      postId: 1,
      message: 'message',
      reasonId: 0,
    };

    await act(async () => {
      await result.current.reportPost(mockReportArgs);
    });

    const { postId, message, reasonId } = mockReportArgs;

    const mockMsg = {
      typeUrl: GrantEnums.MsgCreateReport,
      value: MsgCreateReport.fromPartial({
        subspaceId: EnvConfig.APP_SUBSPACE_ID,
        target: convertPostTargetToAny(
          PostTarget.fromPartial({
            postId: Long.fromNumber(postId),
          }),
        ),
        reasonsIds: [reasonId],
        message: message || '',
        reporter: mockActiveAddress,
      }),
    };

    expect(encodeAndBroadcastTx).toHaveBeenCalledWith({ msgs: [mockMsg] });
  });
});
