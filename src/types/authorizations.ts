import { Coin } from '@cosmjs/stargate';
import { AllowedMsgAllowanceTypeUrl, BasicAllowanceTypeUrl } from '@desmoslabs/desmjs';

export const UnsupportedMsgAllowanceTypeUrl = 'butter.v1.UnsupportedMsgAllowance';

/**
 * Contains the information about a single message authorization grant
 * the user has granted to the centralized APIs.
 */
export interface Grant {
  /**
   * Type url of the message this grant referes to.
   */
  readonly msgTypeUrl: string;
  /**
   * Date at which the grant will expire.
   */
  readonly expiration: Date;
}

export interface FeeGrantInfo {
  /**
   * Whether the user has granted the fee grant or not.
   */
  readonly hasFeeGrant: boolean;
}

export interface BasicAllowance {
  typeUrl: typeof BasicAllowanceTypeUrl;
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
  typeUrl: typeof AllowedMsgAllowanceTypeUrl;
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
}

export interface AuthzGrantsInfo {
  /**
   * List of message execution grants the user has granted.
   */
  readonly grants: Grant[];
}

/**
 * Contains the information about all kind of grants the user has
 * granted to the centralized APIs.
 */
export interface AuthorizationsInformation {
  readonly feeGrants: FeeGrant[];
  readonly authz: AuthzGrantsInfo;
  /**
   * List of message type that the user has not granted a
   * fee grant allowance.
   */
  readonly missingFeeGrantPermissions: string[];
  /**
   * List of message type that the user has not granted an
   * authz permission.
   */
  readonly missingAuthzPermissions: string[];
}
