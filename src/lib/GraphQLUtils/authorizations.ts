import { Coin, coin } from '@cosmjs/stargate';
import { Feegrant } from '@desmoslabs/desmjs';
import {
  Allowance,
  AllowedMsgAllowance,
  BasicAllowance,
  FeeGrant,
  UnknownAllowance,
  UnsupportedMsgAllowanceTypeUrl,
} from 'types/authorizations';

export const convertGraphQLAllowance = (data: any): Allowance => {
  switch (data['@type']) {
    case Feegrant.v1beta1.BasicAllowanceTypeUrl:
      return {
        typeUrl: Feegrant.v1beta1.BasicAllowanceTypeUrl,
        spendingLimit: data.spend_limit.map((c: Coin) => coin(c.amount, c.denom)),
        expiration: data.expiration ? new Date(data.expiration) : undefined,
      } as BasicAllowance;
    case Feegrant.v1beta1.AllowedMsgAllowanceTypeUrl:
      return {
        typeUrl: Feegrant.v1beta1.AllowedMsgAllowanceTypeUrl,
        allowedMessages: data.allowed_messages,
        allowance: convertGraphQLAllowance(data.allowance) as BasicAllowance,
      } as AllowedMsgAllowance;
    default:
      console.warn('unsupported GQL allowance type', data['@type']);
      return {
        typeUrl: UnsupportedMsgAllowanceTypeUrl,
        data,
      } as UnknownAllowance;
  }
};

export const convertGraphQLFeeGrant = (data: any): FeeGrant => {
  return {
    expirationDate: data.allowance.expiration
      ? new Date(`${data.allowance.expiration}Z`)
      : undefined,
    allowance: convertGraphQLAllowance(data.allowance),
    granterAddress: data.granterAddress,
  };
};
