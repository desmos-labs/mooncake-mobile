import GetActiveGrants from 'services/axios/requests/GetActiveGrants';
import {GrantEnums} from 'lib/desmos/msgtypes';
import {checkGrants} from './utils';

jest.mock('services/axios/requests/GetActiveGrants');

describe('hooks: useCheckAndUpdateGrants utils', () => {
  describe('checkGrants', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('returns missing or expired grants', async () => {
      const mockedGetActiveGrantsResponse = {
        user: 'i-am-an-address',

        has_fee_grant: true,

        grants: [
          {
            // the API will return msg_type as a string, but for
            // consistency, the mocks will use the enum values
            msg_type: GrantEnums.MsgCreatePost,
            expiration: '2077-01-01T00:00:00Z',
          },
          {
            // mock an expired grant
            msg_type: GrantEnums.MsgCreateRelationship,
            expiration: '0001-01-01T00:00:00Z',
          },
        ],
      };

      (GetActiveGrants as jest.Mock).mockReturnValue(
        mockedGetActiveGrantsResponse,
      );

      const grantsToCheck = [
        GrantEnums.MsgCreateRelationship,
        GrantEnums.MsgDeleteRelationship,
        GrantEnums.MsgRemoveReaction,
        GrantEnums.MsgCreatePost,
      ];

      const requiredGrants = await checkGrants(grantsToCheck, '123');

      expect(requiredGrants).toEqual([
        GrantEnums.MsgCreateRelationship,
        GrantEnums.MsgDeleteRelationship,
        GrantEnums.MsgRemoveReaction,
      ]);
    });
  });
});
