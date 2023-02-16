import { gql } from '@apollo/client';
import { BasicAllowanceTypeUrl } from '@desmoslabs/desmjs';
import { AllowedMsgAllowanceTypeUrl } from '@desmoslabs/desmjs/build/const/cosmos/feegrant';

/**
 * Query to fetch the list of fee grant allowance.
 */
export const GetAccountFeeGrantAllowance = gql`
  query MyQuery($granteeAddress: String, $granterAddress: String) @api(name: desmos) {
    fee_grant(
      where: {
        grantee_address: { _eq: $granteeAddress }
        granter_address: { _eq: $granterAddress }
      }
    ) {
      expiration_date
      allowance
    }
  }
`;

export interface GqlBasicAllowance {
  '@type': typeof BasicAllowanceTypeUrl;
  expiration: string | null;
  spend_limit: [{ amount: string; denom: string }];
}

export interface GqlAllowedMsgAllowance {
  '@type': typeof AllowedMsgAllowanceTypeUrl;
  allowed_messages: string[];
  allowance: GqlBasicAllowance;
}

export type GqlAllowance = GqlBasicAllowance | GqlAllowedMsgAllowance;

export interface GqlFeeGrant {
  expiration_date: string | null;
  allowance: GqlAllowance;
}

export interface GqlGetAccountFeeGrantAllowance {
  fee_grant: GqlFeeGrant[];
}
