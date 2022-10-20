import {GrantEnums} from 'lib/desmos/msgtypes';
import {
  buildGrantAllowanceEncode,
  buildGrantMsgEncodes,
  buildRevokeAllowanceEncode,
} from './utils';

describe('hooks: useAddOrUpdateGrants utils', () => {
  const grantee = 'i-am-a-grantee';
  const granter = 'i-am-a-granter';
  const grants = [GrantEnums.MsgCreatePost, GrantEnums.MsgCreateRelationship];

  beforeAll(() => {
    jest.useFakeTimers('modern').setSystemTime(new Date('2077-01-01'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('buildRevokeAllowanceEncode', () => {
    it('properly builds a MsgRevokeAllowanceEncodeObject', () => {
      // msgEncodeObject
      const msgEO = buildRevokeAllowanceEncode({grantee, granter});

      expect(msgEO).toEqual({
        typeUrl: '/cosmos.feegrant.v1beta1.MsgRevokeAllowance',
        value: {granter: 'i-am-a-granter', grantee: 'i-am-a-grantee'},
      });
    });
  });

  describe('buildGrantAllowanceEncode', () => {
    it('properly builds a MsgGrantAllowanceEncodeObject', () => {
      const msgEO = buildGrantAllowanceEncode({grantee, granter, grants});

      expect(JSON.stringify(msgEO)).toEqual(
        JSON.stringify({
          typeUrl: '/cosmos.feegrant.v1beta1.MsgGrantAllowance',
          value: {
            granter: 'i-am-a-granter',
            grantee: 'i-am-a-grantee',
            allowance: {
              typeUrl: '/cosmos.feegrant.v1beta1.AllowedMsgAllowance',
              value: {
                type: 'Buffer',
                data: [
                  10, 41, 10, 39, 47, 99, 111, 115, 109, 111, 115, 46, 102, 101,
                  101, 103, 114, 97, 110, 116, 46, 118, 49, 98, 101, 116, 97,
                  49, 46, 66, 97, 115, 105, 99, 65, 108, 108, 111, 119, 97, 110,
                  99, 101, 18, 30, 47, 100, 101, 115, 109, 111, 115, 46, 112,
                  111, 115, 116, 115, 46, 118, 50, 46, 77, 115, 103, 67, 114,
                  101, 97, 116, 101, 80, 111, 115, 116, 18, 46, 47, 100, 101,
                  115, 109, 111, 115, 46, 114, 101, 108, 97, 116, 105, 111, 110,
                  115, 104, 105, 112, 115, 46, 118, 49, 46, 77, 115, 103, 67,
                  114, 101, 97, 116, 101, 82, 101, 108, 97, 116, 105, 111, 110,
                  115, 104, 105, 112,
                ],
              },
            },
          },
        }),
      );
    });
  });

  describe('buildGrantMsgEncodes', () => {
    it('properly builds an array of MsgGRantEncodeObjects', () => {
      const msgEO = buildGrantMsgEncodes({grantee, granter, grants});

      expect(JSON.stringify(msgEO)).toEqual(
        JSON.stringify([
          {
            typeUrl: '/cosmos.authz.v1beta1.MsgGrant',
            value: {
              granter: 'i-am-a-granter',
              grantee: 'i-am-a-grantee',
              grant: {
                authorization: {
                  typeUrl:
                    '/desmos.subspaces.v3.authz.GenericSubspaceAuthorization',
                  value: {
                    type: 'Buffer',
                    data: [
                      10, 1, 5, 18, 30, 47, 100, 101, 115, 109, 111, 115, 46,
                      112, 111, 115, 116, 115, 46, 118, 50, 46, 77, 115, 103,
                      67, 114, 101, 97, 116, 101, 80, 111, 115, 116,
                    ],
                  },
                },
                expiration: {
                  seconds: {low: -602922496, high: 0, unsigned: false},
                  nanos: 0,
                },
              },
            },
          },
          {
            typeUrl: '/cosmos.authz.v1beta1.MsgGrant',
            value: {
              granter: 'i-am-a-granter',
              grantee: 'i-am-a-grantee',
              grant: {
                authorization: {
                  typeUrl:
                    '/desmos.subspaces.v3.authz.GenericSubspaceAuthorization',
                  value: {
                    type: 'Buffer',
                    data: [
                      10, 1, 5, 18, 46, 47, 100, 101, 115, 109, 111, 115, 46,
                      114, 101, 108, 97, 116, 105, 111, 110, 115, 104, 105, 112,
                      115, 46, 118, 49, 46, 77, 115, 103, 67, 114, 101, 97, 116,
                      101, 82, 101, 108, 97, 116, 105, 111, 110, 115, 104, 105,
                      112,
                    ],
                  },
                },
                expiration: {
                  seconds: {low: -602922496, high: 0, unsigned: false},
                  nanos: 0,
                },
              },
            },
          },
        ]),
      );
    });
  });

  /*  describe('buildRevokeGrantMsgEncodes', () => {
    it('properly builds an array og MsgRevokeEncodeObjects', () => {
      const msgEO = buildRevokeGrantMsgEncodes({grants, grantee, granter});

      expect(msgEO).toEqual([
        {
          typeUrl: '/cosmos.authz.v1beta1.MsgRevoke',
          value: {
            granter: 'i-am-a-granter',
            grantee: 'i-am-a-grantee',
            msgTypeUrl: '/desmos.posts.v2.MsgCreatePost',
          },
        },
        {
          typeUrl: '/cosmos.authz.v1beta1.MsgRevoke',
          value: {
            granter: 'i-am-a-granter',
            grantee: 'i-am-a-grantee',
            msgTypeUrl: '/desmos.relationships.v1.MsgCreateRelationship',
          },
        },
      ]);
    });
  }); */
});
