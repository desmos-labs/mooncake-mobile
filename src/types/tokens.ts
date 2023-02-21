/**
 * Contains the information of a given token price.
 */
export interface TokenPrice {
  /**
   * Denomination of the token.
   */
  readonly denom: string;
  /**
   * Exponent of the denomination.
   */
  readonly exponent: number;
  /**
   * Price of the token.
   */
  readonly price: number;
}
