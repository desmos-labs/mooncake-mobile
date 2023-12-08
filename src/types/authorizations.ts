import { Coin } from '@cosmjs/stargate';
import { Feegrant } from '@desmoslabs/desmjs';

export const UnsupportedMsgAllowanceTypeUrl = 'butter.v1.UnsupportedMsgAllowance';

/**
 * Contains the information about a single message authorization grant
 * the user has granted to the centralized APIs.
 */
export interface AuthzGrant {
  /**
   * Type url of the message this grant referes to.
   */
  readonly msgTypeUrl: string;
  /**
   * Date at which the grant will expire.
   */
  readonly expiration: Date;
}

export interface BasicAllowance {
  typeUrl: typeof Feegrant.v1beta1.BasicAllowanceTypeUrl;
  /**
   * Fee grant allowance expiration, if undefined
   * means without expiration.
   */
  expiration?: Date;
  /**
   * Allowance spending limits.
   */
  spendingLimit: Coin[];
}

export interface AllowedMsgAllowance {
  typeUrl: typeof Feegrant.v1beta1.AllowedMsgAllowanceTypeUrl;
  /**
   * Nested basic allowance.
   */
  allowance: BasicAllowance;
  /**
   * Messages that can be executed using the fee grant module by the
   * grantee.
   */
  allowedMessages: string[];
}

/**
 * Interface that represents an allowance that is not supported from
 * the application.
 */
export interface UnknownAllowance {
  typeUrl: typeof UnsupportedMsgAllowanceTypeUrl;
  /**
   * Allowance data.
   */
  data: any;
}

export type Allowance = BasicAllowance | AllowedMsgAllowance | UnknownAllowance;

export interface FeeGrant {
  /**
   * Date of grant expiration.
   */
  expirationDate?: Date;
  /**
   * Fee grant allowance.
   */
  allowance: Allowance;
  /**
   * Address of the entity that we can use as granter while broadcasting
   * a transaction.
   */
  readonly granterAddress: string;
}
