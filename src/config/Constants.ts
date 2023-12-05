/**
 * Interface that defines all the constants of the application.
 */
export interface ButterConstants {
  readonly apiEndpoint: string;
  readonly subspaceId: number;
}

/**
 * Default values for the application's constants.
 */
export const Constants: ButterConstants = {
  apiEndpoint: 'https://api.mainnet.butter.social',
  subspaceId: 6,
};
