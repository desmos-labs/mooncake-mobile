interface GraphQLTokenPrice {
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

/**
 * Convert the GraphQL response into a list of token prices.
 * @param data {any} - The GraphQL response.
 */
// It's fine to disable the eslint rule here, since this is a utility function
// eslint-disable-next-line import/prefer-default-export
export const convertGraphQLTokenPrice = (data: any): GraphQLTokenPrice[] => {
  return (data?.tokens ?? [])
    .flatMap((token: any) => token.units)
    .map((unit: any) => {
      return {
        price: unit.price?.price ?? 0,
        exponent: unit.exponent ?? 0,
        denom: unit.denom,
      } as GraphQLTokenPrice;
    });
};
