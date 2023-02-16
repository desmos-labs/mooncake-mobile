import {
  Allowance,
  AuthzGrant,
  BasicAllowance,
  FeeGrant,
  UnsupportedMsgAllowanceTypeUrl,
} from 'types/authorizations';
import { GqlAllowance, GqlFeeGrant } from 'services/graphql/queries/GetAccountFeeGrantAllowance';
import { coin } from '@cosmjs/stargate';
import { AllowedMsgAllowanceTypeUrl, BasicAllowanceTypeUrl } from '@desmoslabs/desmjs';
import { GQLAuthzGrant } from 'services/graphql/queries/GetAccountAuthzGrants';

export const convertGraphQLAuthzGrant = (grant: GQLAuthzGrant): AuthzGrant => {
  return {
    msgTypeUrl: grant.msg_type_url,
    expiration: new Date(`${grant.expiration}Z`),
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
