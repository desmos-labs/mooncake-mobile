import {
  Allowance,
  AuthzGrantsInfo,
  BasicAllowance,
  FeeGrant,
  FeeGrantInfo,
  Grant,
  UnsupportedMsgAllowanceTypeUrl,
} from 'types/authorizations';
import { GqlAllowance, GqlFeeGrant } from 'services/graphql/queries/GetAccountFeeGrantAllowance';
import { coin } from '@cosmjs/stargate';
import { AllowedMsgAllowanceTypeUrl, BasicAllowanceTypeUrl } from '@desmoslabs/desmjs';

const convertGrantInfo = (grant: any): Grant => ({
  expiration: grant.expiration,
  msgTypeUrl: grant.msg_type_url,
});

export const convertFeeGrantInfo = (data: any): FeeGrantInfo =>
  ({
    hasFeeGrant: (data?.grants?.aggregate?.count ?? 0) > 0,
  } as FeeGrantInfo);

export const convertAuthzGrantsInfo = (data: any): AuthzGrantsInfo => {
  return {
    grants: data.grants ? data.grants.map(convertGrantInfo) : [],
  };
};

export const convertGraphQLAllowance = (data: GqlAllowance): Allowance => {
  switch (data['@type']) {
    case BasicAllowanceTypeUrl:
      return {
        typeUrl: BasicAllowanceTypeUrl,
        spendingLimit: data.spend_limit.map(c => coin(c.amount, c.denom)),
        expiration: data.expiration ? new Date(data.expiration) : undefined,
      };
    case AllowedMsgAllowanceTypeUrl:
      return {
        typeUrl: AllowedMsgAllowanceTypeUrl,
        allowedMessages: data.allowed_messages,
        allowance: convertGraphQLAllowance(data.allowance) as BasicAllowance,
      };
    default:
      console.warn('unsupported GQL allowance type', data['@type']);
      return {
        typeUrl: UnsupportedMsgAllowanceTypeUrl,
        data,
      };
  }
};

export const convertGraphQLFeeGrant = (data: GqlFeeGrant): FeeGrant => {
  return {
    expirationDate: data.expiration_date ? new Date(`${data.expiration_date}Z`) : undefined,
    allowance: convertGraphQLAllowance(data.allowance),
  };
};
