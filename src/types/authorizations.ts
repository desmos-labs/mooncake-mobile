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
  readonly expiration: string;
}

export interface FeeGrantInfo {
  /**
   * Whether the user has granted the fee grant or not.
   */
  readonly hasFeeGrant: boolean;
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
  readonly feeGrant: FeeGrantInfo;
  readonly authz: AuthzGrantsInfo;
}
