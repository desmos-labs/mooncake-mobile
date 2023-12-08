import { Coin, coin } from '@cosmjs/stargate';
import { Feegrant } from '@desmoslabs/desmjs';
import {
  Allowance,
  BasicAllowance,
  FeeGrant,
  UnsupportedMsgAllowanceTypeUrl,
} from 'types/authorizations';

const convertGraphQLAllowance = (data: any): Allowance => {
  switch (data['@type']) {
    case Feegrant.v1beta1.BasicAllowanceTypeUrl:
      return {
        typeUrl: Feegrant.v1beta1.BasicAllowanceTypeUrl,
        spendingLimit: data.spend_limit.map((c: Coin) => coin(c.amount, c.denom)),
        expiration: data.expiration ? new Date(data.expiration) : undefined,
      };
    case Feegrant.v1beta1.AllowedMsgAllowanceTypeUrl:
      return {
        typeUrl: Feegrant.v1beta1.AllowedMsgAllowanceTypeUrl,
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

// It's fine to disable the eslint rule here since we might want to add more in the future
// eslint-disable-next-line import/prefer-default-export
export const convertGraphQLFeeGrant = (data: any): FeeGrant => {
  return {
    expirationDate: data.allowance.expiration
      ? new Date(`${data.allowance.expiration}Z`)
      : undefined,
    allowance: convertGraphQLAllowance(data.allowance),
    granterAddress: data.granterAddress,
  };
};
