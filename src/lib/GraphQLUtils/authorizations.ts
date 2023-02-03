import { AuthzGrantsInfo, FeeGrantInfo, Grant } from 'types/authorizations';

const convertGrantInfo = (grant: any): Grant => ({
  expiration: grant.expiration,
  msgTypeUrl: grant.msg_type_url,
});

export const convertFeeGrantInfo = (data: any): FeeGrantInfo =>
  ({
    hasFeeGrant: (data?.grants.aggregate?.count ?? 0) > 0,
  } as FeeGrantInfo);

export const convertAuthzGrantsInfo = (data: any): AuthzGrantsInfo => {
  return {
    grants: data.grants ? data.grants.map(convertGrantInfo) : [],
  };
};
